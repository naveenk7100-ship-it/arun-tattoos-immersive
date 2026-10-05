import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';
import { api } from '../../../services/api';
import type { AdminOverviewMetrics, BookingRecord } from '../../../types';

interface AdminOverviewViewProps {
  onNavigateToBookings: (filterStatus?: string) => void;
  onOpenBooking: (booking: BookingRecord) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  onNavigateToBookings,
  onOpenBooking,
}) => {
  const [metrics, setMetrics] = useState<AdminOverviewMetrics | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [overviewRes, bookingsRes] = await Promise.all([
          api.getOverview(),
          api.getBookings({ limit: 6 } as any),
        ]);
        setMetrics(overviewRes);
        setRecentBookings(bookingsRes);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-mono text-zinc-500 animate-pulse">
        Loading atelier operations summary...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
          Atelier Executive Summary
        </h2>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Real-time operations monitor for Arun Tattoo Studio, Bandar Road
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today New */}
        <div 
          onClick={() => onNavigateToBookings('NEW')}
          className="cursor-pointer p-5 rounded-2xl subtle-glass-gold border border-[#d4af37]/30 hover:border-[#d4af37] transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">TODAY • NEW REQUESTS</span>
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {metrics ? metrics.today.new : '—'}
          </div>
          <p className="text-[11px] text-zinc-400">
            Awaiting concierge review
          </p>
        </div>

        {/* Card 2: Today Consultations */}
        <div 
          onClick={() => onNavigateToBookings('CONSULTATION')}
          className="cursor-pointer p-5 rounded-2xl subtle-glass border border-white/10 hover:border-white/30 transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">TODAY • CONSULTATIONS</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {metrics ? metrics.today.consultations : '—'}
          </div>
          <p className="text-[11px] text-zinc-400">
            In-studio concept drafting
          </p>
        </div>

        {/* Card 3: Today Confirmed */}
        <div 
          onClick={() => onNavigateToBookings('CONFIRMED')}
          className="cursor-pointer p-5 rounded-2xl subtle-glass border border-emerald-500/20 hover:border-emerald-500/50 transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">TODAY • CONFIRMED</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {metrics ? metrics.today.confirmed : '—'}
          </div>
          <p className="text-[11px] text-zinc-400">
            Active needle station sessions
          </p>
        </div>

        {/* Card 4: Total Queue */}
        <div 
          onClick={() => onNavigateToBookings('ALL')}
          className="cursor-pointer p-5 rounded-2xl subtle-glass border border-white/10 hover:border-white/30 transition-all transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">ALL TIME • LOGGED</span>
            <TrendingUp className="w-4 h-4 text-[#ffd885]" />
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {metrics ? metrics.totals.all : '—'}
          </div>
          <p className="text-[11px] text-zinc-400">
            Total studio consultation intake
          </p>
        </div>

      </div>

      {/* Secondary Summary: Artworks & Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Breakdown bar */}
        <div className="lg:col-span-1 p-6 rounded-3xl subtle-glass border border-white/10 space-y-4">
          <h3 className="text-sm font-cinzel font-bold text-white">Pipeline Distribution</h3>
          
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">New Inquiries</span>
              <span className="text-[#ffd885] font-bold">{metrics?.totals.new ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Confirmed Appointments</span>
              <span className="text-emerald-400 font-bold">{metrics?.totals.confirmed ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Completed Works</span>
              <span className="text-blue-400 font-bold">{metrics?.totals.completed ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Cancelled / Postponed</span>
              <span className="text-zinc-500">{metrics?.totals.cancelled ?? 0}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono text-[#d4af37] uppercase block mb-1">PUBLIC GALLERY STATUS</span>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Published Masterpieces:</span>
              <span className="text-white font-bold">{metrics?.artwork.published ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings Queue */}
        <div className="lg:col-span-2 p-6 rounded-3xl subtle-glass border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-cinzel font-bold text-white">Recent Consultation Requests</h3>
              <button
                onClick={() => onNavigateToBookings('ALL')}
                className="text-xs font-mono text-[#ffd885] hover:underline flex items-center gap-1"
              >
                <span>View All Inquiries</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8 text-xs font-mono text-zinc-500">
                  No inquiries logged yet.
                </div>
              ) : (
                recentBookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onOpenBooking(b)}
                    className="p-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-[#d4af37]/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#ffd885]">
                        {b.id}
                      </span>
                      <div>
                        <span className="text-xs text-white font-medium block">
                          {b.customer_name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {b.style} • with {b.artist}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : b.status === 'CONSULTATION'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : b.status === 'NEW'
                          ? 'bg-[#d4af37]/15 text-[#ffd885] border border-[#d4af37]/40'
                          : 'bg-white/5 text-zinc-400'
                      }`}>
                        {b.status}
                      </span>

                      <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                        {b.preferred_date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Vijayawada Studio Daily Hours: 10:30 AM – 9:30 PM</span>
            <span className="text-[#d4af37]">Ready for appointments</span>
          </div>
        </div>

      </div>

    </div>
  );
};
