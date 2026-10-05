import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  MapPin, 
  Clock, 
  Calendar, 
  ChevronDown, 
  PenTool, 
  Compass 
} from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface EntranceZoneProps {
  onEnter: () => void;
  onOpenBooking: () => void;
}

export const EntranceZone: React.FC<EntranceZoneProps> = ({ onEnter, onOpenBooking }) => {
  const { language } = useLanguage();
  const [showServices, setShowServices] = useState(false);

  const services = [
    { title: 'Custom Portrait Art', desc: 'Hyper-realistic tributes, lifelike tonal graduation, and anatomical likeness.', icon: '01' },
    { title: 'Micro Realism & Single Needle', desc: 'Surgical precision, ultra-fine single-needle detailing, and delicate textures.', icon: '02' },
    { title: 'Fine Line & Minimalist Script', desc: 'Crisp sacred typography, subtle floral stems, and timeless geometric lines.', icon: '03' },
    { title: 'Sacred & Monumental Full Backs', desc: 'Grand Lord Shiva, Vedic mandalas, and multi-session narrative masterpieces.', icon: '04' },
    { title: 'Cover-Ups & Scar Camouflage', desc: 'Artistic reclamation transforming unwanted ink or surgical scars seamlessly.', icon: '05' },
    { title: 'High-Contrast Black & Grey', desc: 'Deep charcoal chiaroscuro, smooth dynamic washes, and lifelong contrast.', icon: '06' },
  ];

  const journeySteps = [
    { step: '01', title: 'IDEA', desc: 'Bring your personal story, memories, or visual concept.' },
    { step: '02', title: 'DESIGN', desc: 'Nani Kumar drafts custom digital sketches on Wacom Cintiq.' },
    { step: '03', title: 'CONSULTATION', desc: 'Calibrate size, anatomical flow, and stencil placement.' },
    { step: '04', title: 'TATTOO', desc: 'Relax in our sterile bay with Bishop rotary precision.' },
    { step: '05', title: 'AFTERCARE', desc: 'Medical-grade SecondSkin barrier and natural healing balms.' },
  ];

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-6 md:py-12 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-700 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* 1. Atelier Location & Status Pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full subtle-glass border border-[#d4af37]/35 text-xs font-mono text-[#d4af37] mb-6 shadow-lg shadow-black/40">
        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
        <span className="tracking-wider">BANDAR ROAD, VIJAYAWADA</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        <span className="text-zinc-300 font-sans text-[11px]">STUDIO OPEN TODAY</span>
      </div>

      {/* 2. Main Brand Title & Tagline (Editorial Typography Hierarchy) */}
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-cinzel font-black tracking-tight text-white uppercase leading-[0.95] mb-3 select-none">
        ARUN <span className="gold-gradient-text">TATTOOS</span>
      </h1>

      <p className="font-cinzel text-lg sm:text-2xl md:text-3xl tracking-[0.24em] md:tracking-[0.32em] text-[#d4af37] font-semibold mb-6 uppercase">
        INK YOUR STORY.
      </p>

      <p className="max-w-xl text-xs sm:text-sm md:text-base text-zinc-300 font-sans leading-relaxed mb-8 font-normal">
        {language === 'te'
          ? 'విజయవాడ యొక్క ప్రీమియర్ కస్టమ్ టాటూ స్టూడియో. 8+ సంవత్సరాల కళా నైపుణ్యం, TTC సర్టిఫికేషన్ మరియు 100% స్టెరైల్ ప్రొఫెషనల్ కేర్.'
          : "Vijayawada's premier bespoke tattoo atelier led by Nani Kumar. Master portraiture, sacred realism, and clinical hygiene on Bandar Road."}
      </p>

      {/* 3. Primary & Secondary CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
        {/* Primary CTA: BOOK NOW */}
        <button
          onClick={onOpenBooking}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38728] text-black font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-[#d4af37]/30 transform hover:-translate-y-0.5 active:translate-y-0 group"
        >
          <Calendar className="w-4 h-4 text-black" />
          <span>BOOK NOW</span>
        </button>

        {/* Secondary CTA: STEP INSIDE */}
        <button
          onClick={onEnter}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full subtle-glass hover:bg-white/10 text-white font-medium tracking-wider text-xs sm:text-sm transition-all border border-white/20 hover:border-[#d4af37]/60 flex items-center justify-center gap-2 group"
        >
          <span>STEP INSIDE</span>
          <ArrowRight className="w-4 h-4 text-[#d4af37] transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4. Trust Badges Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-3xl mb-8">
        <div className="p-3 rounded-xl subtle-glass text-left border border-white/5">
          <Award className="w-4 h-4 text-[#d4af37] mb-1" />
          <div className="font-mono text-xs font-bold text-white">8+ Years</div>
          <div className="text-[11px] text-zinc-400">Master Artistry</div>
        </div>

        <div className="p-3 rounded-xl subtle-glass text-left border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
          <div className="font-mono text-xs font-bold text-white">100% Sterile</div>
          <div className="text-[11px] text-zinc-400">Kwadron Single-Use</div>
        </div>

        <div className="p-3 rounded-xl subtle-glass text-left border border-white/5">
          <Sparkles className="w-4 h-4 text-[#ffd885] mb-1" />
          <div className="font-mono text-xs font-bold text-white">TTC Certified</div>
          <div className="text-[11px] text-zinc-400">Govt Fine Arts</div>
        </div>

        <div className="p-3 rounded-xl subtle-glass text-left border border-white/5">
          <Clock className="w-4 h-4 text-[#d4af37] mb-1" />
          <div className="font-mono text-xs font-bold text-white">10:30 – 21:30</div>
          <div className="text-[11px] text-zinc-400">Daily Consultations</div>
        </div>
      </div>

      {/* 5. Services & Styles Drawer Button */}
      <button
        onClick={() => setShowServices(!showServices)}
        className="text-xs font-mono tracking-wider text-zinc-400 hover:text-[#d4af37] transition-colors flex items-center gap-1.5 py-1 mb-2"
      >
        <span>{showServices ? 'HIDE SERVICES & TATTOO JOURNEY' : 'EXPLORE SERVICES & 5-STEP JOURNEY'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showServices ? 'rotate-180 text-[#d4af37]' : ''}`} />
      </button>

      {/* 6. Expandable Curated Services & 5-Step Journey Overview */}
      {showServices && (
        <div className="w-full mt-4 space-y-8 animate-in fade-in duration-300">
          
          {/* Services & Styles Grid */}
          <div className="p-6 rounded-2xl subtle-glass border border-white/10 text-left">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#d4af37]" />
                  SERVICES & SIGNATURE STYLES
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Bespoke fine-art disciplines practiced in our Bandar Road studio
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((s) => (
                <div key={s.title} className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-[#d4af37]/40 transition-colors">
                  <span className="text-[10px] font-mono text-[#d4af37]">{s.icon}</span>
                  <h4 className="text-xs font-semibold text-zinc-100 mt-0.5 mb-1">{s.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Step Tattoo Journey */}
          <div className="p-6 rounded-2xl subtle-glass-gold border border-[#d4af37]/25 text-left">
            <h3 className="font-cinzel text-base font-bold text-white mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#d4af37]" />
              THE TATTOO JOURNEY
            </h3>
            <p className="text-xs text-zinc-400 font-sans mb-4">
              From personal memory to enduring living artwork
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {journeySteps.map((j) => (
                <div key={j.step} className="p-3 rounded-xl bg-black/50 border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#d4af37] font-bold">{j.step}</span>
                    <h5 className="text-xs font-bold text-white tracking-wider font-cinzel mt-0.5">{j.title}</h5>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{j.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
