import React from 'react';
import { X, Sparkles, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { STUDIO_ZONES } from '../../data/studioData';
import type { StudioZoneId } from '../../types';
import { useLanguage } from '../../translations/LanguageContext';
import { assetUrl } from '../../utils/assetUrl';

interface StudioZoneDetailModalProps {
  zoneId: StudioZoneId | null;
  onClose: () => void;
  onOpenBooking: () => void;
  onSelectZone: (zoneId: StudioZoneId) => void;
}

const ZONE_DETAILS: Record<string, { image: string; highlights: string[]; equipment: string[] }> = {
  entrance: {
    image: assetUrl('/images/branding/arun-tattoos-logo.jpg'),
    highlights: ['Ribbed glass and charred black steel portal', 'Ambient bronze backlight illumination', 'Private appointment sanctuary threshold'],
    equipment: ['Steel acoustic damping doorway', 'Architectural track lights (2700K)', 'Direct concierge check-in'],
  },
  reception: {
    image: assetUrl('/images/branding/arun-tattoos-logo.jpg'),
    highlights: ['Handcrafted charred timber reception counter', 'Backlit embossed bronze Arun Tattoos crest', 'Client consultation lounge seating'],
    equipment: ['Digital booking terminals', 'Curated flash archives dossier', 'Private consultation bench'],
  },
  gallery: {
    image: assetUrl('/images/gallery/kali-goddess-backpiece.jpg'),
    highlights: ['Spotlight-illuminated living canvas archives', 'Realism portraits, blackwork Shiva, fine line geometry', 'Authentic healed portfolio documentation'],
    equipment: ['High-CRI 98+ directional spotlights', 'Anti-reflective museum glass frames', 'Monochrome art collection'],
  },
  'artist-desk': {
    image: assetUrl('/images/gallery/realism-portrait-tribute.png'),
    highlights: ['Master Artist Arun dedicated workspace', 'Digital concept art and anatomical flow mapping', '8+ years of fine art drafting pedigree'],
    equipment: ['Wacom Cintiq drafting display', 'Custom pigment mixing vials', 'Fine-line pigment pens & lightpad'],
  },
  'tattoo-station': {
    image: assetUrl('/images/gallery/arun-studio-session.png'),
    highlights: ['100% sterile surgical protocol', 'Single-use Kwadron cartridge needles', 'Hospital-grade barrier films and autoclave protocols'],
    equipment: ['Matte black hydraulic client recliner', 'Bishop rotary machines & critical power', 'Surgical articulating ring lights'],
  },
  'design-table': {
    image: assetUrl('/images/gallery/compass-geometric-band.png'),
    highlights: ['From pencil concept to skin stencil blueprint', 'Anatomical sizing and muscle alignment evaluation', 'Thermal transfer stencil testing'],
    equipment: ['Thermal stencil printer', 'A3 LED drafting light table', 'Contour alignment mirrors'],
  },
  'booking-area': {
    image: assetUrl('/images/gallery/compass-geometric-band.png'),
    highlights: ['Private scheduling & consultation lounge', 'Transparent project pricing & session timing', '1-on-1 consultation with Arun'],
    equipment: ['Concierge calendar scheduling', 'Direct WhatsApp verification', 'Custom project timeline planner'],
  },
  aftercare: {
    image: assetUrl('/images/gallery/arun-studio-session.png'),
    highlights: ['Medical-grade SecondSkin barrier wraps', 'Antibacterial washes & natural soothing balms', 'Lifelong color vibrancy guarantee'],
    equipment: ['Hypoallergenic medical film', 'Organic botanical aftercare balms', 'Detailed 4-phase recovery guide'],
  },
  'final-exit': {
    image: assetUrl('/images/branding/arun-tattoos-logo.jpg'),
    highlights: ['Opposite to Gravity Gym, First Floor', 'Direct line: +91 7207202082', 'Follow on Instagram & WhatsApp'],
    equipment: ['Studio reception concierge', 'Appointment confirmation', 'Direct client support channel'],
  },
};

export const StudioZoneDetailModal: React.FC<StudioZoneDetailModalProps> = ({
  zoneId,
  onClose,
  onOpenBooking,
  onSelectZone,
}) => {
  const { language } = useLanguage();

  if (!zoneId) return null;

  const currentZone = STUDIO_ZONES.find((z) => z.id === zoneId) || STUDIO_ZONES[0];
  const details = ZONE_DETAILS[zoneId] || ZONE_DETAILS.reception;

  const currentIndex = currentZone.index;
  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + STUDIO_ZONES.length) % STUDIO_ZONES.length;
    onSelectZone(STUDIO_ZONES[prevIdx].id);
  };
  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % STUDIO_ZONES.length;
    onSelectZone(STUDIO_ZONES[nextIdx].id);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 ${language === 'te' ? 'font-telugu' : ''}`}>
      <div className="relative w-full max-w-4xl bg-[#0d0d12] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-bold uppercase px-2.5 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
              {currentZone.code}
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase">
              {currentZone.subhead}
            </span>
          </div>

          {/* Zone Prev / Next Switcher */}
          <div className="flex items-center gap-2 pr-10">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full border border-white/15 hover:border-[#d4af37] text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-zinc-400">
              {currentIndex + 1} / {STUDIO_ZONES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full border border-white/15 hover:border-[#d4af37] text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white uppercase mb-2">
          {currentZone.name}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 font-sans mb-6 leading-relaxed">
          {currentZone.shortDesc}
        </p>

        {/* Main Content Grid: Image + Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          
          {/* Authentic Visual Area */}
          <div className="md:col-span-6 rounded-2xl overflow-hidden border border-white/10 relative h-64 sm:h-72 bg-black/60">
            <img
              src={details.image}
              alt={currentZone.name}
              className="w-full h-full object-cover filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-[10px] font-mono tracking-widest text-[#ffd885] uppercase">
                {currentZone.name} • ARUN TATTOOS
              </span>
            </div>
          </div>

          {/* Specs & Architecture Highlights */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-mono font-bold text-[#d4af37] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                ARCHITECTURAL HIGHLIGHTS
              </h4>
              <ul className="space-y-2 mb-4">
                {details.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                    <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CLINICAL & STUDIO EQUIPMENT
              </h4>
              <ul className="space-y-2">
                {details.equipment.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 font-sans">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-zinc-400">
            Consult directly with master artist Arun
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <span>RESERVE ATELIER SESSION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
