import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameResult, GAME_CONSTANTS } from './types';
import { sound } from './utils/audio';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { GameCanvas } from './components/GameCanvas';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HighScoreModal } from './components/HighScoreModal';
import { PauseModal } from './components/PauseModal';
import { ResultModal } from './components/ResultModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [gameKey, setGameKey] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(() => sound.isEnabled());
  const [highScore, setHighScore] = useState<number>(0);
  
  // Active HUD Stats
  const [hudScore, setHudScore] = useState(0);
  const [hudTargetScore, setHudTargetScore] = useState(100);
  const [hudTime, setHudTime] = useState(GAME_CONSTANTS.TOTAL_TIME_SECONDS);
  const [hudBombs, setHudBombs] = useState(0);
  const [hudPhase, setHudPhase] = useState(1);

  // Modals & Results
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showHighScore, setShowHighScore] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // Load High Score on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GAME_CONSTANTS.LOCAL_STORAGE_HIGH_SCORE_KEY);
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch {
      // Ignore
    }
  }, []);

  const refreshHighScore = useCallback(() => {
    try {
      const saved = localStorage.getItem(GAME_CONSTANTS.LOCAL_STORAGE_HIGH_SCORE_KEY);
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  // Manage cheerful background music according to game state
  useEffect(() => {
    if (gameState === 'PLAYING') {
      sound.startBGM();
    } else if (gameState === 'PAUSED') {
      sound.pauseBGM();
    } else {
      sound.stopBGM();
    }
  }, [gameState]);

  // Clean up BGM on unmount
  useEffect(() => {
    return () => {
      sound.stopBGM();
    };
  }, []);

  const handleStartGame = () => {
    setHudScore(0);
    setHudTargetScore(100);
    setHudTime(GAME_CONSTANTS.TOTAL_TIME_SECONDS);
    setHudBombs(0);
    setHudPhase(1);
    setGameResult(null);
    setGameKey((prev) => prev + 1);
    setGameState('PLAYING');
  };

  const handlePauseGame = () => {
    if (gameState === 'PLAYING') {
      sound.playButtonClick();
      setShowResetConfirm(false);
      setGameState('PAUSED');
    }
  };

  const handleResumeGame = () => {
    setShowResetConfirm(false);
    setGameState('PLAYING');
  };

  const handleRestartGame = () => {
    setShowResetConfirm(false);
    handleStartGame();
  };

  const handleRequestReset = () => {
    sound.playButtonClick();
    // If player hasn't scored or hit any bombs yet, quick reset immediately
    if (hudScore === 0 && hudBombs === 0 && hudTime >= GAME_CONSTANTS.TOTAL_TIME_SECONDS - 5) {
      handleRestartGame();
      return;
    }
    // Pause game and open friendly confirmation popup so player doesn't accidentally lose progress
    setGameState('PAUSED');
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    setShowResetConfirm(false);
    handleRestartGame();
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
    handleResumeGame();
  };

  const handleMainMenu = () => {
    setShowResetConfirm(false);
    refreshHighScore();
    setGameState('MENU');
    setGameResult(null);
  };

  const handleUpdateHUD = useCallback(
    (score: number, timeRemaining: number, bombsHit: number, phase: number, targetScore: number) => {
      setHudScore(score);
      setHudTime(timeRemaining);
      setHudBombs(bombsHit);
      setHudPhase(phase);
      setHudTargetScore(targetScore);
    },
    []
  );

  const handleGameOver = useCallback(
    (result: GameResult) => {
      refreshHighScore();
      setGameResult(result);
      setGameState('RESULT');
    },
    [refreshHighScore]
  );

  const handleResetHighScore = () => {
    try {
      localStorage.removeItem(GAME_CONSTANTS.LOCAL_STORAGE_HIGH_SCORE_KEY);
      setHighScore(0);
    } catch {
      // Ignore
    }
  };

  // Keyboard shortcut for pause / resume / reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (gameState === 'PLAYING') {
          handlePauseGame();
        } else if (gameState === 'PAUSED' && !showResetConfirm) {
          handleResumeGame();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        if (gameState === 'PLAYING') {
          handleRequestReset();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, showResetConfirm, hudScore, hudBombs, hudTime]);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 font-['Fredoka',sans-serif]">
      
      {/* Background Ambience Layer for Menu & Modals */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-10 left-10 text-7xl animate-float">🍎</div>
          <div className="absolute top-1/4 right-8 text-7xl animate-float" style={{ animationDelay: '1.2s' }}>🍊</div>
          <div className="absolute bottom-20 left-12 text-7xl animate-float" style={{ animationDelay: '2s' }}>🍌</div>
          <div className="absolute bottom-1/3 right-16 text-7xl animate-float" style={{ animationDelay: '0.6s' }}>🍉</div>
          <div className="absolute top-1/3 left-1/4 text-6xl animate-float" style={{ animationDelay: '1.8s' }}>✨🍓</div>
        </div>
      )}

      {/* Main Game Container */}
      <main className="relative w-full h-full max-w-lg sm:max-h-[860px] sm:rounded-3xl sm:shadow-2xl overflow-hidden bg-sky-200 flex flex-col border-0 sm:border-4 sm:border-amber-300">
        
        {/* State 1: MAIN MENU */}
        {gameState === 'MENU' && (
          <MainMenu
            highScore={highScore}
            soundEnabled={soundEnabled}
            onPlay={handleStartGame}
            onHowToPlay={() => setShowHowToPlay(true)}
            onHighScore={() => setShowHighScore(true)}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* State 2 & 3: PLAYING or PAUSED Canvas View */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Top HUD */}
            <HUD
              score={hudScore}
              targetScore={hudTargetScore}
              timeRemaining={hudTime}
              bombsHit={hudBombs}
              currentPhase={hudPhase}
              soundEnabled={soundEnabled}
              onPause={handlePauseGame}
              onReset={handleRequestReset}
              onToggleSound={handleToggleSound}
            />

            {/* Canvas */}
            <GameCanvas
              key={gameKey}
              isPaused={gameState === 'PAUSED'}
              onUpdateHUD={handleUpdateHUD}
              onGameOver={handleGameOver}
            />
          </div>
        )}

        {/* State 4: PAUSED OVERLAY */}
        {gameState === 'PAUSED' && !showResetConfirm && (
          <PauseModal
            score={hudScore}
            targetScore={hudTargetScore}
            timeRemaining={hudTime}
            soundEnabled={soundEnabled}
            onResume={handleResumeGame}
            onRestart={handleRestartGame}
            onMainMenu={handleMainMenu}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Modal: RESET CONFIRMATION */}
        {showResetConfirm && (
          <ResetConfirmModal
            score={hudScore}
            targetScore={hudTargetScore}
            phase={hudPhase}
            timeRemaining={hudTime}
            onConfirm={handleConfirmReset}
            onCancel={handleCancelReset}
          />
        )}

        {/* State 5: RESULT SCREEN (WIN or GAME OVER) */}
        {gameState === 'RESULT' && gameResult && (
          <ResultModal
            result={gameResult}
            onPlayAgain={handleStartGame}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* Modal: HOW TO PLAY */}
        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}

        {/* Modal: HIGH SCORE */}
        {showHighScore && (
          <HighScoreModal
            highScore={highScore}
            onClose={() => setShowHighScore(false)}
            onResetHighScore={handleResetHighScore}
          />
        )}

      </main>

    </div>
  );
}
