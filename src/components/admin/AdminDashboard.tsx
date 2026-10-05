import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Clock, 
  Image, 
  MessageSquare, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Menu,
  X
} from 'lucide-react';
import type { AdminUser, BookingRecord } from '../../types';
import { clearStoredAuth } from '../../services/api';
import { AdminOverviewView } from './views/AdminOverviewView';
import { AdminBookingsView } from './views/AdminBookingsView';
import { AdminCalendarView } from './views/AdminCalendarView';
import { AdminAvailabilityView } from './views/AdminAvailabilityView';
import { AdminArtworksView } from './views/AdminArtworksView';
import { AdminTestimonialsView } from './views/AdminTestimonialsView';
import { BookingDetailModal } from './BookingDetailModal';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onBackToStudio: () => void;
}

type AdminTab = 'overview' | 'bookings' | 'calendar' | 'availability' | 'artworks' | 'testimonials';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onBackToStudio,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('ALL');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    clearStoredAuth();
    onLogout();
  };

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Consultations Queue', icon: CalendarIcon },
    { id: 'calendar', label: 'Schedule Calendar', icon: Clock },
    { id: 'availability', label: 'Station Roster', icon: ShieldCheck },
    { id: 'artworks', label: 'Master Portfolio', icon: Image },
    { id: 'testimonials', label: 'Collector Reviews', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col md:flex-row select-none">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0e0e13]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#d4af37]/60 bg-[#121217] flex items-center justify-center">
            <span className="font-cinzel text-xs font-bold text-[#d4af37]">A</span>
          </div>
          <span className="font-cinzel text-sm font-bold text-white tracking-wider">
            ARUN TATTOOS ADMIN
          </span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl subtle-glass text-zinc-300"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0e] border-r border-white/10 flex flex-col justify-between p-5 transform transition-transform duration-300 md:static md:translate-x-0 ${
        isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 select-none pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 bg-[#121217] flex items-center justify-center shadow-lg shadow-black">
              <span className="font-cinzel text-sm font-bold text-[#d4af37]">A</span>
            </div>
            <div>
              <h1 className="font-cinzel text-sm font-bold text-white tracking-wider">
                ARUN TATTOOS
              </h1>
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest block">
                ATELIER CONCIERGE
              </span>
            </div>
          </div>

          {/* User Badge */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <User className="w-4 h-4 text-[#ffd885] shrink-0" />
              <div className="overflow-hidden">
                <span className="text-xs text-white truncate block font-mono">{user.email}</span>
                <span className="text-[9px] font-mono text-zinc-400">Vijayawada Studio</span>
              </div>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              user.role === 'ADMIN' ? 'bg-[#d4af37]/20 text-[#ffd885] border border-[#d4af37]/40' : 'bg-blue-950 text-blue-300'
            }`}>
              {user.role}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left font-mono text-xs flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-[#d4af37]/15 text-[#ffd885] font-bold border border-[#d4af37]/40 shadow-sm shadow-[#d4af37]/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={onBackToStudio}
            className="w-full p-2.5 rounded-xl text-left font-mono text-xs flex items-center gap-2.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Virtual Studio</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full p-2.5 rounded-xl text-left font-mono text-xs flex items-center gap-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <AdminOverviewView
              onNavigateToBookings={(filter) => {
                if (filter) setBookingFilterStatus(filter);
                setActiveTab('bookings');
              }}
              onOpenBooking={(b) => setSelectedBooking(b)}
            />
          )}

          {activeTab === 'bookings' && (
            <AdminBookingsView
              initialStatusFilter={bookingFilterStatus}
              onOpenBooking={(b) => setSelectedBooking(b)}
            />
          )}

          {activeTab === 'calendar' && (
            <AdminCalendarView
              onOpenBooking={(b) => setSelectedBooking(b)}
            />
          )}

          {activeTab === 'availability' && (
            <AdminAvailabilityView />
          )}

          {activeTab === 'artworks' && (
            <AdminArtworksView />
          )}

          {activeTab === 'testimonials' && (
            <AdminTestimonialsView />
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdated={() => {
            // refresh data
            setSelectedBooking(null);
          }}
        />
      )}

    </div>
  );
};
