import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
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

  // Wheel & touch scroll debounce lock
  const scrollLockRef = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

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

  const handleSelectZone = useCallback((zoneId: StudioZoneId) => {
    setCurrentZoneId(zoneId);
  }, []);

  const handleOpenBooking = useCallback((artist?: string, style?: string) => {
    setBookingPreset({ artist, style });
    setIsBookingOpen(true);
  }, []);

  // 1. KEYBOARD NAVIGATION & ADMIN SHORTCUT
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
        studioAudio.playZoneTransitionChime();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentZone.index - 1 + STUDIO_ZONES.length) % STUDIO_ZONES.length;
        handleSelectZone(STUDIO_ZONES[prevIdx].id);
        studioAudio.playZoneTransitionChime();
      } else if (e.key === 'Escape') {
        setIsBookingOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentZone.index, handleSelectZone]);

  // 2. SCROLL-DRIVEN JOURNEY (Mouse Wheel with debounced zone steps)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if inside modal or typing in forms
      if (isBookingOpen) return;
      const target = e.target as HTMLElement;
      if (
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('.overflow-y-auto')
      ) {
        return;
      }

      // Check scroll threshold
      if (Math.abs(e.deltaY) < 45 || scrollLockRef.current) return;

      scrollLockRef.current = true;

      if (e.deltaY > 0) {
        // Scroll Down -> Move Deeper into Studio
        const nextIdx = (currentZone.index + 1) % STUDIO_ZONES.length;
        handleSelectZone(STUDIO_ZONES[nextIdx].id);
        studioAudio.playZoneTransitionChime();
      } else {
        // Scroll Up -> Move Backward
        const prevIdx = (currentZone.index - 1 + STUDIO_ZONES.length) % STUDIO_ZONES.length;
        handleSelectZone(STUDIO_ZONES[prevIdx].id);
        studioAudio.playZoneTransitionChime();
      }

      setTimeout(() => {
        scrollLockRef.current = false;
      }, 650);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentZone.index, handleSelectZone, isBookingOpen]);

  // 3. TOUCH SWIPE GESTURES FOR MOBILE (Dual-axis swipe support)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isBookingOpen || scrollLockRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest('.overflow-y-auto') || target.closest('input') || target.closest('textarea')) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY.current - touchEndY;
      const diffX = touchStartX.current - touchEndX;

      const isHorizontal = Math.abs(diffX) > Math.abs(diffY);
      const primaryDelta = isHorizontal ? diffX : diffY;

      // Swipe threshold: 60px
      if (Math.abs(primaryDelta) > 60) {
        scrollLockRef.current = true;
        if (primaryDelta > 0) {
          // Swipe up / swipe left -> advance deeper
          const nextIdx = (currentZone.index + 1) % STUDIO_ZONES.length;
          handleSelectZone(STUDIO_ZONES[nextIdx].id);
          studioAudio.playZoneTransitionChime();
        } else {
          // Swipe down / swipe right -> step back
          const prevIdx = (currentZone.index - 1 + STUDIO_ZONES.length) % STUDIO_ZONES.length;
          handleSelectZone(STUDIO_ZONES[prevIdx].id);
          studioAudio.playZoneTransitionChime();
        }
        setTimeout(() => {
          scrollLockRef.current = false;
        }, 650);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentZone.index, handleSelectZone, isBookingOpen]);

  // Hotspot interaction router
  const handleHotspotAction = (targetZoneId: StudioZoneId) => {
    studioAudio.playZoneTransitionChime();
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
      <div className="relative min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-between overflow-x-hidden select-none">
      
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

      {/* 4. CENTER DYNAMIC ZONE EXPERIENCE CONTENT */}
      <main className="relative z-10 pt-24 pb-32 flex-1 flex items-center justify-center">
        {currentZoneId === 'entrance' && (
          <EntranceZone
            onEnter={() => handleSelectZone('reception')}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentZoneId === 'reception' && (
          <ReceptionZone
            onNavigateZone={handleSelectZone}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentZoneId === 'gallery' && (
          <GalleryZone
            onSelectPieceForBooking={(artwork) => {
              handleOpenBooking(artwork.artist, artwork.category);
            }}
          />
        )}

        {currentZoneId === 'artist-desk' && (
          <ArtistDeskZone
            onSelectArtistForBooking={(artistName) => {
              handleOpenBooking(artistName);
            }}
          />
        )}

        {currentZoneId === 'tattoo-station' && (
          <TattooStationZone
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentZoneId === 'design-table' && (
          <DesignTableZone
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentZoneId === 'booking-area' && (
          <BookingAreaZone
            initialArtist={bookingPreset.artist}
            initialStyle={bookingPreset.style}
            onReturnToStudio={() => handleSelectZone('entrance')}
          />
        )}

        {currentZoneId === 'aftercare' && (
          <AftercareZone />
        )}

        {currentZoneId === 'final-exit' && (
          <ExitZone
            onReturnToStart={() => handleSelectZone('entrance')}
            onOpenBooking={() => handleOpenBooking()}
            onOpenAdmin={handleNavigateAdmin}
          />
        )}
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
