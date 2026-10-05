import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Save, 
  ExternalLink,
  FileText
} from 'lucide-react';
import type { BookingRecord, BookingStatus } from '../../types';
import { api } from '../../services/api';

interface BookingDetailModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_FLOW: BookingStatus[] = [
  'NEW',
  'CONTACTED',
  'CONSULTATION',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
];

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onUpdated,
}) => {
  if (!booking) return null;

  const [notes, setNotes] = useState(booking.notes || '');
  const [selectedArtist, setSelectedArtist] = useState(booking.artist);
  const [isSaving, setIsSaving] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setConflictError(null);
    setIsSaving(true);
    try {
      await api.updateBookingStatus(booking.id, newStatus, notes);
      onUpdated();
    } catch (err: any) {
      setConflictError(err.message || 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDetails = async () => {
    setConflictError(null);
    setIsSaving(true);
    try {
      await api.updateBooking(booking.id, {
        notes,
        artist: selectedArtist,
      });
      onUpdated();
    } catch (err: any) {
      setConflictError(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello ${booking.customer_name},\n\nThis is regarding your tattoo consultation request (${booking.id}) with ${booking.artist} at Arun Tattoo Studio, Vijayawada.\n\nWe are reviewing your design for ${booking.style} (${booking.placement}). When is a convenient time for an anatomical concept discussion?`
    );
    const cleanPhone = booking.phone.replace(/[\s\-\(\)\+]/g, '');
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0e0e13] border border-white/15 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-left">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd885] font-bold">
              {booking.id}
            </span>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-white">
                {booking.customer_name}
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">
                Logged {new Date(booking.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Double-booking conflict / validation alert */}
          {conflictError && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Scheduling Conflict Detected</span>
                <span>{conflictError}</span>
              </div>
            </div>
          )}

          {/* Quick Client Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${booking.phone}`}
              className="py-2.5 px-4 rounded-xl subtle-glass hover:bg-white/10 text-xs font-mono flex items-center justify-center gap-2 text-white border border-white/15 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>Call Client: {booking.phone}</span>
            </a>

            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>

          {/* Status Workflow Ribbon */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              APPOINTMENT STATUS WORKFLOW
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STATUS_FLOW.map((st) => {
                const isActive = booking.status === st;
                return (
                  <button
                    key={st}
                    disabled={isSaving}
                    onClick={() => {
                      if (st === 'CANCELLED') {
                        setShowCancelConfirm(true);
                      } else {
                        handleStatusChange(st);
                      }
                    }}
                    className={`py-2 px-1.5 rounded-xl text-center font-mono text-[10px] uppercase font-bold transition-all ${
                      isActive
                        ? st === 'CONFIRMED'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                          : st === 'CANCELLED'
                          ? 'bg-rose-600 text-white shadow-lg'
                          : 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] block">
                PROJECT SPECIFICATIONS
              </span>
              <div>
                <span className="text-zinc-500">Style: </span>
                <span className="text-white font-medium">{booking.style}</span>
              </div>
              <div>
                <span className="text-zinc-500">Placement: </span>
                <span className="text-white font-medium">{booking.placement}</span>
              </div>
              <div>
                <span className="text-zinc-500">Size: </span>
                <span className="text-white font-medium">{booking.size}</span>
              </div>
              <div>
                <span className="text-zinc-500">Target Slot: </span>
                <span className="text-[#ffd885] font-bold">{booking.preferred_date} @ {booking.preferred_time}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] block">
                ARTIST ASSIGNMENT
              </span>
              <div>
                <label className="text-zinc-500 block mb-1">Assigned Tattoo Artist:</label>
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/15 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Nani Kumar">Nani Kumar (Founder • Portrait & Micro Art)</option>
                  <option value="Yeswanth">Yeswanth (Resident • Realism & Cover-ups)</option>
                  <option value="First Available Artist">First Available Artist</option>
                </select>
              </div>
              <div className="pt-1">
                <span className="text-zinc-500">Email: </span>
                <span className="text-white">{booking.email || 'None provided'}</span>
              </div>
            </div>
          </div>

          {/* Description & Reference Photo */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-[#d4af37] block font-mono">
              CLIENT CONCEPT NARRATIVE
            </span>
            <p className="text-xs text-zinc-200 leading-relaxed font-sans">
              {booking.description || 'No narrative provided by client.'}
            </p>

            {booking.reference_image_url && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block mb-2">
                  ATTACHED REFERENCE PHOTO
                </span>
                <div 
                  onClick={() => setShowImageLightbox(true)}
                  className="relative group cursor-pointer inline-block rounded-xl overflow-hidden border border-white/20 max-w-xs"
                >
                  <img
                    src={booking.reference_image_url}
                    alt="Client Reference"
                    className="w-48 h-36 object-cover filter brightness-90 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-mono gap-1">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Enlarge</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Internal Notes (Admin/Artist Only - NEVER public) */}
          <div className="p-4 rounded-xl bg-black/50 border border-[#d4af37]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>PRIVATE INTERNAL STUDIO NOTES (CONFIDENTIAL)</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-500">Only visible to studio team</span>
            </div>
            
            <textarea
              rows={3}
              placeholder="Record needle configuration, skin tone assessment, stencil calibration, or payment notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/15 text-xs text-zinc-200 focus:border-[#d4af37] focus:outline-none resize-none font-mono"
            />

            <div className="flex justify-end pt-1">
              <button
                disabled={isSaving}
                onClick={handleSaveDetails}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes & Assignment</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal for Reference Image */}
      {showImageLightbox && booking.reference_image_url && (
        <div 
          onClick={() => setShowImageLightbox(false)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <img
            src={booking.reference_image_url}
            alt="Reference Full View"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Confirmation Dialog for Destructive Cancel */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121217] p-6 rounded-2xl border border-rose-500/40 max-w-sm w-full text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="text-base font-cinzel font-bold text-white">Cancel Appointment?</h4>
            <p className="text-xs text-zinc-300">
              Are you sure you want to mark booking <span className="font-mono text-white font-bold">{booking.id}</span> as CANCELLED?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-mono text-zinc-300"
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  handleStatusChange('CANCELLED');
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-mono text-white font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
