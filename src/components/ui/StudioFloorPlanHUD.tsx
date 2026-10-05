import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StudioZone, StudioZoneId } from '../../types';
import { STUDIO_ZONES } from '../../data/studioData';
import { studioAudio } from '../../utils/audio';
import { useLanguage } from '../../translations/LanguageContext';

interface StudioFloorPlanHUDProps {
  currentZone: StudioZone;
  onSelectZone: (zoneId: StudioZoneId) => void;
}

const zoneKeyMap: Record<StudioZoneId, 'entrance' | 'reception' | 'gallery' | 'artistDesk' | 'tattooStation' | 'designTable' | 'bookingArea' | 'aftercare' | 'finalExit'> = {
  'entrance': 'entrance',
  'reception': 'reception',
  'gallery': 'gallery',
  'artist-desk': 'artistDesk',
  'tattoo-station': 'tattooStation',
  'design-table': 'designTable',
  'booking-area': 'bookingArea',
  'aftercare': 'aftercare',
  'final-exit': 'finalExit',
};

export const StudioFloorPlanHUD: React.FC<StudioFloorPlanHUDProps> = ({
  currentZone,
  onSelectZone,
}) => {
  const { t, language } = useLanguage();
  const currentIndex = currentZone.index;

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + STUDIO_ZONES.length) % STUDIO_ZONES.length;
    onSelectZone(STUDIO_ZONES[prevIndex].id);
    studioAudio.playZoneTransitionChime();
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % STUDIO_ZONES.length;
    onSelectZone(STUDIO_ZONES[nextIndex].id);
    studioAudio.playZoneTransitionChime();
  };

  const currentZoneKey = zoneKeyMap[currentZone.id];
  const localizedZoneName = t.zones[currentZoneKey]?.name || currentZone.name;

  return (
    <div className="fixed bottom-6 inset-x-0 z-30 px-4 pointer-events-none">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
        
        {/* Main Floating Controller Capsule */}
        <div className="pointer-events-auto subtle-glass border border-white/10 rounded-full px-3 md:px-5 py-2.5 flex items-center justify-between gap-4 md:gap-8 shadow-2xl backdrop-blur-xl">
          
          {/* Previous Zone Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous studio zone"
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all transform active:scale-95"
            title="Previous Zone (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Zone Indicator & Dot Matrix */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5">
              {STUDIO_ZONES.map((zone) => {
                const isActive = zone.id === currentZone.id;
                const key = zoneKeyMap[zone.id];
                const label = t.zones[key]?.name || zone.name;
                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      onSelectZone(zone.id);
                      studioAudio.playZoneTransitionChime();
                    }}
                    aria-label={`Jump to ${label}`}
                    className={`transition-all duration-300 rounded-full ${
                      isActive
                        ? 'w-6 md:w-8 h-1.5 bg-[#d4af37] shadow-sm shadow-[#d4af37]'
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    title={`${zone.code}: ${label}`}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-mono text-[#d4af37] font-semibold">
                {String(currentIndex + 1).padStart(2, '0')} / {String(STUDIO_ZONES.length).padStart(2, '0')}
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className={`text-xs md:text-sm font-semibold tracking-wider text-zinc-100 uppercase ${language === 'te' ? 'font-telugu' : 'font-sans'}`}>
                {localizedZoneName}
              </span>
            </div>
          </div>

          {/* Next Zone Button */}
          <button
            onClick={handleNext}
            aria-label="Next studio zone"
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all transform active:scale-95"
            title="Next Zone (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Minimal keyboard indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-wider">
          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-zinc-400">←</span>
          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-zinc-400">→</span>
          <span className={language === 'te' ? 'font-telugu' : ''}>
            {language === 'te' ? 'స్టూడియోలో ప్రయాణించడానికి బాణం కీలను ఉపయోగించండి' : 'Use arrow keys to travel through the studio'}
          </span>
        </div>

      </div>
    </div>
  );
};
