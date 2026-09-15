import React from 'react';
import { Pause, Volume2, VolumeX, Bomb, Trophy, Clock, Music, RotateCcw } from 'lucide-react';
import { GAME_CONSTANTS } from '../types';

interface HUDProps {
  score: number;
  targetScore: number;
  timeRemaining: number;
  bombsHit: number;
  currentPhase: number;
  soundEnabled: boolean;
  onPause: () => void;
  onReset: () => void;
  onToggleSound: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  targetScore,
  timeRemaining,
  bombsHit,
  currentPhase,
  soundEnabled,
  onPause,
  onReset,
  onToggleSound,
}) => {
  // Format MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isTimeCritical = timeRemaining <= 20;

  return (
    <header className="absolute top-0 left-0 right-0 p-2 sm:p-3 pointer-events-none z-30">
      <div className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-lg border-2 border-amber-300 p-2.5 sm:p-3 flex flex-col gap-2 pointer-events-auto">
        
        {/* Tier 1: Score & Target (Left), Countdown Timer (Center), Quick Controls (Right) */}
        <div className="flex items-center justify-between gap-2">
          
          {/* 1. Score & Target */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-slate-500 uppercase">
                SKOR
              </span>
              <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded leading-none ${
                currentPhase === 1
                  ? 'bg-emerald-100 text-emerald-700'
                  : currentPhase === 2
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                BATAS {targetScore}
              </span>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono tracking-tight leading-none">
                {String(score).padStart(3, '0')}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-400">
                /{targetScore}
              </span>
            </div>

            {/* Visual Progress Bar to Target */}
            <div className="w-20 sm:w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200/60">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  currentPhase === 1
                    ? 'bg-emerald-500'
                    : currentPhase === 2
                    ? 'bg-orange-500'
                    : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(0, (score / targetScore) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* 2. Timer (Center) */}
          <div className={`flex flex-col items-center px-2.5 sm:px-3 py-1 rounded-xl transition-all shrink-0 ${
            isTimeCritical 
              ? 'bg-red-100 text-red-600 border border-red-300 animate-pulse shadow-xs' 
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-slate-500">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>WAKTU</span>
            </div>
            <span className="text-base sm:text-xl font-black font-mono tracking-tight leading-tight">
              {formattedTime}
            </span>
          </div>

          {/* 3. Controls: Sound, Reset, and prominent PAUSE button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Sound Toggle */}
            <button
              id="hud-sound-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSound();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={soundEnabled ? 'Matikan Musik & Suara' : 'Nyalakan Musik & Suara'}
              title={soundEnabled ? 'Musik & Suara: Aktif' : 'Musik & Suara: Mati'}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all active:scale-90 shadow-xs relative cursor-pointer shrink-0"
            >
              {soundEnabled ? (
                <div className="flex items-center justify-center relative">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                  <Music className="w-2.5 h-2.5 text-amber-600 absolute -top-1 -right-1" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              )}
            </button>

            {/* Reset Button */}
            <button
              id="hud-reset-btn"
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Reset Permainan"
              title="Reset Permainan (Mulai Ulang)"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all active:scale-90 shadow-xs cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* PAUSE BUTTON - PROMINENT, UNOBSTRUCTED & EASY TO TAP */}
            <button
              id="hud-pause-btn"
              onClick={(e) => {
                e.stopPropagation();
                onPause();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Jeda Permainan (Pause)"
              title="Jeda Permainan (Pause)"
              className="h-9 sm:h-10 px-2.5 sm:px-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md border-b-2 border-amber-700 transition-all cursor-pointer shrink-0"
            >
              <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white stroke-white" />
              <span className="hidden sm:inline tracking-wide font-black">JEDA</span>
            </button>
          </div>

        </div>

        {/* Tier 2: Phase Info & Bomb Indicators */}
        <div className="flex items-center justify-between pt-1.5 border-t border-amber-100 text-xs">
          
          {/* Phase Badge & Multiplier */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">FASE</span>
            <span className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full text-white shadow-xs ${
              currentPhase === 1
                ? 'bg-emerald-500'
                : currentPhase === 2
                ? 'bg-orange-500'
                : 'bg-red-500'
            }`}>
              {currentPhase}
            </span>
            <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md ${
              currentPhase === 1
                ? 'bg-emerald-100 text-emerald-700'
                : currentPhase === 2
                ? 'bg-orange-100 text-orange-700'
                : 'bg-red-100 text-red-700'
            }`}>
              +{currentPhase * 10} poin/buah
            </span>
          </div>

          {/* Bomb Hearts / Damage Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400">
              BOM:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((b) => (
                <div
                  key={b}
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-lg flex items-center justify-center transition-all ${
                    b <= bombsHit
                      ? 'bg-red-500 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-300 border border-slate-200'
                  }`}
                  title={b <= bombsHit ? `Bom tersentuh: ${b}` : `Kesempatan aman tersisa`}
                >
                  <Bomb className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
