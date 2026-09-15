export type GameState = 'MENU' | 'HOW_TO_PLAY' | 'PLAYING' | 'PAUSED' | 'RESULT';

export type FruitType = 'APPLE' | 'ORANGE' | 'BANANA' | 'WATERMELON';

export type ObjectType = 'FRUIT' | 'GOLDEN_STRAWBERRY' | 'BOMB';

export interface FallingObject {
  id: number;
  type: ObjectType;
  fruitType?: FruitType;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  swayAmplitude?: number;
  swayFrequency?: number;
  sparkleTimer?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'smoke' | 'confetti';
}

export interface ScorePopup {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  scale: number;
  createdAt: number;
}

export interface PhaseConfig {
  phase: number;
  name: string;
  subtitle: string;
  minSpawnMs: number;
  maxSpawnMs: number;
  minSpeed: number;
  maxSpeed: number;
  bombChance: number;
  goldenChance: number;
  fruitScore: number;
  goldenScore: number;
  targetScore: number;
}

export type Rating = 'TRY AGAIN' | 'GOOD' | 'GREAT' | 'EXCELLENT';

export interface GameResult {
  isWin: boolean;
  score: number;
  targetScore: number;
  timeRemaining: number;
  bombsHit: number;
  fruitsCaught: number;
  goldenCaught: number;
  rating: Rating;
  stars: number;
  isNewHighScore: boolean;
  reason: 'TIME_UP_WIN' | 'TIME_UP_LOSE' | 'TOO_MANY_BOMBS' | 'MAX_SCORE_WIN';
}

export const GAME_CONSTANTS = {
  TOTAL_TIME_SECONDS: 120,
  TARGET_SCORE: 100,
  FINAL_TARGET_SCORE: 300,
  MAX_BOMBS: 3,
  CANVAS_VIRTUAL_WIDTH: 600,
  CANVAS_VIRTUAL_HEIGHT: 800,
  BASKET_WIDTH: 108,
  BASKET_HEIGHT: 68,
  BASKET_SPEED: 520, // pixels per second
  NORMAL_FRUIT_SCORE: 10,
  GOLDEN_STRAWBERRY_SCORE: 20,
  BOMB_SCORE_PENALTY: 10,
  LOCAL_STORAGE_HIGH_SCORE_KEY: 'catch_the_fruit_high_score',
  LOCAL_STORAGE_SOUND_KEY: 'catch_the_fruit_sound_enabled',
};

export const PHASES: PhaseConfig[] = [
  {
    phase: 1,
    name: 'FASE 1 — SLOW',
    subtitle: 'Kumpulkan buah menuju batas skor 100!',
    minSpawnMs: 900,
    maxSpawnMs: 1200,
    minSpeed: 170,
    maxSpeed: 230,
    bombChance: 0.10,
    goldenChance: 0.08,
    fruitScore: 10,
    goldenScore: 20,
    targetScore: 100,
  },
  {
    phase: 2,
    name: 'FASE 2 — MEDIUM',
    subtitle: 'Kecepatan Meningkat! Kejar batas skor 200!',
    minSpawnMs: 650,
    maxSpawnMs: 900,
    minSpeed: 250,
    maxSpeed: 330,
    bombChance: 0.18,
    goldenChance: 0.11,
    fruitScore: 20,
    goldenScore: 40,
    targetScore: 200,
  },
  {
    phase: 3,
    name: 'FASE 3 — FAST',
    subtitle: 'Fast Mode! Tuntaskan batas puncak 300!',
    minSpawnMs: 400,
    maxSpawnMs: 700,
    minSpeed: 350,
    maxSpeed: 450,
    bombChance: 0.24,
    goldenChance: 0.13,
    fruitScore: 30,
    goldenScore: 60,
    targetScore: 300,
  },
];
