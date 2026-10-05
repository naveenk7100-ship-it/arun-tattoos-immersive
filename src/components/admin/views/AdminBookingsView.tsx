import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw
} from 'lucide-react';
import { api } from '../../../services/api';
import type { BookingRecord } from '../../../types';

interface AdminBookingsViewProps {
  initialStatusFilter?: string;
  onOpenBooking: (booking: BookingRecord) => void;
}

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Statuses' },
  { key: 'NEW', label: 'New Requests' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'CONSULTATION', label: 'In Consultation' },
  { key: 'CONFIRMED', label: 'Confirmed Sessions' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

export const AdminBookingsView: React.FC<AdminBookingsViewProps> = ({
  initialStatusFilter = 'ALL',
  onOpenBooking,
}) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [artistFilter, setArtistFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await api.getBookings({
        status: statusFilter,
        artist: artistFilter,
        search: searchTerm,
      });
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, artistFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
            Consultation & Appointment Queue
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage intake, artist assignments, and session confirmations
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 border border-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl subtle-glass border border-white/10">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
          <input
            type="text"
            placeholder="Search by client, phone, style, or AT-ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:border-[#d4af37] focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Status Filter */}
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-[#d4af37] focus:outline-none"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Artist Filter */}
        <div className="md:col-span-3">
          <select
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-[#d4af37] focus:outline-none"
          >
            <option value="ALL">All Artists</option>
            <option value="Nani Kumar">Nani Kumar</option>
            <option value="Yeswanth">Yeswanth</option>
          </select>
        </div>

      </div>

      {/* Bookings Table / List */}
      <div className="rounded-2xl subtle-glass border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase text-zinc-400">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Artist</th>
                <th className="py-3.5 px-4">Style & Placement</th>
                <th className="py-3.5 px-4">Target Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => onOpenBooking(b)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#ffd885]">
                      {b.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium block">
                        {b.customer_name}
                      </span>
                      {b.reference_image_url && (
                        <span className="text-[10px] text-[#d4af37] flex items-center gap-1 mt-0.5">
                          <span>Photo Attached</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {b.phone}
                    </td>

                    <td className="py-3.5 px-4 text-white">
                      {b.artist}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-zinc-200 block truncate max-w-[180px]">{b.style}</span>
                      <span className="text-[10px] text-zinc-500 block">{b.placement}</span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <div>{b.preferred_date}</div>
                      <div className="text-[10px] text-zinc-500">{b.preferred_time}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60'
                          : b.status === 'CONSULTATION'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-700/60'
                          : b.status === 'NEW'
                          ? 'bg-[#d4af37]/15 text-[#ffd885] border border-[#d4af37]/40'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-950/80 text-blue-400 border border-blue-700/60'
                          : 'bg-white/5 text-zinc-500 border border-white/5'
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBooking(b);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black text-zinc-200 text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
