import React from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowUpRight, 
  Palette, 
  PenTool, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import type { StudioZoneId } from '../../types';
import { useLanguage } from '../../translations/LanguageContext';
import { studioAudio } from '../../utils/audio';

interface StudioPanoramaStripProps {
  onSelectZone: (zoneId: StudioZoneId) => void;
}

interface PanoramaCard {
  id: StudioZoneId;
  indexCode: string;
  title: string;
  teluguTitle: string;
  subtitle: string;
  teluguSubtitle: string;
  icon: React.ReactNode;
  tag: string;
}

const PANORAMA_ZONES: PanoramaCard[] = [
  {
    id: 'reception',
    indexCode: '02',
    title: 'RECEPTION',
    teluguTitle: 'రిసెప్షన్ & స్వాగతం',
    subtitle: 'Concierge, charred timber & first consultation',
    teluguSubtitle: 'కన్సల్టేషన్ & స్టూడియో సమాచారం',
    icon: <Sparkles className="w-5 h-5 text-[#d4af37]" />,
    tag: 'WELCOME',
  },
  {
    id: 'gallery',
    indexCode: '03',
    title: 'ART GALLERY',
    teluguTitle: 'ఆర్ట్ గ్యాలరీ',
    subtitle: 'Living canvas archives of authentic masterpieces',
    teluguSubtitle: 'అసలైన ఆర్ట్ వర్క్స్ & టెంపుల్స్',
    icon: <Palette className="w-5 h-5 text-[#ffd885]" />,
    tag: 'ARCHIVES',
  },
  {
    id: 'artist-desk',
    indexCode: '04',
    title: 'ARTIST DESK',
    teluguTitle: 'మాస్టర్ ఆర్టిస్ట్ డెస్క్',
    subtitle: 'Arun master atelier & bespoke digital drafting',
    teluguSubtitle: 'కస్టమ్ డిజిటల్ స్కెచింగ్',
    icon: <PenTool className="w-5 h-5 text-[#d4af37]" />,
    tag: 'ATELIER',
  },
  {
    id: 'tattoo-station',
    indexCode: '05',
    title: 'TATTOO STATION',
    teluguTitle: 'టాటూ స్టేషన్',
    subtitle: 'Surgical sanctuary with Bishop rotary precision',
    teluguSubtitle: '100% స్టెరైల్ ప్రొఫెషనల్ బే',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    tag: 'STERILE',
  },
  {
    id: 'design-table',
    indexCode: '06',
    title: 'DESIGN TABLE',
    teluguTitle: 'డిజైన్ టేబుల్',
    subtitle: 'From initial sketch to anatomical stencil blueprint',
    teluguSubtitle: 'స్టెన్సిల్ & బాడీ ప్లేస్‌మెంట్',
    icon: <Layers className="w-5 h-5 text-[#ffd885]" />,
    tag: 'BLUEPRINT',
  },
];

export const StudioPanoramaStrip: React.FC<StudioPanoramaStripProps> = ({ onSelectZone }) => {
  const { language } = useLanguage();

  const handleCardClick = (zoneId: StudioZoneId) => {
    studioAudio.playZoneTransitionChime();
    onSelectZone(zoneId);
  };

  return (
    <div className={`w-full py-4 select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      {/* Header bar above the panorama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] tracking-widest uppercase">
          <Compass className="w-4 h-4 text-[#d4af37]" />
          <span>CONNECTED ARCHITECTURAL QUARTERS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
        </div>
        <p className="text-[11px] font-mono text-zinc-400">
          Click any quarter to glide 3D camera & examine in detail
        </p>
      </div>

      {/* 5-Column Architectural Panorama Grid (Horizontally scrollable on small mobile, grid on md+) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {PANORAMA_ZONES.map((zone) => (
          <div
            key={zone.id}
            onClick={() => handleCardClick(zone.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(zone.id);
              }
            }}
            className="group relative cursor-pointer rounded-2xl subtle-glass border border-white/10 hover:border-[#d4af37]/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d4af37]/15 bg-gradient-to-b from-white/[0.03] to-transparent active:scale-[0.98]"
          >
            {/* Top row: Index & Mini Tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-zinc-500 group-hover:text-[#d4af37] transition-colors font-bold tracking-widest">
                ZONE {zone.indexCode}
              </span>
              <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 group-hover:border-[#d4af37]/40 group-hover:text-[#ffd885] transition-colors uppercase">
                {zone.tag}
              </span>
            </div>

            {/* Icon & Title */}
            <div className="space-y-2 mb-4">
              <div className="w-9 h-9 rounded-xl subtle-glass border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#d4af37]/50 transition-all">
                {zone.icon}
              </div>
              <div>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-white tracking-wider group-hover:text-[#ffd67a] transition-colors">
                  {language === 'te' ? zone.teluguTitle : zone.title}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-snug mt-1 font-sans line-clamp-2">
                  {language === 'te' ? zone.teluguSubtitle : zone.subtitle}
                </p>
              </div>
            </div>

            {/* Bottom action trigger */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400 group-hover:text-[#d4af37] transition-colors">
              <span className="tracking-widest uppercase">EXPLORE ZONE</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            {/* Subtle glow accent on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
