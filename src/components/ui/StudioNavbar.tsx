import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Compass, 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  Sparkles,
  Globe,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { STUDIO_CONTACT, STUDIO_ZONES } from '../../data/studioData';
import type { StudioZone, StudioZoneId } from '../../types';
import { studioAudio } from '../../utils/audio';
import { useLanguage } from '../../translations/LanguageContext';

interface StudioNavbarProps {
  currentZone: StudioZone;
  onSelectZone: (zoneId: StudioZoneId) => void;
  onOpenBooking: () => void;
}

export const StudioNavbar: React.FC<StudioNavbarProps> = ({
  currentZone,
  onSelectZone,
  onOpenBooking,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFloorPlanOpen, setIsFloorPlanOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const active = studioAudio.toggle();
    setIsPlayingAudio(active);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleZoneClick = (zoneId: StudioZoneId) => {
    onSelectZone(zoneId);
    studioAudio.playZoneTransitionChime();
    setIsFloorPlanOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'te' : 'en';
    setLanguage(nextLang);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand & Crest */}
        <div 
          onClick={() => handleZoneClick('entrance')}
          className="cursor-pointer group flex items-center gap-3 select-none"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-[#d4af37]/60 bg-black/80 p-0.5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:border-[#d4af37] shadow-lg shadow-black/80 overflow-hidden shrink-0">
            <img
              src={STUDIO_CONTACT.logoUrl}
              alt="Arun Tattoos Official Logo"
              className="w-full h-full object-contain aspect-square"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel tracking-[0.2em] text-sm sm:text-base font-bold text-white group-hover:text-[#ffd67a] transition-colors leading-tight">
              ARUN TATTOOS
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#a1a1aa] uppercase font-mono mt-0.5">
              {t.nav.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden xl:flex items-center gap-8 text-xs font-sans font-medium tracking-widest uppercase text-zinc-300">
          <button
            onClick={() => handleZoneClick('entrance')}
            className={`transition-colors hover:text-white relative py-1 ${
              currentZone.id === 'entrance' ? 'text-white font-bold' : ''
            }`}
          >
            EXPLORE
            {currentZone.id === 'entrance' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d4af37] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleZoneClick('reception')}
            className={`transition-colors hover:text-white relative py-1 ${
              currentZone.id === 'reception' ? 'text-white font-bold' : ''
            }`}
          >
            SERVICES
            {currentZone.id === 'reception' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d4af37] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleZoneClick('gallery')}
            className={`transition-colors hover:text-white relative py-1 ${
              currentZone.id === 'gallery' ? 'text-white font-bold' : ''
            }`}
          >
            GALLERY
            {currentZone.id === 'gallery' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d4af37] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleZoneClick('artist-desk')}
            className={`transition-colors hover:text-white relative py-1 ${
              currentZone.id === 'artist-desk' ? 'text-white font-bold' : ''
            }`}
          >
            ABOUT
            {currentZone.id === 'artist-desk' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d4af37] rounded-full" />
            )}
          </button>
          <button
            onClick={() => handleZoneClick('booking-area')}
            className={`transition-colors hover:text-white relative py-1 ${
              currentZone.id === 'booking-area' ? 'text-white font-bold' : ''
            }`}
          >
            BOOKING
            {currentZone.id === 'booking-area' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d4af37] rounded-full" />
            )}
          </button>
          <div className="w-px h-4 bg-white/15 mx-1" />
          <button
            onClick={() => setIsFloorPlanOpen(!isFloorPlanOpen)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] uppercase font-mono tracking-wider text-[#d4af37] hover:text-white transition-colors flex items-center gap-1.5"
            title={t.nav.floorPlanTitle}
          >
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Floor Plan</span>
          </button>
        </nav>

        {/* Medium Screen Center: Compact Zone HUD */}
        <div className="hidden lg:flex xl:hidden items-center gap-2 px-4 py-1.5 rounded-full subtle-glass border border-white/10 shadow-2xl">
          <span className="text-[11px] font-mono tracking-widest text-[#d4af37] font-semibold">
            {currentZone.code}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className={`text-xs font-medium tracking-wider text-zinc-200 uppercase ${language === 'te' ? 'font-telugu' : ''}`}>
            {currentZone.name}
          </span>
          <button
            onClick={() => setIsFloorPlanOpen(!isFloorPlanOpen)}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] uppercase font-mono tracking-wider text-zinc-400 hover:text-white transition-colors flex items-center gap-1 border border-white/5"
            title={t.nav.floorPlanTitle}
          >
            <Compass className="w-3 h-3 text-[#d4af37]" />
            {t.nav.floorPlan}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3.5">
          
          {/* Dual Language Toggle EN | తెలుగు */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-full subtle-glass hover:border-[#d4af37]/50 text-xs font-mono transition-colors flex items-center gap-1.5 text-zinc-300"
            title="Switch Language / భాషను మార్చుకోండి"
          >
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className={language === 'en' ? 'text-[#ffd885] font-bold' : 'text-zinc-500'}>EN</span>
            <span className="text-zinc-600 text-[10px]">|</span>
            <span className={`text-xs ${language === 'te' ? 'text-[#ffd885] font-bold font-telugu' : 'text-zinc-500'}`}>తెలుగు</span>
          </button>

          {/* Audio Ambience Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle studio ambient audio"
            className="relative p-2.5 rounded-full subtle-glass hover:border-[#d4af37]/40 transition-colors text-zinc-300 hover:text-[#d4af37] focus:outline-none"
            title={isPlayingAudio ? 'Mute Studio Ambience' : 'Play Ambient Soundscape'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              </>
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Fullscreen Immersion Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen studio view"
            className="p-2.5 rounded-full subtle-glass hover:border-[#d4af37]/40 transition-colors text-zinc-300 hover:text-[#d4af37] focus:outline-none"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Atelier View'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Quick Call */}
          <a
            href={`tel:${STUDIO_CONTACT.phone}`}
            aria-label="Call Arun Tattoo Studio: 72072 02082"
            className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 rounded-full subtle-glass border border-white/15 hover:border-[#d4af37]/60 text-zinc-300 hover:text-white transition-all duration-300 shadow-md shadow-black/40 shrink-0 select-none group"
          >
            <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono font-semibold text-zinc-100 tracking-wider whitespace-nowrap">
              72072 02082
            </span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={STUDIO_CONTACT.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full subtle-glass text-xs font-mono text-emerald-400 hover:border-emerald-500/40 transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{t.nav.whatsApp}</span>
          </a>

          {/* Primary Book Session CTA */}
          <button
            onClick={onOpenBooking}
            className="px-4 sm:px-5 py-2 rounded-full border border-white/30 hover:border-[#d4af37] text-white hover:text-black hover:bg-[#d4af37] text-xs font-sans tracking-widest uppercase font-semibold transition-all duration-300 shrink-0"
          >
            BOOK NOW
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full subtle-glass text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Interactive Architectural Floor Plan Dropdown (Desktop) */}
      {isFloorPlanOpen && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl subtle-glass-gold p-6 rounded-2xl shadow-2xl border border-[#d4af37]/30 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d4af37]" />
                VIRTUAL STUDIO ARCHITECTURE & FLOOR PLAN
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Select any studio quarter to navigate the 3D perspective
              </p>
            </div>
            <button
              onClick={() => setIsFloorPlanOpen(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {STUDIO_ZONES.map((zone) => {
              const isActive = zone.id === currentZone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-200 flex items-start gap-3 border ${
                    isActive
                      ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                      : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#d4af37] text-black font-bold' : 'bg-white/10 text-zinc-400'
                  }`}>
                    0{zone.index + 1}
                  </span>
                  <div>
                    <h4 className={`text-xs font-semibold tracking-wide ${isActive ? 'text-[#ffd67a]' : 'text-zinc-200'}`}>
                      {zone.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {zone.subhead}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 inset-x-4 subtle-glass-gold p-5 rounded-2xl shadow-2xl border border-[#d4af37]/30 z-50">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#d4af37]/40 bg-black/60 p-0.5 shrink-0">
              <img
                src={STUDIO_CONTACT.logoUrl}
                alt="Arun Tattoos Official Logo"
                className="w-full h-full object-contain aspect-square"
              />
            </div>
            <div>
              <span className="text-xs font-cinzel font-bold text-white tracking-widest uppercase block">
                ARUN TATTOOS
              </span>
              <span className="text-[10px] text-[#d4af37] font-mono">
                Studio Walkthrough
              </span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {STUDIO_ZONES.map((zone) => {
              const isActive = zone.id === currentZone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#ffd67a]'
                      : 'bg-black/30 border-white/5 text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono opacity-60">0{zone.index + 1}</span>
                    <span className="text-xs font-medium">{zone.name}</span>
                  </div>
                  {isActive && <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href={`tel:${STUDIO_CONTACT.phone}`}
              className="w-full py-2.5 rounded-lg bg-white/5 text-center text-xs font-mono text-zinc-200 flex items-center justify-center gap-2 border border-white/10"
            >
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              Call {STUDIO_CONTACT.formattedPhone}
            </a>
            <a
              href={STUDIO_CONTACT.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-emerald-950/60 text-center text-xs font-mono text-emerald-400 flex items-center justify-center gap-2 border border-emerald-500/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Open WhatsApp Chat
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
