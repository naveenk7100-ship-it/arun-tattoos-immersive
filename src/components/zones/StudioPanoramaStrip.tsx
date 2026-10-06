import React from 'react';
import type { StudioZoneId } from '../../types';
import { useLanguage } from '../../translations/LanguageContext';
import { studioAudio } from '../../utils/audio';
import { assetUrl } from '../../utils/assetUrl';

interface StudioPanoramaStripProps {
  onSelectZone: (zoneId: StudioZoneId) => void;
  activeZoneId?: StudioZoneId;
}

interface ShowcasePanel {
  id: StudioZoneId;
  title: string;
  teluguTitle: string;
  subtext: string;
  teluguSubtext: string;
  image: string;
  accentColor: string;
}

const SHOWCASE_PANELS: ShowcasePanel[] = [
  {
    id: 'reception',
    title: 'RECEPTION',
    teluguTitle: 'రిసెప్షన్',
    subtext: 'Welcome to Arun Tattoos',
    teluguSubtext: 'అరుణ్ టాటూస్‌కి స్వాగతం',
    image: assetUrl('/images/branding/arun-tattoos-logo.jpg'),
    accentColor: '#d4af37',
  },
  {
    id: 'gallery',
    title: 'ART GALLERY',
    teluguTitle: 'ఆర్ట్ గ్యాలరీ',
    subtext: 'Explore our work',
    teluguSubtext: 'మా కళాత్మక సృష్టిని వీక్షించండి',
    image: assetUrl('/images/gallery/kali-goddess-backpiece.jpg'),
    accentColor: '#ffd885',
  },
  {
    id: 'artist-desk',
    title: 'ARTIST DESK',
    teluguTitle: 'ఆర్టిస్ట్ డెస్క్',
    subtext: 'Meet the artist',
    teluguSubtext: 'మాస్టర్ ఆర్టిస్ట్ అరుణ్ వర్క్‌స్పేస్',
    image: assetUrl('/images/gallery/realism-portrait-tribute.png'),
    accentColor: '#d4af37',
  },
  {
    id: 'tattoo-station',
    title: 'TATTOO STATION',
    teluguTitle: 'టాటూ స్టేషన్',
    subtext: 'Professional & Hygienic',
    teluguSubtext: '100% స్టెరైల్ ప్రొఫెషనల్ బే',
    image: assetUrl('/images/gallery/arun-studio-session.png'),
    accentColor: '#10b981',
  },
  {
    id: 'design-table',
    title: 'DESIGN TABLE',
    teluguTitle: 'డిజైన్ టేబుల్',
    subtext: 'Your idea, our canvas',
    teluguSubtext: 'మీ ఆలోచన - మా కళా కాన్వాస్',
    image: assetUrl('/images/gallery/compass-geometric-band.png'),
    accentColor: '#ffd885',
  },
];

export const StudioPanoramaStrip: React.FC<StudioPanoramaStripProps> = ({ 
  onSelectZone,
  activeZoneId = 'reception'
}) => {
  const { language } = useLanguage();

  const handlePanelClick = (zoneId: StudioZoneId) => {
    studioAudio.playZoneTransitionChime();
    onSelectZone(zoneId);
  };

  return (
    <div className={`w-full my-2 select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* 5 Connected Full-Bleed Showcase Panels matching Reference Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-y border-white/10 bg-[#070709] overflow-hidden">
        {SHOWCASE_PANELS.map((panel) => {
          const isActive = activeZoneId === panel.id;
          return (
            <div
              key={panel.id}
              onClick={() => handlePanelClick(panel.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePanelClick(panel.id);
                }
              }}
              className={`group relative h-64 sm:h-72 lg:h-80 cursor-pointer overflow-hidden border-b sm:border-b-0 sm:border-r border-white/10 last:border-r-0 transition-all duration-500`}
            >
              {/* Background Architectural Atmosphere with Authentic Imagery */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter grayscale brightness-50 contrast-125 group-hover:scale-105 group-hover:brightness-75 transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${panel.image})` }}
              />

              {/* Dark Studio Moody Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 group-hover:via-black/40 transition-colors duration-500" />
              
              {/* Warm Amber Practical Lighting Glow Accent */}
              <div className="absolute -top-12 inset-x-0 h-28 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.22)_0%,transparent_75%)] opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Panel Content Header (Top-Left matching Reference Image) */}
              <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full">
                <div className="space-y-1">
                  <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-widest uppercase group-hover:text-[#ffd67a] transition-colors">
                    {language === 'te' ? panel.teluguTitle : panel.title}
                  </h3>
                  <p className="text-[11px] font-sans text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {language === 'te' ? panel.teluguSubtext : panel.subtext}
                  </p>
                </div>

                {/* Bottom Highlight Indicator */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-[#d4af37]/60 transition-colors">
                  <span className="text-[9px] font-mono text-zinc-500 group-hover:text-[#d4af37] tracking-widest uppercase font-semibold">
                    INSPECT AREA
                  </span>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#d4af37] shadow-[0_0_8px_#d4af37]' 
                      : 'bg-white/20 group-hover:bg-[#d4af37]'
                  }`} />
                </div>
              </div>

              {/* Active Golden Bottom Border Accent */}
              <div className={`absolute bottom-0 inset-x-0 h-1 bg-[#d4af37] transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </div>
          );
        })}
      </div>

    </div>
  );
};
