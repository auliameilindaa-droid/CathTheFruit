import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Home, Star, Sparkles, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { GameResult } from '../types';
import { sound } from '../utils/audio';

interface ResultModalProps {
  result: GameResult;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onPlayAgain,
  onMainMenu,
}) => {
  useEffect(() => {
    if (result.isWin) {
      sound.playWin();
    } else {
      sound.playGameOver();
    }
  }, [result.isWin]);

  const handlePlayAgain = () => {
    sound.playButtonClick();
    onPlayAgain();
  };

  const handleMainMenu = () => {
    sound.playButtonClick();
    onMainMenu();
  };

  // Subtitle reason
  const getReasonText = () => {
    if (result.reason === 'MAX_SCORE_WIN') {
      return 'Luar biasa! Kamu berhasil menaklukkan semua fase dan mencapai batas 300 poin!';
    }
    if (result.reason === 'TIME_UP_WIN') {
      return `Hebat! Kamu berhasil mencapai batas target fase (skor ${result.score} / ${result.targetScore}) sebelum waktu habis!`;
    }
    if (result.reason === 'TOO_MANY_BOMBS') {
      return 'Game Over! Kamu menangkap 3 bom bahaya.';
    }
    return `Waktu habis! Skor akhir ${result.score} belum mencapai batas target minimal 100.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-sm rounded-3xl shadow-2xl border-4 ${
        result.isWin ? 'border-amber-400' : 'border-red-400'
      } overflow-hidden flex flex-col text-center`}>
        
        {/* Banner Header */}
        <div className={`py-5 px-6 text-white ${
          result.isWin
            ? 'bg-gradient-to-b from-amber-400 via-orange-400 to-amber-500'
            : 'bg-gradient-to-b from-red-500 to-rose-600'
        }`}>
          
          <div className="flex justify-center mb-2">
            {result.isWin ? (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                <span className="text-4xl">🏆</span>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-4xl">💥</span>
              </div>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-['Fredoka'] drop-shadow-sm">
            {result.isWin ? 'YOU WIN!' : 'GAME OVER'}
          </h2>

          <p className="text-xs sm:text-sm font-bold text-white/90 mt-1">
            {result.reason === 'MAX_SCORE_WIN'
              ? 'TARGET MAKSIMAL 300 TERCAPAI!'
              : result.isWin
              ? 'SELAMAT, KAMU MENANG!'
              : result.reason === 'TOO_MANY_BOMBS'
              ? 'TOO MANY BOMBS!'
              : 'WAKTU HABIS!'}
          </p>

          {/* New High Score Badge */}
          {result.isNewHighScore && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-yellow-300 text-amber-950 px-3 py-1 rounded-full text-xs font-black shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
              <span>NEW HIGH SCORE!</span>
            </div>
          )}

        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center">
          
          <p className="text-xs text-slate-500 mb-4 font-semibold">
            {getReasonText()}
          </p>

          {/* Score & Target Cards */}
          <div className="grid grid-cols-2 gap-3 w-full mb-4">
            
            {/* FINAL SCORE */}
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border-2 border-amber-200 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                FINAL SCORE
              </span>
              <span className="text-3xl sm:text-4xl font-black text-amber-700 font-mono my-0.5">
                {result.score}
              </span>
              <span className="text-[10px] font-bold text-slate-500">Poin Tercapai</span>
            </div>

            {/* TARGET */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                BATAS TARGET
              </span>
              <span className="text-3xl sm:text-4xl font-black text-slate-700 font-mono my-0.5">
                {result.targetScore}
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {result.targetScore >= 300
                  ? 'Batas Fase 3'
                  : result.targetScore >= 200
                  ? 'Batas Fase 2'
                  : 'Batas Fase 1'}
              </span>
            </div>

          </div>

          {/* Rating with Stars */}
          <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-5 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              RATING
            </span>

            {/* Star Icons */}
            <div className="flex items-center gap-1.5 my-1">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-7 h-7 transition-transform ${
                    starIdx <= result.stars
                      ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-sm'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>

            <span className={`text-base font-black tracking-wider uppercase mt-1 ${
              result.rating === 'EXCELLENT'
                ? 'text-amber-600'
                : result.rating === 'GREAT'
                ? 'text-emerald-600'
                : result.rating === 'GOOD'
                ? 'text-blue-600'
                : 'text-slate-500'
            }`}>
              {result.rating}
            </span>

            {/* Catch Breakdown Details */}
            <div className="flex items-center justify-around w-full mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-semibold">
              <span>🍎 Buah: {result.fruitsCaught}</span>
              <span>✨ Berry: {result.goldenCaught}</span>
              <span>💣 Bom: {result.bombsHit}/3</span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-2.5">
            
            {/* PLAY AGAIN */}
            <button
              id="result-play-again-btn"
              onClick={handlePlayAgain}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-black text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-emerald-800"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>PLAY AGAIN</span>
            </button>

            {/* MAIN MENU */}
            <button
              id="result-main-menu-btn"
              onClick={handleMainMenu}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
            >
              <Home className="w-4 h-4 text-slate-600" />
              <span>MAIN MENU</span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
