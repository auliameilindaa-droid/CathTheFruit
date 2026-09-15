import React from 'react';
import { X, ArrowLeft, Sparkles, AlertTriangle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const handleClose = () => {
    sound.playButtonClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-2xl font-black tracking-wide font-['Fredoka']">
              CARA BERMAIN
            </h2>
          </div>
          <button
            id="how-to-play-close-btn"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-700">
          
          {/* Main Objective Card */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
            <span className="text-3xl">🧺</span>
            <div>
              <h3 className="font-extrabold text-amber-900 text-sm sm:text-base">
                Kendali Keranjang
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Gerakkan keranjang ke kiri dan kanan untuk menangkap buah yang berjatuhan dari atas kebun!
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold text-amber-800">
                <span className="bg-white px-2 py-1 rounded-md border border-amber-200">
                  ⌨️ Arrow Left / Right
                </span>
                <span className="bg-white px-2 py-1 rounded-md border border-amber-200">
                  ⌨️ A / D
                </span>
                <span className="bg-white px-2 py-1 rounded-md border border-amber-200">
                  👆 Sentuh Layar
                </span>
                <span className="bg-white px-2 py-1 rounded-md border border-rose-200 text-rose-700">
                  🔄 Tombol Reset / Tombol R
                </span>
                <span className="bg-white px-2 py-1 rounded-md border border-amber-200">
                  ⏸️ Tombol P / Esc
                </span>
              </div>
            </div>
          </div>

          {/* Objects Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
              Nilai Objek & Karakteristik
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Normal Fruits */}
              <div className="bg-emerald-50/80 p-3 rounded-2xl border-2 border-emerald-200 flex flex-col items-center text-center">
                <div className="flex text-2xl gap-1 mb-1">
                  <span>🍎</span>
                  <span>🍊</span>
                  <span>🍌</span>
                  <span>🍉</span>
                </div>
                <span className="font-black text-xs text-emerald-900">Buah Biasa</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Apel, Jeruk, Pisang, Semangka
                </span>
                <span className="mt-2 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  +10 / +20 / +30 Poin
                </span>
              </div>

              {/* Golden Strawberry */}
              <div className="bg-amber-50/90 p-3 rounded-2xl border-2 border-amber-300 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-amber-400 opacity-40">
                  <Sparkles className="w-8 h-8" />
                </div>
                <span className="text-3xl mb-1 filter drop-shadow-sm">🍓✨</span>
                <span className="font-black text-xs text-amber-900">Golden Strawberry</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Buah Emas Langka Berkilau
                </span>
                <span className="mt-2 text-xs font-black text-amber-700 bg-amber-200 px-2.5 py-0.5 rounded-full">
                  +20 / +40 / +60 Poin
                </span>
              </div>

              {/* Bomb */}
              <div className="bg-red-50/80 p-3 rounded-2xl border-2 border-red-200 flex flex-col items-center text-center">
                <span className="text-3xl mb-1">💣</span>
                <span className="font-black text-xs text-red-900">Bom Bahaya!</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Hindari! Max 3 bom
                </span>
                <span className="mt-2 text-xs font-black text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
                  -10 Poin & +1 Strike
                </span>
              </div>

            </div>
          </div>

          {/* Rules & Phases */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-500">
              Peraturan & Poin Setiap Fase
            </h3>
            
            <ul className="text-xs sm:text-sm space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Target Kemenangan & Batas Skor:</strong> Batas skor berubah di setiap fase:
                  <br />• <strong>Fase 1:</strong> Batas skor <strong>100</strong> (Buah: <strong>+10</strong> | Golden: <strong>+20</strong>)
                  <br />• <strong>Fase 2:</strong> Batas skor <strong>200</strong> (Buah: <strong>+20</strong> | Golden: <strong>+40</strong>)
                  <br />• <strong>Fase 3:</strong> Batas skor <strong>300</strong> (Buah: <strong>+30</strong> | Golden: <strong>+60</strong>)
                  <br /><em className="text-slate-500">Batas skor di bagian atas HUD akan otomatis berganti setiap kali fase naik!</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Batas Bom:</strong> Jika terkena bom sebanyak <strong>3 kali (3/3)</strong>, permainan langsung <strong>Game Over</strong>. Hindari buah hitam berduri!
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            id="how-to-play-understood-btn"
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            SIAP BERMAIN!
          </button>
        </div>

      </div>
    </div>
  );
};
