import React from 'react';
import { 
  ArrowUp, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  HeartHandshake 
} from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface ReferenceHeroProps {
  onStepInside: () => void;
  onOpenBooking: () => void;
  onScrollDown: () => void;
}

export const ReferenceHero: React.FC<ReferenceHeroProps> = ({
  onStepInside,
  onOpenBooking,
  onScrollDown,
}) => {
  const { language } = useLanguage();

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-between select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Main 3-Column Studio Architectural Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center flex-1 my-auto pt-4 pb-6">
        
        {/* Left Column: Illuminated Brand Wall & Artistic Identity */}
        <div className="lg:col-span-4 flex flex-col justify-between items-start text-left space-y-6">
          <div className="space-y-4">
            {/* Subtle Brand Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full subtle-glass border border-[#d4af37]/30 text-[10px] font-mono text-[#d4af37] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span>PRIVATE ATELIER • APPOINTMENTS & CONSULTATION</span>
            </div>

            {/* Backlit Large Brand Title */}
            <div className="relative">
              <div className="absolute -inset-4 bg-[radial-gradient(circle_at_left,_rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />
              <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-cinzel font-black tracking-tight text-white uppercase leading-[0.95]">
                ARUN <br />
                <span className="gold-gradient-text tracking-widest">TATTOOS</span>
              </h1>
            </div>

            {/* Premium Tagline (Reference Style) */}
            <p className="font-cinzel text-base sm:text-lg lg:text-xl tracking-[0.25em] text-[#d4af37] font-semibold uppercase leading-snug">
              CRAFTED IN INK. DEFINED BY YOU.
            </p>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-sm leading-relaxed">
              {language === 'te'
                ? 'శరీర నిర్మాణం మరియు వ్యక్తిత్వానికి తగినట్లుగా రూపొందించిన అత్యున్నత ప్రమాణాల శాశ్వత చిత్రకళ.'
                : 'Where fine-art drafting meets sterile surgical precision. Every piece is an original concept engineered for anatomical harmony.'}
            </p>
          </div>

          {/* Mouse / Swipe Exploration Indicator & Atmospheric Floor Plant Representation */}
          <div className="pt-2 flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-400">
              <div className="w-6 h-9 rounded-full border border-white/20 flex items-start justify-center p-1.5">
                <div className="w-1 h-2 rounded-full bg-[#d4af37] animate-bounce" />
              </div>
              <span>Use your mouse or swipe to explore</span>
            </div>

            {/* Potted Studio Plant Detail (Stylized Architectural Badge) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              <span>Sanctuary Ambience</span>
            </div>
          </div>
        </div>

        {/* Center Column: Direct Perspective Portal into 3D Studio */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center py-6 lg:py-0">
          <div className="relative group cursor-pointer" onClick={onStepInside}>
            {/* Architectural Doorway Glow Framing */}
            <div className="w-64 sm:w-72 h-80 sm:h-96 rounded-3xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-black/40 via-transparent to-black/80 backdrop-blur-[2px] p-6 flex flex-col justify-between items-center shadow-2xl shadow-black/90 group-hover:border-[#d4af37] transition-all duration-500 transform group-hover:scale-[1.02]">
              
              {/* Top Doorway Arch Header */}
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#ffd885] uppercase">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>STUDIO THRESHOLD</span>
              </div>

              {/* Center Portal Focus (Visual Anchor over Three.js Canvas) */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full mx-auto subtle-glass-gold border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-lg group-hover:scale-110 transition-transform">
                  <ArrowUp className="w-6 h-6 animate-pulse" />
                </div>
                <div className="font-cinzel text-xs tracking-[0.2em] text-white uppercase font-bold">
                  PORTAL TO SANCTUARY
                </div>
                <p className="text-[10px] text-zinc-400 font-mono">
                  Inspect 9 connected zones
                </p>
              </div>

              {/* Step Inside Button (Matching Reference Image) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStepInside();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38728] text-black font-bold uppercase tracking-widest text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/30 transform group-hover:-translate-y-0.5 transition-all"
              >
                <ArrowUp className="w-4 h-4" />
                <span>STEP INSIDE</span>
              </button>

            </div>
          </div>
        </div>

        {/* Right Column: Studio Value Pillars & Editorial Benchmark */}
        <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end text-left lg:text-right space-y-6">
          <div className="space-y-4">
            <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold tracking-wide uppercase leading-snug">
              MORE THAN JUST A TATTOO <br />
              <span className="text-zinc-400 font-normal">IT'S A PART OF YOU</span>
            </h2>

            <p className="text-xs text-zinc-400 font-sans max-w-sm leading-relaxed">
              Every design is meticulously tailored to individual anatomical lines, utilizing medical-grade hygiene protocols and single-use cartridge needles.
            </p>
          </div>

          {/* 4 Minimalist Luxury Icon Badges (Matching Reference Image) */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            
            <div className="p-3.5 rounded-2xl subtle-glass border border-white/10 flex flex-col items-center text-center group hover:border-[#d4af37]/50 transition-colors">
              <Sparkles className="w-5 h-5 text-[#d4af37] mb-1.5" />
              <span className="text-[10px] font-mono tracking-wider text-white font-bold uppercase block">
                CUSTOM DESIGNS
              </span>
              <span className="text-[9px] text-zinc-400 mt-0.5">Original Ink Concepts</span>
            </div>

            <div className="p-3.5 rounded-2xl subtle-glass border border-white/10 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1.5" />
              <span className="text-[10px] font-mono tracking-wider text-white font-bold uppercase block">
                STERILE & SAFE
              </span>
              <span className="text-[9px] text-zinc-400 mt-0.5">Hospital-Grade Standards</span>
            </div>

            <div className="p-3.5 rounded-2xl subtle-glass border border-white/10 flex flex-col items-center text-center group hover:border-[#ffd885]/50 transition-colors">
              <Award className="w-5 h-5 text-[#ffd885] mb-1.5" />
              <span className="text-[10px] font-mono tracking-wider text-white font-bold uppercase block">
                MASTER ARTISTRY
              </span>
              <span className="text-[9px] text-zinc-400 mt-0.5">Owner & Master Artist Arun</span>
            </div>

            <div className="p-3.5 rounded-2xl subtle-glass border border-white/10 flex flex-col items-center text-center group hover:border-[#d4af37]/50 transition-colors">
              <HeartHandshake className="w-5 h-5 text-[#d4af37] mb-1.5" />
              <span className="text-[10px] font-mono tracking-wider text-white font-bold uppercase block">
                LIFETIME SUPPORT
              </span>
              <span className="text-[9px] text-zinc-400 mt-0.5">Dedicated Aftercare Regimen</span>
            </div>

          </div>

          {/* Action Button & Scroll Down Indicator */}
          <div className="flex items-center gap-4 w-full justify-start lg:justify-end pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-full subtle-glass border border-[#d4af37]/50 hover:bg-[#d4af37]/15 text-xs font-mono tracking-wider text-[#ffd885] uppercase transition-colors"
            >
              Consult Arun
            </button>

            <button
              onClick={onScrollDown}
              className="group flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-[#d4af37] rotate-90" />
              </div>
              <span className="tracking-widest uppercase text-[10px]">SCROLL DOWN</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
