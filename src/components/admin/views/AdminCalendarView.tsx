import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../../../services/api';
import type { BookingRecord } from '../../../types';

interface AdminCalendarViewProps {
  onOpenBooking: (booking: BookingRecord) => void;
}

export const AdminCalendarView: React.FC<AdminCalendarViewProps> = ({ onOpenBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [artistFilter, setArtistFilter] = useState('ALL');
  const [events, setEvents] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Compute month days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const fetchCalendar = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCalendar(undefined, undefined, artistFilter);
      setEvents(res.events);
    } catch (err) {
      console.error('Error fetching calendar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [artistFilter]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format date string YYYY-MM-DD
  const formatCellDate = (dayNumber: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNumber).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
            Studio Schedule & Appointments
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Visual calendar for Arun master station
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <select
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-[#d4af37] focus:outline-none"
          >
            <option value="ALL">All Artists</option>
            <option value="Arun">Arun</option>
          </select>

          <div className="flex rounded-xl subtle-glass border border-white/10 p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'month' ? 'bg-[#d4af37] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                viewMode === 'week' ? 'bg-[#d4af37] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Agenda
            </button>
          </div>

          <button
            onClick={fetchCalendar}
            title="Refresh appointments"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="p-4 rounded-2xl subtle-glass border border-white/10 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl hover:bg-white/10 text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-base font-cinzel font-bold text-white tracking-wider">
          {monthNames[month]} {year}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl hover:bg-white/10 text-zinc-300 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Month Grid View */}
      {viewMode === 'month' ? (
        <div className="rounded-2xl subtle-glass border border-white/10 overflow-hidden shadow-2xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-black/40 text-center text-[10px] font-mono text-zinc-400 uppercase py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/5 text-xs font-mono">
            {/* Blank leading days */}
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[110px] bg-black/20 p-2 opacity-30" />
            ))}

            {/* Days in Month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const dateStr = formatCellDate(dayNum);
              const dayEvents = events.filter((e) => e.preferred_date === dateStr);
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                    isToday ? 'bg-[#d4af37]/5 border-t-2 border-t-[#d4af37]' : 'bg-black/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-bold ${isToday ? 'text-[#ffd885]' : 'text-zinc-400'}`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#d4af37]/20 text-[#ffd885]">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Day Events Pills */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => onOpenBooking(ev)}
                        className={`p-1 rounded text-[9px] truncate cursor-pointer transition-all ${
                          ev.status === 'CONFIRMED'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
                            : ev.status === 'CONSULTATION'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50 hover:bg-amber-900'
                            : 'bg-[#d4af37]/15 text-[#ffd885] border border-[#d4af37]/40 hover:bg-[#d4af37]/30'
                        }`}
                        title={`${ev.preferred_time} - ${ev.customer_name} (${ev.artist})`}
                      >
                        <span className="font-bold">{ev.preferred_time.split(' ')[0]}</span> {ev.customer_name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda View */
        <div className="rounded-2xl subtle-glass border border-white/10 p-6 space-y-4">
          <h4 className="text-sm font-cinzel font-bold text-white">Upcoming Agenda</h4>
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-zinc-500">
                No appointments scheduled.
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onOpenBooking(ev)}
                  className="p-4 rounded-xl bg-black/40 hover:bg-black/60 border border-white/5 hover:border-[#d4af37]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center py-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffd885]">
                      <div className="font-bold text-xs">{ev.preferred_date.split('-')[2]}</div>
                      <div className="text-[9px] uppercase">{monthNames[Number(ev.preferred_date.split('-')[1]) - 1]?.slice(0, 3)}</div>
                    </div>
                    <div>
                      <span className="text-white font-bold block">{ev.customer_name}</span>
                      <span className="text-zinc-400 text-[11px]">{ev.style} • with {ev.artist}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-zinc-300">{ev.preferred_time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.status === 'CONFIRMED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-[#d4af37]/15 text-[#ffd885] border border-[#d4af37]/40'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
