import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface StudioLoaderProps {
  onComplete: () => void;
  isReducedMotion?: boolean;
}

export const StudioLoader: React.FC<StudioLoaderProps> = ({ onComplete, isReducedMotion = false }) => {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isReducedMotion) {
      onComplete();
      return;
    }

    // Smooth progressive loader simulating asset & shader warm-up
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const increment = Math.random() * 25 + 15;
        return Math.min(prev + increment, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isReducedMotion, onComplete]);

  const handleEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  // If already at 100%, trigger smooth entry after slight pause if not clicked
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070709] flex flex-col items-center justify-center p-6 transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${language === 'te' ? 'font-telugu' : ''}`}
    >
      {/* Background cinematic vignette & subtle radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 film-grain opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full animate-in fade-in duration-500">
        
        {/* Monogram Crest */}
        <div className="w-16 h-16 rounded-full border-2 border-[#d4af37]/60 bg-[#121217] flex items-center justify-center shadow-2xl shadow-black mb-6 transform hover:scale-105 transition-transform">
          <span className="font-cinzel text-xl font-bold text-[#d4af37] tracking-wider">AT</span>
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-cinzel font-black tracking-widest text-white uppercase mb-2">
          ARUN <span className="gold-gradient-text">TATTOOS</span>
        </h1>

        <p className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-semibold mb-8">
          CRAFTED IN INK. DEFINED BY YOU.
        </p>

        {/* Progress bar container */}
        <div className="w-full max-w-xs mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-2">
            <span>{t.loader.preparing}</span>
            <span className="text-[#ffd885]">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b38728] via-[#d4af37] to-[#ffd885] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Studio CTA Button when ready */}
        <button
          onClick={handleEnter}
          disabled={!isReady}
          className={`mt-4 px-8 py-3 rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${
            isReady
              ? 'bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold shadow-lg shadow-[#d4af37]/25 cursor-pointer transform hover:-translate-y-0.5'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <span>{t.loader.enterBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
