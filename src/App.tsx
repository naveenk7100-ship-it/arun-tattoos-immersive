import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import type { StudioZoneId, StudioZone, GalleryArtwork } from './types';
import { STUDIO_ZONES, GALLERY_ITEMS } from './data/studioData';
import { StudioCanvas } from './components/canvas/StudioCanvas';
import { StudioNavbar } from './components/ui/StudioNavbar';
import { StudioFloorPlanHUD } from './components/ui/StudioFloorPlanHUD';
import { StudioHotspotHUD } from './components/ui/StudioHotspotHUD';
import { StudioLoader } from './components/ui/StudioLoader';
import { StudioFooter } from './components/ui/StudioFooter';
import { ReferenceHero } from './components/zones/ReferenceHero';
import { StudioPanoramaStrip } from './components/zones/StudioPanoramaStrip';
import { ReferenceEditorialGrid } from './components/zones/ReferenceEditorialGrid';
import { BookingModal } from './components/ui/BookingModal';
import { ArtworkInspectorModal } from './components/ui/ArtworkInspectorModal';
import { StudioJourneyModal } from './components/ui/StudioJourneyModal';
import { StudioZoneDetailModal } from './components/ui/StudioZoneDetailModal';
import { studioAudio } from './utils/audio';
import { LanguageProvider } from './translations/LanguageContext';
import type { AdminUser } from './types';
import { getStoredUser } from './services/api';

const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoneId, setCurrentZoneId] = useState<StudioZoneId>('entrance');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreset, setBookingPreset] = useState<{ artist?: string; style?: string }>({});
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Modals for deep commercial studio exploration
  const [activeArtwork, setActiveArtwork] = useState<GalleryArtwork | null>(null);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [activeZoneDetailId, setActiveZoneDetailId] = useState<StudioZoneId | null>(null);

  // Private Admin Route & Authentication State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getStoredUser());

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Listen for /admin or #admin URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdm = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminMode(isAdm);
      if (isAdm) {
        setAdminUser(getStoredUser());
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigateAdmin = useCallback(() => {
    setIsAdminMode(true);
    setAdminUser(getStoredUser());
    window.history.pushState(null, '', '/admin');
  }, []);

  const handleExitAdmin = useCallback(() => {
    setIsAdminMode(false);
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
  }, []);

  const handleLogoutAdmin = useCallback(() => {
    setAdminUser(null);
  }, []);

  const currentZone: StudioZone =
    STUDIO_ZONES.find((z) => z.id === currentZoneId) || STUDIO_ZONES[0];

  // Smooth scroll to a target element or studio section
  const handleSelectZone = useCallback((zoneId: StudioZoneId, openDetail = false) => {
    setCurrentZoneId(zoneId);
    studioAudio.playZoneTransitionChime();
    if (openDetail) {
      setActiveZoneDetailId(zoneId);
    }
  }, []);

  const handleOpenBooking = useCallback((artist?: string, style?: string) => {
    setBookingPreset({ artist: artist || 'Arun', style });
    setIsBookingOpen(true);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentZoneId('entrance');
  };

  const handleScrollDown = () => {
    const el = document.getElementById('showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  // Keyboard navigation & admin shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Studio Staff Admin Shortcut: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleNavigateAdmin();
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentZone.index + 1) % STUDIO_ZONES.length;
        handleSelectZone(STUDIO_ZONES[nextIdx].id);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentZone.index - 1 + STUDIO_ZONES.length) % STUDIO_ZONES.length;
        handleSelectZone(STUDIO_ZONES[prevIdx].id);
      } else if (e.key === 'Escape') {
        setIsBookingOpen(false);
        setActiveArtwork(null);
        setIsJourneyModalOpen(false);
        setActiveZoneDetailId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentZone.index, handleNavigateAdmin, handleSelectZone]);

  // Hotspot interaction router
  const handleHotspotAction = (targetZoneId: StudioZoneId) => {
    if (targetZoneId === 'booking-area') {
      handleOpenBooking();
    } else {
      handleSelectZone(targetZoneId, true);
    }
  };

  if (isAdminMode) {
    return (
      <LanguageProvider>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-xs font-mono text-[#d4af37] space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
              <span>Verifying Atelier Concierge Credentials...</span>
            </div>
          }
        >
          {adminUser ? (
            <AdminDashboard
              user={adminUser}
              onLogout={handleLogoutAdmin}
              onBackToStudio={handleExitAdmin}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={(user) => setAdminUser(user)}
              onBackToStudio={handleExitAdmin}
            />
          )}
        </Suspense>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-between overflow-x-hidden">
      
      {/* 0. CINEMATIC ENTRY LOADER */}
      {isLoading && (
        <StudioLoader
          onComplete={() => setIsLoading(false)}
          isReducedMotion={isReducedMotion}
        />
      )}

      {/* 1. THREE.JS 3D VIRTUAL STUDIO WORLD (Fixed Background Canvas) */}
      <StudioCanvas
        currentZone={currentZone}
        isReducedMotion={isReducedMotion}
      />

      {/* 2. TOP LUXURY NAVIGATION HEADER MATCHING REFERENCE */}
      <StudioNavbar
        currentZone={currentZone}
        onSelectZone={(zoneId) => handleSelectZone(zoneId, zoneId !== 'entrance')}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 3. ARCHITECTURAL ENVIRONMENTAL HOTSPOT HUD */}
      <StudioHotspotHUD
        currentZoneId={currentZoneId}
        onHotspotAction={handleHotspotAction}
      />

      {/* 4. MAIN EDITORIAL PAGE MATCHING REFERENCE IMAGE DIRECTLY */}
      <main className="relative z-10 w-full overflow-x-hidden flex flex-col">
        
        {/* ================================================================= */}
        {/* ROW 1: CINEMATIC HERO (Brand Wall, 3D Studio Portal, Value Pillars) */}
        {/* ================================================================= */}
        <section id="entrance" className="w-full">
          <ReferenceHero
            onStepInside={() => handleSelectZone('reception', true)}
            onOpenBooking={() => handleOpenBooking()}
            onScrollDown={handleScrollDown}
          />
        </section>

        {/* ================================================================= */}
        {/* ROW 2: 5-PANEL STUDIO SHOWCASE STRIP (Reception, Gallery, Desk, Station, Design) */}
        {/* ================================================================= */}
        <section id="showcase" className="w-full">
          <StudioPanoramaStrip
            onSelectZone={(zoneId) => handleSelectZone(zoneId, true)}
            activeZoneId={currentZoneId}
          />
        </section>

        {/* ================================================================= */}
        {/* ROW 3: EDITORIAL CONTENT GRID (Services, Tattoo Journey, Booking) */}
        {/* ================================================================= */}
        <section id="editorial" className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
          <ReferenceEditorialGrid
            onOpenBooking={(service) => handleOpenBooking('Arun', service)}
            onViewAllServices={() => setActiveArtwork(GALLERY_ITEMS[0])}
            onLearnJourney={() => setIsJourneyModalOpen(true)}
            onSelectArtworkModal={(imgUrl) => {
              const item = GALLERY_ITEMS.find((g) => g.imageUrl === imgUrl) || GALLERY_ITEMS[0];
              setActiveArtwork(item);
            }}
          />
        </section>

        {/* ================================================================= */}
        {/* ROW 4: LUXURY FOOTER (Coordinates, Phone, Socials, Cursive Signature) */}
        {/* ================================================================= */}
        <StudioFooter onScrollToTop={handleScrollToTop} />

      </main>

      {/* 5. BOTTOM ARCHITECTURAL CONTROLLER HUD */}
      <StudioFloorPlanHUD
        currentZone={currentZone}
        onSelectZone={(zoneId) => handleSelectZone(zoneId)}
      />

      {/* 6. MODAL BOOKING DIALOG */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialArtist={bookingPreset.artist}
        initialStyle={bookingPreset.style}
      />

      {/* 7. HIGH-RESOLUTION ARTWORK INSPECTOR MODAL */}
      {activeArtwork && (
        <ArtworkInspectorModal
          artwork={activeArtwork}
          onClose={() => setActiveArtwork(null)}
          onSelectSimilarStyle={(style, artist) => {
            setActiveArtwork(null);
            handleOpenBooking(artist, style);
          }}
          onNextArtwork={() => {
            const idx = GALLERY_ITEMS.findIndex((a) => a.id === activeArtwork.id);
            const nextIdx = (idx + 1) % GALLERY_ITEMS.length;
            setActiveArtwork(GALLERY_ITEMS[nextIdx]);
          }}
          onPrevArtwork={() => {
            const idx = GALLERY_ITEMS.findIndex((a) => a.id === activeArtwork.id);
            const prevIdx = (idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
            setActiveArtwork(GALLERY_ITEMS[prevIdx]);
          }}
        />
      )}

      {/* 8. TATTOO JOURNEY & AFTERCARE MODAL */}
      <StudioJourneyModal
        isOpen={isJourneyModalOpen}
        onClose={() => setIsJourneyModalOpen(false)}
        onOpenBooking={() => {
          setIsJourneyModalOpen(false);
          handleOpenBooking('Arun');
        }}
      />

      {/* 9. STUDIO ZONE DETAIL INSPECTOR MODAL */}
      <StudioZoneDetailModal
        zoneId={activeZoneDetailId}
        onClose={() => setActiveZoneDetailId(null)}
        onOpenBooking={() => {
          setActiveZoneDetailId(null);
          handleOpenBooking('Arun');
        }}
        onSelectZone={(zId) => {
          setActiveZoneDetailId(zId);
          handleSelectZone(zId);
        }}
      />

      </div>
    </LanguageProvider>
  );
}

export default App;
