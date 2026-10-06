import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import type { StudioZoneId, StudioZone } from './types';
import { STUDIO_ZONES } from './data/studioData';
import { StudioCanvas } from './components/canvas/StudioCanvas';
import { StudioNavbar } from './components/ui/StudioNavbar';
import { StudioFloorPlanHUD } from './components/ui/StudioFloorPlanHUD';
import { StudioHotspotHUD } from './components/ui/StudioHotspotHUD';
import { StudioLoader } from './components/ui/StudioLoader';
import { EntranceZone } from './components/zones/EntranceZone';
import { ReceptionZone } from './components/zones/ReceptionZone';
import { GalleryZone } from './components/zones/GalleryZone';
import { ArtistDeskZone } from './components/zones/ArtistDeskZone';
import { TattooStationZone } from './components/zones/TattooStationZone';
import { DesignTableZone } from './components/zones/DesignTableZone';
import { BookingAreaZone } from './components/zones/BookingAreaZone';
import { AftercareZone } from './components/zones/AftercareZone';
import { ExitZone } from './components/zones/ExitZone';
import { BookingModal } from './components/ui/BookingModal';
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

  // Smooth scroll to a target zone section with natural browser motion
  const handleSelectZone = useCallback((zoneId: StudioZoneId) => {
    setCurrentZoneId(zoneId);
    const element = document.getElementById(zoneId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    studioAudio.playZoneTransitionChime();
  }, []);

  const handleOpenBooking = useCallback((artist?: string, style?: string) => {
    setBookingPreset({ artist: artist || 'Arun', style });
    setIsBookingOpen(true);
  }, []);

  // Passive IntersectionObserver to update 3D camera & HUD as user scrolls naturally
  useEffect(() => {
    if (isAdminMode) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.1,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id as StudioZoneId;
          if (id && STUDIO_ZONES.some((z) => z.id === id)) {
            setCurrentZoneId(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const zoneIds: StudioZoneId[] = [
      'entrance',
      'reception',
      'gallery',
      'artist-desk',
      'tattoo-station',
      'design-table',
      'booking-area',
      'aftercare',
      'final-exit',
    ];

    zoneIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isAdminMode]);

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentZone.index, handleNavigateAdmin, handleSelectZone]);

  // Hotspot interaction router
  const handleHotspotAction = (targetZoneId: StudioZoneId) => {
    if (targetZoneId === 'booking-area' && currentZoneId === 'reception') {
      handleOpenBooking();
    } else {
      handleSelectZone(targetZoneId);
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
      <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-between overflow-x-hidden">
      
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

      {/* 2. TOP LUXURY NAVIGATION HEADER */}
      <StudioNavbar
        currentZone={currentZone}
        onSelectZone={handleSelectZone}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 3. ARCHITECTURAL ENVIRONMENTAL HOTSPOT HUD */}
      <StudioHotspotHUD
        currentZoneId={currentZoneId}
        onHotspotAction={handleHotspotAction}
      />

      {/* 4. MAIN RESTORED OLD ARUN TATTOOS 9-ZONE WALKTHROUGH WITH SMOOTH NATIVE SCROLL */}
      <main className="relative z-10 w-full overflow-x-hidden pt-20 pb-36">
        
        {/* ZONE 01: STUDIO THRESHOLD / HERO */}
        <section id="entrance" className="min-h-screen flex items-center justify-center px-4 py-12">
          <EntranceZone
            onEnter={() => handleSelectZone('reception')}
            onOpenBooking={() => handleOpenBooking()}
          />
        </section>

        {/* ZONE 02: CONCIERGE & WELCOME RECEPTION */}
        <section id="reception" className="min-h-screen flex items-center justify-center px-4 py-16">
          <ReceptionZone
            onNavigateZone={handleSelectZone}
            onOpenBooking={() => handleOpenBooking()}
          />
        </section>

        {/* ZONE 03: THE LIVING ART GALLERY */}
        <section id="gallery" className="min-h-screen flex items-center justify-center px-4 py-16">
          <GalleryZone
            onSelectPieceForBooking={(artwork) => {
              handleOpenBooking(artwork.artist, artwork.category);
            }}
          />
        </section>

        {/* ZONE 04: MASTER ARTIST ATELIER */}
        <section id="artist-desk" className="min-h-screen flex items-center justify-center px-4 py-16">
          <ArtistDeskZone
            onSelectArtistForBooking={(artistName) => {
              handleOpenBooking(artistName);
            }}
          />
        </section>

        {/* ZONE 05: STERILE TATTOO STATION */}
        <section id="tattoo-station" className="min-h-screen flex items-center justify-center px-4 py-16">
          <TattooStationZone
            onOpenBooking={() => handleOpenBooking()}
          />
        </section>

        {/* ZONE 06: CONCEPT & STENCIL DESIGN TABLE */}
        <section id="design-table" className="min-h-screen flex items-center justify-center px-4 py-16">
          <DesignTableZone
            onOpenBooking={() => handleOpenBooking()}
          />
        </section>

        {/* ZONE 07: BOOKING & CONSULTATION LOUNGE */}
        <section id="booking-area" className="min-h-screen flex items-center justify-center px-4 py-16">
          <BookingAreaZone
            initialArtist={bookingPreset.artist}
            initialStyle={bookingPreset.style}
            onReturnToStudio={() => handleSelectZone('entrance')}
          />
        </section>

        {/* ZONE 08: AFTERCARE & PRESERVATION BAR */}
        <section id="aftercare" className="min-h-screen flex items-center justify-center px-4 py-16">
          <AftercareZone />
        </section>

        {/* ZONE 09: FINAL DEPARTURE & CONNECT */}
        <section id="final-exit" className="min-h-screen flex items-center justify-center px-4 py-16">
          <ExitZone
            onReturnToStart={() => handleSelectZone('entrance')}
            onOpenBooking={() => handleOpenBooking()}
            onOpenAdmin={handleNavigateAdmin}
          />
        </section>

      </main>

      {/* 5. BOTTOM ARCHITECTURAL CONTROLLER HUD */}
      <StudioFloorPlanHUD
        currentZone={currentZone}
        onSelectZone={handleSelectZone}
      />

      {/* 6. MODAL BOOKING DIALOG */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialArtist={bookingPreset.artist}
        initialStyle={bookingPreset.style}
      />

      </div>
    </LanguageProvider>
  );
}

export default App;
