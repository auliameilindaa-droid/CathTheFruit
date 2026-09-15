import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { sound } from '../utils/audio';

interface PauseModalProps {
  score: number;
  targetScore?: number;
  timeRemaining: number;
  soundEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  targetScore = 100,
  timeRemaining,
  soundEnabled,
  onResume,
  onRestart,
  onMainMenu,
  onToggleSound,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleResume = () => {
    sound.playButtonClick();
    onResume();
  };

  const handleRestart = () => {
    sound.playButtonClick();
    onRestart();
  };

  const handleMenu = () => {
    sound.playButtonClick();
    onMainMenu();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border-4 border-amber-300 p-5 sm:p-6 flex flex-col items-center text-center max-h-[92vh] overflow-y-auto">
        
        {/* Pause Title */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-3 border-2 border-amber-300">
          <span className="text-3xl">⏸️</span>
        </div>

        <h2 className="text-3xl font-black text-amber-900 font-['Fredoka'] tracking-wide">
          PAUSED
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Permainan sedang dihentikan sejenak
        </p>

        {/* Current status stats */}
        <div className="grid grid-cols-2 gap-2 w-full my-5 bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-400">SKOR / TARGET</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-black text-amber-600 font-mono">{score}</span>
              <span className="text-xs font-bold text-slate-400">/{targetScore}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-400">SISA WAKTU</span>
            <span className="text-2xl font-black text-slate-700 font-mono">{formattedTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          
          {/* RESUME */}
          <button
            id="pause-resume-btn"
            onClick={handleResume}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-black text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>RESUME</span>
          </button>

          {/* RESTART / RESET */}
          <button
            id="pause-restart-btn"
            onClick={handleRestart}
            className="w-full py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>RESET / RESTART</span>
          </button>

          {/* MAIN MENU */}
          <button
            id="pause-main-menu-btn"
            onClick={handleMenu}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            <Home className="w-4 h-4 text-slate-600" />
            <span>MAIN MENU</span>
          </button>

        </div>

        {/* Sound toggle */}
        <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between px-2 text-xs font-bold text-slate-600">
          <span>Musik & Efek:</span>
          <button
            id="pause-sound-toggle-btn"
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
          >
            {soundEnabled ? (
              <>
                <div className="flex items-center gap-0.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <Music className="w-3 h-3 text-amber-500" />
                </div>
                <span>Musik: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Musik: OFF</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
