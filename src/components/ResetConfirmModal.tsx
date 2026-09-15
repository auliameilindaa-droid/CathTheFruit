import React from 'react';
import { RotateCcw, Play, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface ResetConfirmModalProps {
  score: number;
  targetScore: number;
  phase: number;
  timeRemaining: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  score,
  targetScore,
  phase,
  timeRemaining,
  onConfirm,
  onCancel,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleConfirm = () => {
    sound.playButtonClick();
    onConfirm();
  };

  const handleCancel = () => {
    sound.playButtonClick();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border-4 border-rose-300 overflow-hidden flex flex-col text-center">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-4 flex items-center justify-center gap-2 text-white">
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <h2 className="text-lg sm:text-xl font-black tracking-wide font-['Fredoka']">
            RESET PERMAINAN?
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center border-2 border-rose-200 mb-3 text-rose-600">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-700 mb-4 leading-relaxed">
            Apakah kamu yakin ingin mengulang permainan dari awal?
          </p>

          {/* Current Run Snapshot */}
          <div className="grid grid-cols-2 gap-2 w-full mb-5 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">SKOR SAAT INI</span>
              <span className="text-lg font-black text-amber-600 font-mono">{score}</span>
              <span className="text-[10px] text-slate-400 font-medium">/{targetScore} (Fase {phase})</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">SISA WAKTU</span>
              <span className="text-lg font-black text-slate-700 font-mono">{formattedTime}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            {/* YA, RESET */}
            <button
              id="confirm-reset-btn"
              onClick={handleConfirm}
              className="w-full py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-rose-700"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>YA, RESET DARI AWAL</span>
            </button>

            {/* BATAL / LANJUT BERMAIN */}
            <button
              id="cancel-reset-btn"
              onClick={handleCancel}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
            >
              <Play className="w-4 h-4 fill-slate-700" />
              <span>LANJUTKAN BERMAIN</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
