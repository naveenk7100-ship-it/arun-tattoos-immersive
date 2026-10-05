import React, { useState } from 'react';
import { PenTool, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface DesignTableZoneProps {
  onOpenBooking: () => void;
}

interface PlacementInfo {
  name: string;
  painRating: number;
  healingTime: string;
  recommendedStyles: string;
  flowAdvice: string;
}

const PLACEMENTS: Record<string, PlacementInfo> = {
  'Forearm / Inner Arm': {
    name: 'Forearm / Inner Arm',
    painRating: 2,
    healingTime: '10–14 Days',
    recommendedStyles: 'Portrait Art, Fine Line, Script, Sacred Geometry',
    flowAdvice: 'Optimal flat plane for photorealistic portraits. Low distortion during wrist rotation.',
  },
  'Upper Arm / Shoulder / Bicep': {
    name: 'Upper Arm / Shoulder / Bicep',
    painRating: 2,
    healingTime: '12–16 Days',
    recommendedStyles: 'Memorial Portraits, Bold Blackwork, Neo-Traditional',
    flowAdvice: 'Contours smoothly around deltoid musculature. Great sun protection longevity.',
  },
  'Full Back / Spine': {
    name: 'Full Back / Spine',
    painRating: 4,
    healingTime: '18–24 Days',
    recommendedStyles: 'Sacred Angelic Wings, Mythological Epics, Lord Shiva',
    flowAdvice: 'The ultimate panoramic canvas. Allows monumental feather depth and vertical symmetry.',
  },
  'Rib Cage / Side Torso': {
    name: 'Rib Cage / Side Torso',
    painRating: 5,
    healingTime: '14–18 Days',
    recommendedStyles: 'Delicate Fine Line, Script Quotes, Organic Botanicals',
    flowAdvice: 'Requires steady rhythmic breathing during needle application. Stunning intimate aesthetic.',
  },
  'Wrist / Hand / Finger': {
    name: 'Wrist / Hand / Finger',
    painRating: 3,
    healingTime: '8–12 Days',
    recommendedStyles: 'Single-Needle Micro Art, Minimalist Symbols, Astrolabe',
    flowAdvice: 'Requires highest precision to prevent pigment dispersion near skin flex creases.',
  },
  'Calf / Shin': {
    name: 'Calf / Shin',
    painRating: 3,
    healingTime: '14–20 Days',
    recommendedStyles: 'Mandala Shields, Geometric Patterns, Wildlife Realism',
    flowAdvice: 'Generous cylindrical canvas that flows with leg muscle motion while walking.',
  },
};

export const DesignTableZone: React.FC<DesignTableZoneProps> = ({ onOpenBooking }) => {
  const { t, language } = useLanguage();
  const dtz = t.zones.designTable;
  const [selectedPlacement, setSelectedPlacement] = useState<string>('Forearm / Inner Arm');
  const activePlacement = PLACEMENTS[selectedPlacement];

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <PenTool className="w-3.5 h-3.5" />
          ZONE 06 • DESIGN & STENCIL TABLE
        </span>
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white mt-1 mb-3">
          {dtz.name}
        </h2>
        <p className="text-xs md:text-sm text-zinc-300 font-sans">
          {dtz.desc}
        </p>
      </div>

      {/* Interactive Anatomical Placement Calibration Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Placement Selectors */}
        <div className="lg:col-span-5 space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
            {dtz.selectPlacement}
          </h3>
          {Object.keys(PLACEMENTS).map((key) => {
            const isSelected = selectedPlacement === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPlacement(key)}
                className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between border ${
                  isSelected
                    ? 'subtle-glass-gold border-[#d4af37] text-[#ffd885] shadow-lg shadow-[#d4af37]/10'
                    : 'subtle-glass border-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span className="text-xs font-medium">{key}</span>
                <span className="text-[10px] font-mono opacity-60">
                  Pain: {PLACEMENTS[key].painRating}/5
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Placement Calibration Details */}
        <div className="lg:col-span-7 subtle-glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">
                ANATOMICAL CALIBRATION
              </span>
              <h4 className="text-xl md:text-2xl font-cinzel font-bold text-white">
                {activePlacement.name}
              </h4>
            </div>
            
            {/* Pain Rating Meter */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 block">{dtz.sensitivity}</span>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-2.5 h-4 rounded-sm ${
                      lvl <= activePlacement.painRating ? 'bg-[#d4af37]' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-mono text-[#ffd885] uppercase tracking-wider block mb-1">
                {dtz.flowAdvice}
              </span>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                {activePlacement.flowAdvice}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">OPTIMAL ART STYLES</span>
                <span className="text-white font-medium">{activePlacement.recommendedStyles}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">ESTIMATED HEALING DURATION</span>
                <span className="text-[#ffd885] font-medium">{activePlacement.healingTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold uppercase tracking-wider text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <span>{dtz.draftConceptBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 4-Step Design Process Blueprint */}
      <div className="p-6 md:p-8 rounded-3xl subtle-glass border border-white/10">
        <h3 className="text-lg font-cinzel font-bold text-white text-center mb-6">
          The Arun Tattoos Custom Design Method
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-[#d4af37] block mb-1">STEP 01</span>
            <h5 className="text-xs font-bold text-white mb-1.5 font-cinzel">Vision & Reference Audit</h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              We review your ideas, personal narratives, and photo references to assess contrast and skin suitability.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-[#d4af37] block mb-1">STEP 02</span>
            <h5 className="text-xs font-bold text-white mb-1.5 font-cinzel">Digital Concept Draft</h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Nani Kumar applies graphic design tonal rendering to tailor shadows for maximum long-term clarity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-[#d4af37] block mb-1">STEP 03</span>
            <h5 className="text-xs font-bold text-white mb-1.5 font-cinzel">Live Muscle Stencil Check</h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Stencil placement is adjusted while you sit, stand, and flex to ensure zero anatomical distortion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
            <span className="text-[10px] font-mono text-[#d4af37] block mb-1">STEP 04</span>
            <h5 className="text-xs font-bold text-white mb-1.5 font-cinzel">Single-Needle Precision</h5>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Execution with microscopic needle groups, creating velvet transitions that age with dignity.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
