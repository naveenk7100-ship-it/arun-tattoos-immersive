import React from 'react';
import { 
  ArrowUp, 
  ChevronRight, 
  Fingerprint, 
  Shield, 
  Star, 
  Heart, 
  Mouse 
} from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';
import { assetUrl } from '../../utils/assetUrl';

interface ReferenceHeroProps {
  onStepInside: () => void;
  onOpenBooking: () => void;
  onScrollDown: () => void;
}

export const ReferenceHero: React.FC<ReferenceHeroProps> = ({
  onStepInside,
  onScrollDown,
}) => {
  const { language } = useLanguage();

  return (
    <div className={`relative w-full min-h-[92vh] flex flex-col justify-between pt-24 pb-8 px-4 sm:px-8 lg:px-12 select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* 3-Column Wide Cinematic Composition matching Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center flex-1 my-auto w-full">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ILLUMINATED MURAL WALL & BRUSH LOGO */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between items-start text-left space-y-8 relative z-10">
          
          {/* Background Wall Texture & Portrait Silhouette Overlay */}
          <div className="relative">
            {/* Subtle background mural portrait shadow */}
            <div 
              className="absolute -top-16 -left-12 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none opacity-20 filter grayscale contrast-150 mix-blend-screen bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${assetUrl('/images/gallery/realism-portrait-tribute.png')})` }}
            />

            {/* Glowing Neon Brand Mark */}
            <div className="relative space-y-1">
              <h1 className="font-brush text-6xl sm:text-7xl lg:text-8xl text-white tracking-wide filter drop-shadow-[0_0_35px_rgba(255,255,255,0.45)] leading-tight">
                ARUN
              </h1>
              
              <div className="font-sans text-xl sm:text-2xl lg:text-3xl tracking-[0.45em] text-white font-medium pl-1">
                TATTOOS
              </div>

              {/* Tagline matching strict rule: CRAFTED IN INK. DEFINED BY YOU. */}
              <p className="font-sans text-xs sm:text-sm tracking-[0.3em] text-[#d4af37] font-semibold uppercase mt-3 pl-1">
                CRAFTED IN INK. DEFINED BY YOU.
              </p>
            </div>
          </div>

          {/* Plant Sanctuary Ambience & Exploration Indicator */}
          <div className="space-y-4 pt-4">
            {/* Atmospheric Plant representation on floor */}
            <div className="flex items-center gap-2.5 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              <span className="text-[11px] font-sans tracking-wider uppercase text-zinc-300">
                PRIVATE ATELIER SANCTUARY
              </span>
            </div>

            {/* Mouse / Swipe exploration pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-sans text-zinc-300 shadow-xl">
              <Mouse className="w-4 h-4 text-zinc-200 animate-bounce" />
              <span>Use your mouse or swipe to explore</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: DIRECT UNOBSTRUCTED PORTAL TO 3D STUDIO */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center justify-end text-center h-full min-h-[280px] lg:min-h-[460px] pb-6 relative z-10">
          
          {/* STEP INSIDE CTA on the studio threshold floor */}
          <div 
            onClick={onStepInside}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStepInside(); }}
            className="group cursor-pointer flex flex-col items-center gap-2.5 select-none transition-transform hover:scale-105"
          >
            {/* Circular glowing upward arrow */}
            <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all bg-black/40 backdrop-blur-md shadow-2xl shadow-black">
              <ArrowUp className="w-5 h-5 text-white group-hover:text-[#d4af37] transition-colors" />
            </div>

            {/* Pill capsule STEP INSIDE */}
            <div className="px-6 py-2 rounded-full border border-white/30 bg-black/50 backdrop-blur-md text-xs font-sans tracking-[0.25em] text-white uppercase group-hover:border-[#d4af37] group-hover:text-[#ffd885] transition-all shadow-xl">
              STEP INSIDE
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: VALUE PILLARS & SCROLL DOWN */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end text-left lg:text-right space-y-8 relative z-10">
          
          <div className="space-y-4">
            {/* Editorial Heading */}
            <div className="space-y-1">
              <h2 className="font-sans text-lg sm:text-xl lg:text-2xl font-normal tracking-wider text-white uppercase leading-snug">
                MORE THAN JUST A TATTOO
              </h2>
              <p className="font-sans text-sm sm:text-base tracking-[0.2em] text-zinc-400 uppercase font-light">
                IT'S A PART OF YOU
              </p>
            </div>

            {/* 4 Minimalist Luxury Icon Badges in a horizontal row */}
            <div className="grid grid-cols-4 gap-4 sm:gap-6 pt-4 text-center">
              
              <div className="flex flex-col items-center group">
                <Fingerprint className="w-5 h-5 text-zinc-300 group-hover:text-[#d4af37] transition-colors mb-2" />
                <span className="text-[9px] font-mono tracking-wider text-zinc-400 group-hover:text-white uppercase leading-tight">
                  CUSTOM<br />DESIGNS
                </span>
              </div>

              <div className="flex flex-col items-center group">
                <Shield className="w-5 h-5 text-zinc-300 group-hover:text-emerald-400 transition-colors mb-2" />
                <span className="text-[9px] font-mono tracking-wider text-zinc-400 group-hover:text-white uppercase leading-tight">
                  STERILE &<br />SAFE
                </span>
              </div>

              <div className="flex flex-col items-center group">
                <Star className="w-5 h-5 text-zinc-300 group-hover:text-[#ffd885] transition-colors mb-2" />
                <span className="text-[9px] font-mono tracking-wider text-zinc-400 group-hover:text-white uppercase leading-tight">
                  EXPERT<br />ARTISTS
                </span>
              </div>

              <div className="flex flex-col items-center group">
                <Heart className="w-5 h-5 text-zinc-300 group-hover:text-[#d4af37] transition-colors mb-2" />
                <span className="text-[9px] font-mono tracking-wider text-zinc-400 group-hover:text-white uppercase leading-tight">
                  LIFETIME<br />SUPPORT
                </span>
              </div>

            </div>

            {/* Dark leather bench waiting visual element */}
            <div className="hidden lg:block w-72 h-14 rounded-xl bg-gradient-to-r from-black/80 to-[#121217] border border-white/5 ml-auto relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06)_0%,transparent_70%)]" />
              <div className="absolute bottom-2 right-3 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                CONSULTATION BENCH
              </div>
            </div>
          </div>

          {/* Far bottom right: SCROLL DOWN trigger */}
          <button
            onClick={onScrollDown}
            className="flex items-center gap-3 group text-right pt-4 cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#d4af37] group-hover:scale-110 transition-all bg-black/40 backdrop-blur-sm">
              <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#d4af37] transition-colors" />
            </div>
            <div className="text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-white uppercase flex flex-col text-left leading-tight">
              <span>SCROLL</span>
              <span>DOWN</span>
            </div>
          </button>

        </div>

      </div>

    </div>
  );
};
