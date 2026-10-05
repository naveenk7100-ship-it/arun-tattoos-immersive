import React from 'react';
import { ArrowRight, Image as ImageIcon, User, Shield, HeartHandshake } from 'lucide-react';
import type { StudioZoneId } from '../../types';
import { useLanguage } from '../../translations/LanguageContext';

interface ReceptionZoneProps {
  onNavigateZone: (zoneId: StudioZoneId) => void;
  onOpenBooking: () => void;
}

export const ReceptionZone: React.FC<ReceptionZoneProps> = ({ onNavigateZone, onOpenBooking }) => {
  const { t, language } = useLanguage();
  const rz = t.zones.reception;

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
          ZONE 02 • CONCIERGE & WELCOME
        </span>
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white mt-1 mb-3">
          {rz.name}
        </h2>
        <p className="text-sm md:text-base text-zinc-300 font-sans">
          {rz.desc}
        </p>
      </div>

      {/* Interactive Reception Desk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        
        {/* Hotspot 1: Explore Gallery */}
        <div 
          onClick={() => onNavigateZone('gallery')}
          className="group cursor-pointer p-6 rounded-2xl subtle-glass-gold hover:border-[#d4af37] transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono text-[#d4af37]">ARCHIVES</span>
          <h3 className="text-lg font-cinzel font-bold text-white mt-1 mb-2">
            The Living Gallery
          </h3>
          <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
            Inspect our master portfolio: custom portrait tributes, single-needle micro art, fine line geometry, and sacred full backs.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffd885] group-hover:translate-x-1 transition-transform">
            <span>{rz.exploreGallery}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Hotspot 2: Meet Artists */}
        <div 
          onClick={() => onNavigateZone('artist-desk')}
          className="group cursor-pointer p-6 rounded-2xl subtle-glass hover:border-[#d4af37]/60 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <User className="w-5 h-5 text-[#d4af37]" />
          </div>
          <span className="text-[11px] font-mono text-[#d4af37]">ATELIER</span>
          <h3 className="text-lg font-cinzel font-bold text-white mt-1 mb-2">
            Artist Desks
          </h3>
          <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
            Meet founder Nani Kumar (8+ yrs experience, TTC certified, Graphic Designer) and co-artist Yeswanth at their drafting stations.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ffd885] group-hover:translate-x-1 transition-transform">
            <span>{rz.meetArtists}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Hotspot 3: Sterilization & Station */}
        <div 
          onClick={() => onNavigateZone('tattoo-station')}
          className="group cursor-pointer p-6 rounded-2xl subtle-glass hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono text-emerald-400">CLINICAL HYGIENE</span>
          <h3 className="text-lg font-cinzel font-bold text-white mt-1 mb-2">
            Tattoo Station
          </h3>
          <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
            Step into our hydraulic recliner station equipped with Kwadron single-use needles, autoclaved surfaces, and surgical lighting.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>{rz.inspectStation}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Consultation Banner */}
      <div className="p-6 md:p-8 rounded-2xl subtle-glass border border-[#d4af37]/25 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-cinzel font-bold text-white">
              Complimentary Concept Consultation
            </h4>
            <p className="text-xs md:text-sm text-zinc-300 mt-1 max-w-xl">
              Unsure which style suits your anatomy? Sit with Nani Kumar or Yeswanth to calibrate sizing, design flow, and longevity before committing to ink.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="shrink-0 px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
        >
          {rz.reserveConsultation}
        </button>
      </div>

    </div>
  );
};
