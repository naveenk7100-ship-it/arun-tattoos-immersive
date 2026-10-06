import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  ShieldCheck, 
  Fingerprint, 
  Star, 
  Heart,
  Mouse
} from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface EntranceZoneProps {
  onEnter: () => void;
  onOpenBooking: () => void;
}

export const EntranceZone: React.FC<EntranceZoneProps> = ({ onEnter, onOpenBooking }) => {
  const { language } = useLanguage();

  return (
    <div className={`w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between pointer-events-none select-none relative z-10 px-4 sm:px-8 md:px-12 py-6 animate-in fade-in duration-700 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* 1. TOP ROW: EDITORIAL BRAND HEADER (LEFT) + STUDIO PILLARS (RIGHT) */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-start justify-between gap-6 pointer-events-auto">
        
        {/* Left: Atmospheric Brand Typography sitting in negative space */}
        <div className="text-left max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full subtle-glass border border-[#d4af37]/30 text-[10px] sm:text-xs font-mono text-[#d4af37] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest uppercase">VIJAYAWADA ATELIER • OPEN TODAY</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.18em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] uppercase leading-none">
            ARUN TATTOOS
          </h1>

          <p className="font-mono text-xs sm:text-sm md:text-base tracking-[0.24em] md:tracking-[0.28em] text-[#d4af37] font-medium mt-2.5 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            CRAFTED IN INK. DEFINED BY YOU.
          </p>

          <p className="text-[11px] sm:text-xs tracking-[0.2em] text-zinc-400 font-sans uppercase mt-1">
            PRECISION • ARTISTRY • STERILITY
          </p>
        </div>

        {/* Right: Studio Philosophy & 4 Core Pillars (matches reference design) */}
        <div className="hidden lg:flex flex-col items-end text-right max-w-md">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-300 font-semibold mb-3">
            MORE THAN JUST A TATTOO
            <span className="block text-[11px] text-[#d4af37] font-normal tracking-widest mt-0.5">
              IT'S A PART OF YOU
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg subtle-glass border border-white/5">
              <Fingerprint className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <div>
                <div className="text-[10px] font-mono font-bold text-white tracking-wider">CUSTOM DESIGNS</div>
                <div className="text-[9px] text-zinc-400">Original artwork</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg subtle-glass border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] font-mono font-bold text-white tracking-wider">STERILE & SAFE</div>
                <div className="text-[9px] text-zinc-400">Single-use Kwadron</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg subtle-glass border border-white/5">
              <Star className="w-3.5 h-3.5 text-[#ffd885] shrink-0" />
              <div>
                <div className="text-[10px] font-mono font-bold text-white tracking-wider">EXPERT ARTIST</div>
                <div className="text-[9px] text-zinc-400">8+ Yrs fine arts</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg subtle-glass border border-white/5">
              <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <div>
                <div className="text-[10px] font-mono font-bold text-white tracking-wider">LIFETIME SUPPORT</div>
                <div className="text-[9px] text-zinc-400">Medical aftercare</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CENTER AREA IS 100% UNOBSTRUCTED:
          Visitors look straight at the physical 3D reception desk with the
          illuminated authentic ARUN TATTOOS logo, and into the tattoo studio! */}
      <div className="flex-1 my-auto pointer-events-none" />

      {/* 3. BOTTOM ROW: NAVIGATION GUIDANCE & ACTION CTAS */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto pt-6">
        
        {/* Bottom Left: Mouse / Swipe Interaction Hint */}
        <div className="hidden sm:flex items-center gap-2.5 text-zinc-400 text-xs font-mono tracking-wider">
          <Mouse className="w-4 h-4 text-[#d4af37] animate-bounce" />
          <span className="text-[11px] uppercase text-zinc-400">Use your mouse or swipe to explore</span>
        </div>

        {/* Bottom Center: Minimal "STEP INSIDE" Portal Button */}
        <button
          onClick={onEnter}
          className="group px-6 py-2.5 rounded-full subtle-glass hover:bg-white/10 border border-white/20 hover:border-[#d4af37]/70 text-white text-xs sm:text-sm font-medium tracking-widest uppercase transition-all duration-300 flex items-center gap-2.5 shadow-xl shadow-black/60 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="w-6 h-6 rounded-full border border-[#d4af37]/60 flex items-center justify-center group-hover:border-[#d4af37] transition-colors">
            <ArrowUp className="w-3 h-3 text-[#d4af37] group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <span>STEP INSIDE</span>
        </button>

        {/* Bottom Right: Primary BOOK NOW CTA + Scroll Down Hint */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f0d078] to-[#b38728] text-black font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-[#d4af37]/25 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[#d4af37]/40 active:translate-y-0"
          >
            <Calendar className="w-4 h-4 text-black" />
            <span>BOOK NOW</span>
          </button>

          <button
            onClick={onEnter}
            aria-label="Scroll to next zone"
            className="w-10 h-10 rounded-full subtle-glass hover:bg-white/10 border border-white/15 hover:border-[#d4af37]/60 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
            title="Scroll Down"
          >
            <ArrowDown className="w-4 h-4 text-[#d4af37] animate-pulse" />
          </button>
        </div>

      </div>

    </div>
  );
};
