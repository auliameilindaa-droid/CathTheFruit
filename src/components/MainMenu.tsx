import React from 'react';
import { Play, HelpCircle, Trophy, Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { sound } from '../utils/audio';

interface MainMenuProps {
  highScore: number;
  soundEnabled: boolean;
  onPlay: () => void;
  onHowToPlay: () => void;
  onHighScore: () => void;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  soundEnabled,
  onPlay,
  onHowToPlay,
  onHighScore,
  onToggleSound,
}) => {
  const handlePlay = () => {
    sound.playButtonClick();
    onPlay();
  };

  const handleHowTo = () => {
    sound.playButtonClick();
    onHowToPlay();
  };

  const handleScore = () => {
    sound.playButtonClick();
    onHighScore();
  };

  const handleSound = () => {
    onToggleSound();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden">
      
      {/* Top Bar with Sound Toggle */}
      <div className="w-full max-w-md flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-600">REKOR:</span>
          <span className="text-sm font-black text-amber-700 font-mono">{highScore}</span>
        </div>

        <button
          id="menu-sound-btn"
          onClick={handleSound}
          aria-label={soundEnabled ? 'Matikan Musik & Efek Suara' : 'Nyalakan Musik & Efek Suara'}
          title={soundEnabled ? 'Musik & Efek Suara: Aktif' : 'Musik & Efek Suara: Mati'}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-amber-200 transition-transform active:scale-95 relative"
        >
          {soundEnabled ? (
            <div className="flex items-center justify-center relative">
              <Volume2 className="w-5 h-5 text-amber-600" />
              <Music className="w-2.5 h-2.5 text-amber-500 absolute -top-1 -right-1" />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Center Branding / Hero */}
      <div className="flex flex-col items-center text-center my-auto z-10 max-w-md">
        
        {/* Animated Floating Fruits Badge */}
        <div className="relative mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 shadow-xl border-4 border-white flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
            <span className="text-5xl sm:text-6xl drop-shadow-md select-none animate-bounce">
              🧺
            </span>
          </div>

          {/* Orbiting Fruit Emojis */}
          <span className="absolute -top-2 -left-3 text-2xl sm:text-3xl animate-float">
            🍎
          </span>
          <span className="absolute -bottom-1 -left-3 text-2xl sm:text-3xl animate-float" style={{ animationDelay: '1s' }}>
            🍌
          </span>
          <span className="absolute -top-3 -right-2 text-2xl sm:text-3xl animate-float" style={{ animationDelay: '1.5s' }}>
            🍉
          </span>
          <span className="absolute -bottom-2 -right-3 text-2xl sm:text-3xl animate-float" style={{ animationDelay: '0.7s' }}>
            ✨🍓
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-900 drop-shadow-sm font-['Fredoka']">
          CATCH THE FRUIT
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-base sm:text-lg font-bold text-amber-800/80 bg-amber-100/80 px-4 py-1 rounded-full inline-block border border-amber-200">
          "Catch Fruits, Avoid Bombs!"
        </p>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-xs leading-relaxed">
          Kumpulkan buah, taklukkan 3 fase tantangan (<span className="font-bold text-emerald-700">Target 100</span> ➔ <span className="font-bold text-orange-600">200</span> ➔ <span className="font-bold text-red-600">300 Poin</span>), dan hindari bom bahaya!
        </p>

        {/* Action Buttons */}
        <div className="w-full mt-6 sm:mt-8 flex flex-col gap-3">
          
          {/* PLAY BUTTON */}
          <button
            id="menu-play-btn"
            onClick={handlePlay}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white font-black text-xl tracking-wider shadow-lg hover:shadow-emerald-500/30 border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>PLAY GAME</span>
          </button>

          {/* HOW TO PLAY */}
          <button
            id="menu-how-to-play-btn"
            onClick={handleHowTo}
            className="w-full py-3 px-5 rounded-xl bg-white/90 hover:bg-white active:scale-95 text-slate-700 font-extrabold text-base shadow-md border-2 border-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>HOW TO PLAY</span>
          </button>

          {/* HIGH SCORE */}
          <button
            id="menu-high-score-btn"
            onClick={handleScore}
            className="w-full py-3 px-5 rounded-xl bg-white/90 hover:bg-white active:scale-95 text-slate-700 font-extrabold text-base shadow-md border-2 border-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>HIGH SCORE</span>
          </button>

        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs font-semibold text-slate-500 z-10">
        Target: <span className="font-bold text-amber-700">100 Poin</span> • Waktu: <span className="font-bold text-amber-700">120 Detik</span> • Maks 3 Bom
      </div>
    </div>
  );
};
