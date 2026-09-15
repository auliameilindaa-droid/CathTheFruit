import React from 'react';
import { Trophy, X, Star, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface HighScoreModalProps {
  highScore: number;
  onClose: () => void;
  onResetHighScore?: () => void;
}

export const HighScoreModal: React.FC<HighScoreModalProps> = ({
  highScore,
  onClose,
  onResetHighScore,
}) => {
  const [confirmingReset, setConfirmingReset] = React.useState(false);

  const handleClose = () => {
    sound.playButtonClick();
    onClose();
  };

  const handleReset = () => {
    sound.playButtonClick();
    if (onResetHighScore) {
      onResetHighScore();
    }
    setConfirmingReset(false);
  };

  const getRating = (score: number) => {
    if (score >= 200) return { title: 'EXCELLENT', stars: 3, color: 'text-amber-500' };
    if (score >= 150) return { title: 'GREAT', stars: 3, color: 'text-emerald-500' };
    if (score >= 100) return { title: 'GOOD', stars: 2, color: 'text-blue-500' };
    return { title: 'TRY AGAIN', stars: 1, color: 'text-slate-400' };
  };

  const rating = getRating(highScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col text-center">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 fill-white" />
            <h2 className="text-xl font-black tracking-wide font-['Fredoka']">
              HIGH SCORE
            </h2>
          </div>
          <button
            id="high-score-close-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center border-2 border-amber-300 shadow-inner mb-4">
            <Trophy className="w-10 h-10 text-amber-600 fill-amber-500 animate-bounce" />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            SKOR TERTINGGI KAMU
          </span>

          <span className="text-5xl font-black text-amber-600 font-mono my-2 tracking-tight">
            {highScore}
          </span>

          {/* Rating */}
          <div className="flex items-center gap-1 my-1">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-6 h-6 ${
                  starIdx <= rating.stars
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                }`}
              />
            ))}
          </div>

          <span className={`text-sm font-black tracking-wider uppercase ${rating.color}`}>
            {rating.title}
          </span>

          <p className="text-xs text-slate-500 mt-4 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-100 w-full">
            Tersimpan otomatis di browser ini. Mainkan terus untuk memecahkan rekor barumu!
          </p>

          {onResetHighScore && highScore > 0 && (
            <div className="mt-4 w-full flex flex-col items-center">
              {!confirmingReset ? (
                <button
                  id="high-score-reset-btn"
                  onClick={() => {
                    sound.playButtonClick();
                    setConfirmingReset(true);
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Rekor Skor
                </button>
              ) : (
                <div className="w-full bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex flex-col items-center gap-1.5 animate-in fade-in duration-100">
                  <span className="text-[11px] font-bold text-rose-800">
                    Reset rekor skor tertinggi ke 0?
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id="confirm-high-score-reset-btn"
                      onClick={handleReset}
                      className="px-2.5 py-1 text-[11px] font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer active:scale-95"
                    >
                      Ya, Reset
                    </button>
                    <button
                      id="cancel-high-score-reset-btn"
                      onClick={() => {
                        sound.playButtonClick();
                        setConfirmingReset(false);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer active:scale-95"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            id="high-score-close-bottom-btn"
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            KEMBALI KE MENU
          </button>
        </div>

      </div>
    </div>
  );
};
