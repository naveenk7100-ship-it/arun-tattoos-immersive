import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../../services/api';

export const AdminAvailabilityView: React.FC = () => {
  const [availabilityRules, setAvailabilityRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [artistId, setArtistId] = useState('nani-kumar');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:30 AM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [status, setStatus] = useState('BLOCKED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAvailabilitySchedule();
      setAvailabilityRules(data);
    } catch (err) {
      console.error('Failed to load availability rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      await api.createAvailabilitySlot({
        artistId,
        date,
        startTime,
        endTime,
        status,
      });
      setMessage('Schedule rule applied successfully.');
      fetchRules();
    } catch (err: any) {
      setMessage(err.message || 'Failed to save rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await api.deleteAvailabilitySlot(id);
      fetchRules();
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
          Atelier Availability & Station Rosters
        </h2>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Configure working hours, blocked dates, rest days, and holiday schedules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Studio Schedule Summary */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Base Operating Hours */}
          <div className="p-6 rounded-3xl subtle-glass border border-white/10 space-y-4">
            <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block">
              STANDARD STUDIO HOURS (VIJAYAWADA)
            </span>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-white font-medium">Monday – Sunday:</span>
                <span className="text-[#ffd885] font-bold">10:30 AM – 9:30 PM IST</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-white font-medium">Nani Kumar (Founder):</span>
                <span className="text-zinc-300">Custom Portrait Sessions (Priority Slotting)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Yeswanth (Resident):</span>
                <span className="text-zinc-300">Realism & Cover-Up Hours (Open Daily)</span>
              </div>
            </div>
          </div>

          {/* Block A Slot Form */}
          <div className="p-6 rounded-3xl subtle-glass border border-white/10 space-y-4">
            <h3 className="text-base font-cinzel font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#d4af37]" />
              <span>Block Off Date / Station Time</span>
            </h3>

            {message && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#ffd885]">
                {message}
              </div>
            )}

            <form onSubmit={handleAddRule} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Artist:</label>
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="nani-kumar">Nani Kumar</option>
                  <option value="yeswanth">Yeswanth</option>
                  <option value="all-studio">Entire Studio (Holiday / Maintenance)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Date:</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:border-[#d4af37] focus:outline-none"
                >
                </input>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">From:</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Until:</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:30 PM">09:30 PM (End of Day)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Reason / Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="BLOCKED">BLOCKED (Station Unavailable)</option>
                  <option value="HOLIDAY">HOLIDAY (Studio Closed)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Sanitization / Upgrades)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold uppercase tracking-wider text-xs font-mono transition-colors disabled:opacity-50"
              >
                Apply Schedule Block
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Active Blocked Rules List */}
        <div className="lg:col-span-6 p-6 rounded-3xl subtle-glass border border-white/10 space-y-4">
          <h3 className="text-base font-cinzel font-bold text-white">Active Blocked & Reserved Rules</h3>
          
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                Loading schedule blocks...
              </div>
            ) : availabilityRules.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                No active schedule blocks. Stations are operating on regular hours.
              </div>
            ) : (
              availabilityRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="text-white font-medium block">
                      {rule.artist_id === 'nani-kumar' ? 'Nani Kumar' : rule.artist_id === 'yeswanth' ? 'Yeswanth' : 'Entire Studio'}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {rule.date} • {rule.start_time} to {rule.end_time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 font-bold uppercase">
                      {rule.status}
                    </span>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Remove Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
