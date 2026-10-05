import React from 'react';
import { Sparkles, ArrowRight, Eye, User, Shield, PenTool, Calendar, Heart } from 'lucide-react';
import type { StudioZoneId } from '../../types';

interface StudioHotspotHUDProps {
  currentZoneId: StudioZoneId;
  onHotspotAction: (zoneId: StudioZoneId) => void;
}

interface HotspotDefinition {
  zoneId: StudioZoneId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const HOTSPOTS: Record<StudioZoneId, HotspotDefinition> = {
  entrance: {
    zoneId: 'reception',
    label: 'STEP INSIDE RECEPTION',
    sublabel: 'Begin virtual consultation',
    icon: <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
  reception: {
    zoneId: 'booking-area',
    label: 'RESERVE A SESSION',
    sublabel: 'Direct consultation desk',
    icon: <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
  gallery: {
    zoneId: 'gallery',
    label: 'EXPLORE ARTWORK WALL',
    sublabel: 'Inspect needle gradients & placement',
    icon: <Eye className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
  'artist-desk': {
    zoneId: 'artist-desk',
    label: 'MEET NANI KUMAR & YESWANTH',
    sublabel: 'Review 8+ yrs TTC credentials',
    icon: <User className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
  'tattoo-station': {
    zoneId: 'tattoo-station',
    label: 'VIEW STERILE SERVICES',
    sublabel: 'Single-use Kwadron needle specs',
    icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />,
  },
  'design-table': {
    zoneId: 'design-table',
    label: 'CALIBRATE BODY PLACEMENT',
    sublabel: 'Interactive pain & flow scale',
    icon: <PenTool className="w-3.5 h-3.5 text-[#ffd885]" />,
  },
  'booking-area': {
    zoneId: 'booking-area',
    label: 'CONFIRM APPOINTMENT',
    sublabel: 'Direct WhatsApp booking link',
    icon: <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
  aftercare: {
    zoneId: 'aftercare',
    label: 'AFTERCARE REGIMEN',
    sublabel: '4-phase healing protocol',
    icon: <Heart className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
  'final-exit': {
    zoneId: 'entrance',
    label: 'RE-ENTER STUDIO',
    sublabel: 'Start walkthrough again',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />,
  },
};

export const StudioHotspotHUD: React.FC<StudioHotspotHUDProps> = ({
  currentZoneId,
  onHotspotAction,
}) => {
  const hotspot = HOTSPOTS[currentZoneId];
  if (!hotspot) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-8 z-30 pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <button
        onClick={() => onHotspotAction(hotspot.zoneId)}
        className="group subtle-glass-gold px-4 py-2.5 rounded-2xl flex items-center gap-3 text-left border border-[#d4af37]/30 hover:border-[#d4af37] shadow-xl shadow-black/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        title={hotspot.sublabel}
      >
        {/* Subtle pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping opacity-75 absolute" />
          <span className="w-2 h-2 rounded-full bg-[#d4af37] relative" />
        </div>

        <div>
          <div className="text-[10px] font-mono tracking-widest text-[#ffd885] font-semibold flex items-center gap-1.5">
            <span>{hotspot.label}</span>
            {hotspot.icon}
          </div>
          <div className="text-[11px] text-zinc-400 font-sans group-hover:text-zinc-200 transition-colors">
            {hotspot.sublabel}
          </div>
        </div>
      </button>
    </div>
  );
};
