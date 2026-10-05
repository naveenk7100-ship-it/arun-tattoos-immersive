import React, { useState } from 'react';
import { AFTERCARE_PHASES } from '../../data/studioData';
import { Heart, AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

export const AftercareZone: React.FC = () => {
  const { t, language } = useLanguage();
  const acz = t.zones.aftercare;
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const currentPhase = AFTERCARE_PHASES[activePhaseIndex];

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          ZONE 08 • AFTERCARE PRESERVATION
        </span>
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white mt-1 mb-3">
          {acz.name}
        </h2>
        <p className="text-xs md:text-sm text-zinc-300 font-sans">
          {acz.desc}
        </p>
      </div>

      {/* 4 Phase Horizontal Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
        {AFTERCARE_PHASES.map((p, idx) => {
          const isActive = idx === activePhaseIndex;
          return (
            <button
              key={idx}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-3.5 rounded-2xl text-left transition-all border ${
                isActive
                  ? 'subtle-glass-gold border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/15'
                  : 'subtle-glass border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <span className={`text-[10px] font-mono block ${isActive ? 'text-[#d4af37]' : 'text-zinc-500'}`}>
                {p.phase}
              </span>
              <div className="text-xs font-bold font-cinzel mt-0.5">{p.days}</div>
              <div className="text-[11px] truncate opacity-70 mt-0.5">{p.title}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed Phase Instruction Card */}
      <div className="subtle-glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-2">
          <div>
            <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest">
              {currentPhase.phase} • {currentPhase.days}
            </span>
            <h3 className="text-2xl font-cinzel font-bold text-white mt-0.5">
              {currentPhase.title}
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto">
            Aseptic Protocol
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {currentPhase.highlights.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
              <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-zinc-200 leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Crucial Dos and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* The Golden Rules (DO) */}
        <div className="p-6 rounded-2xl subtle-glass border border-emerald-500/20 text-left">
          <h4 className="text-sm font-cinzel font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Check className="w-4 h-4" />
            {acz.goldenRules}
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Wash hands thoroughly with soap before ever touching the fresh tattoo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Use clean, breathable single-use paper towels to pat dry.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Drink ample water to preserve dermal collagen and ink saturation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Contact Arun immediately if you notice unusual redness or heat.</span>
            </li>
          </ul>
        </div>

        {/* Absolute Red Flags (DON'T) */}
        <div className="p-6 rounded-2xl subtle-glass border border-rose-500/20 text-left">
          <h4 className="text-sm font-cinzel font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {acz.prohibitedRules}
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>DO NOT pick, scratch, or peel scabs—doing so pulls ink out of dermis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>DO NOT submerge in swimming pools, hot tubs, baths, or Krishna river.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>DO NOT expose fresh tattoos to intense direct sunlight or tanning beds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>DO NOT over-saturate with thick ointment (skin must breathe to heal).</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
