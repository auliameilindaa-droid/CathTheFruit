import React, { useRef, useEffect, useCallback } from 'react';
import {
  FallingObject,
  FruitType,
  GameResult,
  ObjectType,
  Particle,
  ScorePopup,
  GAME_CONSTANTS,
  PHASES,
  Rating,
} from '../types';
import {
  drawOrchardBackground,
  drawBasket,
  drawFallingObject,
  drawParticles,
  drawScorePopups,
} from '../utils/canvasRenderers';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  isPaused: boolean;
  onUpdateHUD: (score: number, timeRemaining: number, bombsHit: number, phase: number, targetScore: number) => void;
  onGameOver: (result: GameResult) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  isPaused,
  onUpdateHUD,
  onGameOver,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game state held in refs for 60fps loop
  const stateRef = useRef({
    score: 0,
    timeRemaining: GAME_CONSTANTS.TOTAL_TIME_SECONDS,
    bombsHit: 0,
    currentPhaseIndex: 0,
    fruitsCaught: 0,
    goldenCaught: 0,
    basketX: (GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH - GAME_CONSTANTS.BASKET_WIDTH) / 2,
    basketSpeed: 0,
    tiltAngle: 0,
    objects: [] as FallingObject[],
    particles: [] as Particle[],
    popups: [] as ScorePopup[],
    nextSpawnTime: 0,
    elapsedTime: 0,
    screenShake: 0,
    phaseBanner: null as { title: string; subtitle: string; timer: number } | null,
    isEnded: false,
    keys: {
      left: false,
      right: false,
    },
    isDragging: false,
    dragTargetX: null as number | null,
  });

  const nextObjectIdRef = useRef(1);
  const nextPopupIdRef = useRef(1);

  // Rating calculation aligned with 100 / 200 / 300 phase milestones
  const computeRating = (finalScore: number): { rating: Rating; stars: number } => {
    if (finalScore >= 300) return { rating: 'EXCELLENT', stars: 3 };
    if (finalScore >= 200) return { rating: 'GREAT', stars: 3 };
    if (finalScore >= 100) return { rating: 'GOOD', stars: 2 };
    return { rating: 'TRY AGAIN', stars: 1 };
  };

  // High score checker
  const handleHighScoreCheck = (finalScore: number): boolean => {
    try {
      const saved = localStorage.getItem(GAME_CONSTANTS.LOCAL_STORAGE_HIGH_SCORE_KEY);
      const currentHigh = saved ? parseInt(saved, 10) : 0;
      if (finalScore > currentHigh) {
        localStorage.setItem(GAME_CONSTANTS.LOCAL_STORAGE_HIGH_SCORE_KEY, String(finalScore));
        return true;
      }
    } catch {
      // Storage fallback
    }
    return false;
  };

  // End game handler
  const triggerEndGame = useCallback(
    (reason: 'TIME_UP_WIN' | 'TIME_UP_LOSE' | 'TOO_MANY_BOMBS' | 'MAX_SCORE_WIN') => {
      const s = stateRef.current;
      if (s.isEnded) return;
      s.isEnded = true;

      const isWin = reason === 'TIME_UP_WIN' || reason === 'MAX_SCORE_WIN';
      const { rating, stars } = computeRating(s.score);
      const isNewHighScore = handleHighScoreCheck(s.score);
      const targetScore = PHASES[s.currentPhaseIndex]?.targetScore || 100;

      onGameOver({
        isWin,
        score: s.score,
        targetScore,
        timeRemaining: Math.max(0, Math.round(s.timeRemaining)),
        bombsHit: s.bombsHit,
        fruitsCaught: s.fruitsCaught,
        goldenCaught: s.goldenCaught,
        rating,
        stars,
        isNewHighScore,
        reason,
      });
    },
    [onGameOver]
  );

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || stateRef.current.isEnded) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        stateRef.current.keys.left = true;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        stateRef.current.keys.right = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        stateRef.current.keys.left = false;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        stateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused]);

  // Pointer / Touch direct drag listener
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || stateRef.current.isEnded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH / rect.width;
    const clickX = (e.clientX - rect.left) * scaleX;

    stateRef.current.isDragging = true;
    stateRef.current.dragTargetX = clickX - GAME_CONSTANTS.BASKET_WIDTH / 2;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isDragging || isPaused || stateRef.current.isEnded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH / rect.width;
    const clickX = (e.clientX - rect.left) * scaleX;

    stateRef.current.dragTargetX = clickX - GAME_CONSTANTS.BASKET_WIDTH / 2;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
    stateRef.current.isDragging = false;
    stateRef.current.dragTargetX = null;
  };

  // Particle creators
  const spawnFruitParticles = (x: number, y: number, color: string) => {
    const particles = stateRef.current.particles;
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 180 + 60;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        color,
        size: Math.random() * 5 + 3,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
        shape: 'circle',
      });
    }
  };

  const spawnGoldenParticles = (x: number, y: number) => {
    const particles = stateRef.current.particles;
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 220 + 80;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        color: i % 2 === 0 ? '#ffd700' : '#ffffff',
        size: Math.random() * 6 + 4,
        alpha: 1,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.4,
        shape: 'star',
      });
    }
  };

  const spawnBombParticles = (x: number, y: number) => {
    const particles = stateRef.current.particles;
    // Smoke
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 120 + 40;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 80,
        color: '#444444',
        size: Math.random() * 12 + 6,
        alpha: 0.9,
        life: 0,
        maxLife: 0.6,
        shape: 'smoke',
      });
    }
    // Sparks
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 260 + 100;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 120,
        color: '#ff3d00',
        size: Math.random() * 5 + 3,
        alpha: 1,
        life: 0,
        maxLife: 0.45,
        shape: 'circle',
      });
    }
  };

  // Score popup creator
  const addScorePopup = (text: string, x: number, y: number, color: string) => {
    stateRef.current.popups.push({
      id: nextPopupIdRef.current++,
      text,
      x,
      y,
      color,
      alpha: 1,
      scale: 0.7,
      createdAt: performance.now(),
    });
  };

  // Main game loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // cap dt at 100ms
      lastTime = currentTime;

      const s = stateRef.current;

      // When game is paused or already ended, skip physics update but re-draw
      if (!isPaused && !s.isEnded) {
        // 1. Update Timer
        s.timeRemaining -= dt;
        s.elapsedTime += dt;

        if (s.timeRemaining <= 0) {
          s.timeRemaining = 0;
          if (s.score >= 100) {
            triggerEndGame('TIME_UP_WIN');
          } else {
            triggerEndGame('TIME_UP_LOSE');
          }
        }

        // 2. Determine Phase based on score
        // Fase 1: skor 0 sampai 100 (target: 100)
        // Fase 2: skor 100 sampai 200 (target: 200)
        // Fase 3: skor 200 sampai 300 (target: 300)
        if (s.score >= 300) {
          triggerEndGame('MAX_SCORE_WIN');
        } else if (s.score >= 200 && s.currentPhaseIndex < 2) {
          s.currentPhaseIndex = 2;
          const currentPhaseConfig = PHASES[2];
          s.phaseBanner = {
            title: currentPhaseConfig.name,
            subtitle: 'Target 200 Tercapai! Batas Baru: 300 Poin',
            timer: 2.2,
          };
          sound.playPhaseChange();
        } else if (s.score >= 100 && s.currentPhaseIndex < 1) {
          s.currentPhaseIndex = 1;
          const currentPhaseConfig = PHASES[1];
          s.phaseBanner = {
            title: currentPhaseConfig.name,
            subtitle: 'Target 100 Tercapai! Batas Baru: 200 Poin',
            timer: 2.2,
          };
          sound.playPhaseChange();
        }

        // Phase banner countdown
        if (s.phaseBanner) {
          s.phaseBanner.timer -= dt;
          if (s.phaseBanner.timer <= 0) {
            s.phaseBanner = null;
          }
        }

        // 3. Update Basket Position
        let moveDir = 0;
        if (s.keys.left) moveDir -= 1;
        if (s.keys.right) moveDir += 1;

        if (s.isDragging && s.dragTargetX !== null) {
          const diff = s.dragTargetX - s.basketX;
          s.basketX += diff * Math.min(1, dt * 26);
          moveDir = Math.sign(diff);
        } else if (moveDir !== 0) {
          s.basketX += moveDir * GAME_CONSTANTS.BASKET_SPEED * dt;
        }

        // Clamp basket within virtual bounds
        const maxBasketX = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH - GAME_CONSTANTS.BASKET_WIDTH;
        s.basketX = Math.max(0, Math.min(maxBasketX, s.basketX));

        // Tilt effect
        const targetTilt = moveDir * 0.08;
        s.tiltAngle += (targetTilt - s.tiltAngle) * Math.min(1, dt * 14);

        // 4. Spawning System
        const phaseConfig = PHASES[s.currentPhaseIndex];
        if (currentTime >= s.nextSpawnTime) {
          // Calculate next spawn interval
          const interval =
            Math.random() * (phaseConfig.maxSpawnMs - phaseConfig.minSpawnMs) +
            phaseConfig.minSpawnMs;
          s.nextSpawnTime = currentTime + interval;

          // Determine object type
          const roll = Math.random();
          let type: ObjectType = 'FRUIT';
          let fruitType: FruitType | undefined;

          if (roll < phaseConfig.bombChance) {
            type = 'BOMB';
          } else if (roll < phaseConfig.bombChance + phaseConfig.goldenChance) {
            type = 'GOLDEN_STRAWBERRY';
          } else {
            type = 'FRUIT';
            const fruits: FruitType[] = ['APPLE', 'ORANGE', 'BANANA', 'WATERMELON'];
            fruitType = fruits[Math.floor(Math.random() * fruits.length)];
          }

          // Random horizontal position within playfield
          const size = 52;
          const spawnMargin = 20;
          const x =
            Math.random() *
              (GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH - size - spawnMargin * 2) +
            spawnMargin;
          const speed =
            Math.random() * (phaseConfig.maxSpeed - phaseConfig.minSpeed) +
            phaseConfig.minSpeed;

          s.objects.push({
            id: nextObjectIdRef.current++,
            type,
            fruitType,
            x,
            y: -60,
            width: size,
            height: size,
            speed,
            rotation: (Math.random() - 0.5) * 0.4,
            rotationSpeed: (Math.random() - 0.5) * 1.5,
          });
        }

        // 5. Update Falling Objects & Collision Detection
        const basketY = 705;
        const basketW = GAME_CONSTANTS.BASKET_WIDTH;
        const basketH = GAME_CONSTANTS.BASKET_HEIGHT;

        // Basket Catch Zone (upper rim of basket)
        const catchZone = {
          left: s.basketX + 10,
          right: s.basketX + basketW - 10,
          top: basketY + 6,
          bottom: basketY + 34,
        };

        for (let i = s.objects.length - 1; i >= 0; i--) {
          const obj = s.objects[i];
          obj.y += obj.speed * dt;
          obj.rotation += obj.rotationSpeed * dt;

          const objCenterX = obj.x + obj.width / 2;
          const objBottomY = obj.y + obj.height * 0.85;

          // Collision Check
          const isCaught =
            objCenterX >= catchZone.left &&
            objCenterX <= catchZone.right &&
            objBottomY >= catchZone.top &&
            objBottomY <= catchZone.bottom;

          if (isCaught) {
            const currentPhaseObj = PHASES[s.currentPhaseIndex] || PHASES[0];

            if (obj.type === 'FRUIT') {
              const earnedScore = currentPhaseObj.fruitScore;
              s.score += earnedScore;
              s.fruitsCaught += 1;

              const fruitColors: Record<FruitType, string> = {
                APPLE: '#ff4d4d',
                ORANGE: '#ff9800',
                BANANA: '#ffeb3b',
                WATERMELON: '#e91e63',
              };
              spawnFruitParticles(objCenterX, objBottomY, fruitColors[obj.fruitType || 'APPLE']);
              addScorePopup(`+${earnedScore}`, objCenterX, catchZone.top - 10, '#22c55e');
              sound.playFruitCatch();
            } else if (obj.type === 'GOLDEN_STRAWBERRY') {
              const earnedScore = currentPhaseObj.goldenScore;
              s.score += earnedScore;
              s.goldenCaught += 1;

              spawnGoldenParticles(objCenterX, objBottomY);
              addScorePopup(`+${earnedScore}`, objCenterX, catchZone.top - 15, '#fbbf24');
              sound.playGoldenCatch();
            } else if (obj.type === 'BOMB') {
              s.score = Math.max(0, s.score - GAME_CONSTANTS.BOMB_SCORE_PENALTY);
              s.bombsHit += 1;
              s.screenShake = 0.35; // 350ms screen shake

              spawnBombParticles(objCenterX, objBottomY);
              addScorePopup('-10', objCenterX, catchZone.top - 10, '#ef4444');
              sound.playBombHit();

              // Check if 3 bombs reached
              if (s.bombsHit >= GAME_CONSTANTS.MAX_BOMBS) {
                s.objects.splice(i, 1);
                triggerEndGame('TOO_MANY_BOMBS');
                break;
              }
            }

            // Immediate check for target completion & phase upgrade upon catching
            if (s.score >= 300) {
              s.objects.splice(i, 1);
              triggerEndGame('MAX_SCORE_WIN');
              break;
            } else if (s.score >= 200 && s.currentPhaseIndex < 2) {
              s.currentPhaseIndex = 2;
              const currentPhaseConfig = PHASES[2];
              s.phaseBanner = {
                title: currentPhaseConfig.name,
                subtitle: 'Target 200 Tercapai! Batas Baru: 300 Poin',
                timer: 2.2,
              };
              sound.playPhaseChange();
            } else if (s.score >= 100 && s.currentPhaseIndex < 1) {
              s.currentPhaseIndex = 1;
              const currentPhaseConfig = PHASES[1];
              s.phaseBanner = {
                title: currentPhaseConfig.name,
                subtitle: 'Target 100 Tercapai! Batas Baru: 200 Poin',
                timer: 2.2,
              };
              sound.playPhaseChange();
            }

            s.objects.splice(i, 1);
            continue;
          }

          // Remove object if it passed below screen
          if (obj.y > GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT + 50) {
            s.objects.splice(i, 1);
          }
        }

        // 6. Update Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.life += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 380 * dt; // gravity
          p.alpha = 1 - p.life / p.maxLife;

          if (p.life >= p.maxLife) {
            s.particles.splice(i, 1);
          }
        }

        // 7. Update Score Popups
        for (let i = s.popups.length - 1; i >= 0; i--) {
          const pop = s.popups[i];
          const age = (currentTime - pop.createdAt) / 1000;
          pop.y -= 50 * dt;
          pop.scale = Math.min(1.2, 0.7 + age * 1.5);
          pop.alpha = 1 - age / 0.85;

          if (age >= 0.85) {
            s.popups.splice(i, 1);
          }
        }

        // 8. Screen shake decay
        if (s.screenShake > 0) {
          s.screenShake -= dt;
          if (s.screenShake < 0) s.screenShake = 0;
        }

        // 9. Sync HUD periodically
        const currentTarget = PHASES[s.currentPhaseIndex]?.targetScore || 100;
        onUpdateHUD(s.score, s.timeRemaining, s.bombsHit, s.currentPhaseIndex + 1, currentTarget);
      }

      // --- RENDERING PHASE ---
      ctx.save();

      // Screen shake transform
      if (s.screenShake > 0) {
        const shakeMagnitude = s.screenShake * 16;
        const dx = (Math.random() - 0.5) * shakeMagnitude;
        const dy = (Math.random() - 0.5) * shakeMagnitude;
        ctx.translate(dx, dy);
      }

      // Draw background
      drawOrchardBackground(
        ctx,
        GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH,
        GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT,
        currentTime / 1000
      );

      // Draw falling objects
      s.objects.forEach(obj => {
        drawFallingObject(ctx, obj, currentTime / 1000);
      });

      // Draw Basket
      drawBasket(
        ctx,
        s.basketX,
        705,
        GAME_CONSTANTS.BASKET_WIDTH,
        GAME_CONSTANTS.BASKET_HEIGHT,
        s.tiltAngle
      );

      // Draw Particles
      drawParticles(ctx, s.particles);

      // Draw Score Popups
      drawScorePopups(ctx, s.popups);

      // Draw Phase Transition Banner if active
      if (s.phaseBanner) {
        ctx.save();
        const progress = Math.min(1, (2.0 - s.phaseBanner.timer) / 0.3);
        const scale = 0.8 + 0.2 * progress;
        const alpha = Math.min(1, s.phaseBanner.timer / 0.4);

        ctx.globalAlpha = Math.max(0, alpha);
        ctx.translate(
          GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH / 2,
          GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT * 0.38
        );
        ctx.scale(scale, scale);

        // Banner box background
        ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-220, -55, 440, 110, 24);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Title
        ctx.font = '800 32px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffde59';
        ctx.fillText(s.phaseBanner.title, 0, -14);

        // Subtitle
        ctx.font = '700 18px Nunito, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(s.phaseBanner.subtitle, 0, 24);

        ctx.restore();
      }

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, triggerEndGame, onUpdateHUD]);

  // Canvas scaling & resize observer to support all screen resolutions & DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Match canvas internal resolution to virtual aspect ratio
      canvas.width = GAME_CONSTANTS.CANVAS_VIRTUAL_WIDTH * dpr;
      canvas.height = GAME_CONSTANTS.CANVAS_VIRTUAL_HEIGHT * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-sky-200 select-none touch-none"
    >
      <canvas
        ref={canvasRef}
        id="game-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full max-w-[600px] max-h-[800px] object-contain shadow-2xl cursor-grab active:cursor-grabbing border-x border-amber-300/30"
        style={{ aspectRatio: '3 / 4' }}
      />
    </div>
  );
};
