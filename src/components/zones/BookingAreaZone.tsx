import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck, 
  Send,
  Upload,
  X,
  Clock,
  Phone,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { STUDIO_CONTACT, STUDIO_PILLARS } from '../../data/studioData';
import type { BookingSubmission } from '../../types';
import { useLanguage } from '../../translations/LanguageContext';
import { api, type BookingResponse } from '../../services/api';

interface BookingAreaZoneProps {
  initialArtist?: string;
  initialStyle?: string;
  onReturnToStudio?: () => void;
}

export const BookingAreaZone: React.FC<BookingAreaZoneProps> = ({
  initialArtist = '',
  initialStyle = '',
  onReturnToStudio,
}) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<BookingSubmission>({
    fullName: '',
    phone: '',
    email: '',
    preferredArtist: initialArtist || 'Arun',
    style: initialStyle || 'Custom Portrait Art',
    placement: 'Forearm / Inner Arm',
    size: 'Medium (4–6 inches)',
    description: '',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow by default
    preferredTime: '12:00 PM',
    agreeToConsultation: true,
    honeypot: '',
  });

  // Reference Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Available Time Slots State
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([
    { time: '10:30 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '06:00 PM', available: true },
    { time: '08:00 PM', available: true },
  ]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Update form if initial props change
  useEffect(() => {
    if (initialArtist) {
      setFormData((prev) => ({ ...prev, preferredArtist: initialArtist }));
    }
    if (initialStyle) {
      setFormData((prev) => ({ ...prev, style: initialStyle }));
    }
  }, [initialArtist, initialStyle]);

  // Fetch available slots when artist or preferredDate changes
  useEffect(() => {
    let isMounted = true;
    async function fetchSlots() {
      if (!formData.preferredDate) return;
      setLoadingSlots(true);
      try {
        const res = await api.getAvailability(formData.preferredArtist, formData.preferredDate);
        if (isMounted && res.slots && res.slots.length > 0) {
          setTimeSlots(res.slots);
          // If current selected time slot is now unavailable, switch to first available
          const currentIsAvailable = res.slots.find((s) => s.time === formData.preferredTime)?.available;
          if (!currentIsAvailable) {
            const firstAvail = res.slots.find((s) => s.available);
            if (firstAvail) {
              setFormData((prev) => ({ ...prev, preferredTime: firstAvail.time }));
            }
          }
        }
      } catch (err) {
        // Fallback to default slots if backend offline
        console.warn('Could not query slots, using standard schedule:', err);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [formData.preferredArtist, formData.preferredDate]);

  // Image Upload Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors((prev) => ({
        ...prev,
        image: 'File size must be under 5 MB.',
      }));
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setValidationErrors((prev) => ({
        ...prev,
        image: 'Only JPG, PNG, and WebP images are allowed.',
      }));
      return;
    }

    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Name must be at least 2 characters.';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    const indianPhoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone number is required.';
    } else if (!indianPhoneRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number (+91).';
    }

    if (!formData.preferredDate) {
      errors.preferredDate = 'Please select a consultation date.';
    } else {
      const selected = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.preferredDate = 'Preferred date cannot be in the past.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData: BookingSubmission = {
        ...formData,
        referenceImage: imageFile,
      };

      const result = await api.submitBooking(submissionData);
      setSubmittedBooking(result);

      // Confetti celebration
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#ffd67a', '#ffffff'],
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setServerError(
        err.message || 'We could not submit your consultation request right now. Please call or WhatsApp us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    const bookingIdStr = submittedBooking?.bookingId ? `Booking ID: ${submittedBooking.bookingId}\n` : '';
    const text = encodeURIComponent(
      `Hello Arun Tattoo Studio,\n\nI have submitted a tattoo consultation request.\n${bookingIdStr}\nName: ${formData.fullName}\nPhone: ${formData.phone}\nArtist: ${formData.preferredArtist}\nStyle: ${formData.style}\nPlacement: ${formData.placement}\nApprox Size: ${formData.size}\nTarget Date: ${formData.preferredDate} (${formData.preferredTime})\n\nConcept Notes: ${formData.description || 'Discuss during consultation'}`
    );
    return `https://wa.me/919505760918?text=${text}`;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {t.zones.bookingArea.code} • {t.zones.bookingArea.subhead}
        </span>
        <h2 className={`text-3xl md:text-5xl font-bold text-white mt-1 mb-3 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
          {t.zones.bookingArea.name}
        </h2>
        <p className={`text-xs md:text-sm text-zinc-300 ${language === 'te' ? 'font-telugu' : 'font-sans'}`}>
          {t.zones.bookingArea.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Booking Form or Confirmation */}
        <div className="lg:col-span-7 subtle-glass p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          
          {submittedBooking ? (
            /* ========================================================
               PREMIUM CONFIRMATION STATE (REQUEST RECEIVED)
               ======================================================== */
            <div className="py-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto mb-4 text-[#d4af37] shadow-xl shadow-[#d4af37]/20">
                <CheckCircle className="w-8 h-8" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd885] font-mono text-xs font-semibold uppercase tracking-widest mb-3">
                CONSULTATION REQUEST RECEIVED
              </span>

              <h3 className={`text-2xl md:text-3xl font-bold text-white mb-2 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
                Booking Ref: <span className="text-[#ffd885] font-mono tracking-wider">{submittedBooking.bookingId}</span>
              </h3>
              
              <p className="text-xs md:text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
                Thank you, <span className="text-white font-semibold">{formData.fullName}</span>. Your consultation inquiry has been logged in our Vijayawada studio queue for <span className="text-[#ffd885]">{formData.preferredArtist}</span>. Our concierge will review your placement and design notes before confirming your session slot.
              </p>

              {/* Submitted Details Matrix */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-left text-xs font-mono mb-6 max-w-md mx-auto space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400">Request ID:</span>
                  <span className="text-[#ffd885] font-bold">{submittedBooking.bookingId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400">Artist:</span>
                  <span className="text-white font-medium">{formData.preferredArtist}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400">Art Style:</span>
                  <span className="text-[#ffd885]">{formData.style}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400">Target Slot:</span>
                  <span className="text-white">{formData.preferredDate} @ {formData.preferredTime}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-zinc-400">Anatomy:</span>
                  <span className="text-white">{formData.placement} ({formData.size})</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-zinc-400">Studio Location:</span>
                  <span className="text-[#d4af37]">Bandar Road, Vijayawada</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/30"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>

                <a
                  href={`tel:${STUDIO_CONTACT.phone}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full subtle-glass hover:bg-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 border border-white/15 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <span>Call {STUDIO_CONTACT.formattedPhone}</span>
                </a>

                {onReturnToStudio && (
                  <button
                    onClick={onReturnToStudio}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Return to Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="mt-6 text-[11px] text-zinc-500 font-mono">
                Need to submit another project?{' '}
                <button
                  onClick={() => setSubmittedBooking(null)}
                  className="text-[#d4af37] underline hover:text-white"
                >
                  New Request
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================
               INTERACTIVE BOOKING FORM WITH VALIDATION & UPLOAD
               ======================================================== */
            <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
              
              {/* Server Failure / Offline Banner */}
              {serverError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{serverError}</p>
                    <p className="text-[11px] text-red-300">
                      You can instantly connect via direct line:{' '}
                      <a href={`tel:${STUDIO_CONTACT.phone}`} className="underline font-bold text-white">
                        {STUDIO_CONTACT.formattedPhone}
                      </a>{' '}
                      or{' '}
                      <a href={generateWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="underline font-bold text-emerald-300">
                        WhatsApp Concierge
                      </a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Anti-Spam Honeypot Field (Invisible to human users) */}
              <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden">
                <label htmlFor="website-trap">Website</label>
                <input
                  id="website-trap"
                  type="text"
                  name="honeypot"
                  value={formData.honeypot || ''}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Row 1: Artist & Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.preferredArtist} *
                  </label>
                  <select
                    value={formData.preferredArtist}
                    onChange={(e) => setFormData({ ...formData, preferredArtist: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Arun">Arun (Owner & Master Artist)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.tattooStyle} *
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Custom Portrait Art">Custom Portrait Art</option>
                    <option value="Micro Realism / Single Needle">Micro Realism / Single Needle</option>
                    <option value="Fine Line & Minimalist Script">Fine Line & Minimalist Script</option>
                    <option value="Sacred & Monumental Full Back">Sacred & Monumental Full Back</option>
                    <option value="Cover-up & Scar Camouflage">Cover-up & Scar Camouflage</option>
                    <option value="Black & Grey Realism">Black & Grey Realism</option>
                    <option value="Color Realism">Color Realism</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Placement & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.placement}
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Forearm / Inner Arm">Forearm / Inner Arm</option>
                    <option value="Upper Arm / Shoulder / Bicep">Upper Arm / Shoulder / Bicep</option>
                    <option value="Wrist / Hand / Finger">Wrist / Hand / Finger</option>
                    <option value="Full Back / Spine">Full Back / Spine</option>
                    <option value="Chest / Collarbone">Chest / Collarbone</option>
                    <option value="Rib Cage / Torso">Rib Cage / Torso</option>
                    <option value="Calf / Leg">Calf / Leg</option>
                    <option value="Other / Multiple Locations">Other / Multiple Locations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.approxSize}
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Small (1–3 inches)">Small (1–3 inches)</option>
                    <option value="Medium (4–6 inches)">Medium (4–6 inches)</option>
                    <option value="Large (7–10 inches)">Large (7–10 inches)</option>
                    <option value="Half Sleeve">Half Sleeve</option>
                    <option value="Full Sleeve">Full Sleeve</option>
                    <option value="Full Backpiece">Full Backpiece</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Varma"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (validationErrors.fullName) {
                        setValidationErrors((prev) => {
                          const c = { ...prev };
                          delete c.fullName;
                          return c;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-zinc-600 focus:outline-none ${
                      validationErrors.fullName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                  />
                  {validationErrors.fullName && (
                    <span className="text-[10px] text-red-400 mt-1 block">{validationErrors.fullName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (validationErrors.phone) {
                        setValidationErrors((prev) => {
                          const c = { ...prev };
                          delete c.phone;
                          return c;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-zinc-600 focus:outline-none ${
                      validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                  />
                  {validationErrors.phone && (
                    <span className="text-[10px] text-red-400 mt-1 block">{validationErrors.phone}</span>
                  )}
                </div>
              </div>

              {/* Row 4: Email & Preferred Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.email}
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    {t.zones.bookingArea.preferredDate} *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredDate: e.target.value });
                      if (validationErrors.preferredDate) {
                        setValidationErrors((prev) => {
                          const c = { ...prev };
                          delete c.preferredDate;
                          return c;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-xs text-white focus:outline-none ${
                      validationErrors.preferredDate ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                  />
                  {validationErrors.preferredDate && (
                    <span className="text-[10px] text-red-400 mt-1 block">{validationErrors.preferredDate}</span>
                  )}
                </div>
              </div>

              {/* Row 5: Time Slots Selection (Real Public Availability Check) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Preferred Consultation Slot</span>
                  </label>
                  {loadingSlots && (
                    <span className="text-[10px] font-mono text-[#ffd885] flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Checking studio schedule...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = formData.preferredTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setFormData({ ...formData, preferredTime: slot.time })}
                        className={`py-2 px-2 rounded-xl text-center font-mono text-xs transition-all ${
                          !slot.available
                            ? 'bg-white/5 border border-white/5 text-zinc-600 line-through cursor-not-allowed flex items-center justify-center gap-1'
                            : isSelected
                            ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/25'
                            : 'bg-black/30 border border-white/10 text-zinc-300 hover:border-white/30 hover:bg-white/5'
                        }`}
                        title={slot.available ? `Select ${slot.time}` : 'Slot already booked'}
                      >
                        {!slot.available && <Lock className="w-2.5 h-2.5" />}
                        <span>{slot.time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Concept Description */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  {t.zones.bookingArea.conceptNotes}
                </label>
                <textarea
                  rows={2}
                  maxLength={1000}
                  placeholder="Share your story, emotional significance, or details if this is a cover-up..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              {/* Row 7: Reference Image Upload (JPG, PNG, WebP <= 5MB) */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Attach Concept / Reference Photo (Optional, Max 5MB)</span>
                </label>

                {imagePreview ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-[#d4af37]/40">
                    <img
                      src={imagePreview}
                      alt="Reference preview"
                      className="w-14 h-14 rounded-lg object-cover border border-white/15"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs text-white truncate font-medium">{imageFile?.name}</div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : '0'} MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer p-4 rounded-xl border border-dashed border-white/15 hover:border-[#d4af37]/60 hover:bg-white/5 transition-all text-center flex flex-col items-center justify-center gap-1 group"
                  >
                    <Upload className="w-5 h-5 text-zinc-400 group-hover:text-[#d4af37] transition-colors" />
                    <span className="text-xs text-zinc-300 font-medium">
                      Click to upload sketch or photo reference
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Supports JPG, PNG, WebP up to 5MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}
                {validationErrors.image && (
                  <span className="text-[10px] text-red-400 mt-1 block">{validationErrors.image}</span>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#e5c158] hover:to-[#c5a059] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/20 transition-all transform active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Processing Consultation Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.zones.bookingArea.submitBtn}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Single-use sterile protocols. No advance fee required for initial consultation.</span>
              </div>

            </form>
          )}

        </div>

        {/* Right Column: Studio Contact & Live Testimonial Carousel */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Direct Desk Hotline */}
          <div className="subtle-glass p-6 rounded-3xl border border-white/10 shadow-xl">
            <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider block mb-1">
              CONCIERGE HOTLINE
            </span>
            <h4 className={`text-lg font-bold text-white mb-2 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
              {t.zones.bookingArea.directDeskHotline}
            </h4>
            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Prefer speaking with master artist Arun directly? Call or WhatsApp our studio desk.
            </p>

            <a
              href={`tel:${STUDIO_CONTACT.phone}`}
              className="inline-flex items-center gap-2 text-sm font-mono text-[#ffd885] hover:underline"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>{STUDIO_CONTACT.formattedPhone}</span>
            </a>
          </div>

          {/* Authentic Studio Standards & Philosophy */}
          <div className="subtle-glass p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-wider">
                STUDIO PILLARS & STANDARDS
              </span>
              <div className="flex items-center gap-1">
                {STUDIO_PILLARS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveReviewIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeReviewIdx ? 'w-5 bg-[#d4af37]' : 'bg-white/20'
                    }`}
                    aria-label={`View pillar ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {STUDIO_PILLARS[activeReviewIdx] && (
              <div className="space-y-2.5 animate-in fade-in duration-300">
                <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-wider block">
                  {STUDIO_PILLARS[activeReviewIdx].subtitle}
                </span>

                <h4 className="text-sm font-bold text-white font-cinzel">
                  {STUDIO_PILLARS[activeReviewIdx].title}
                </h4>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {STUDIO_PILLARS[activeReviewIdx].description}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>ARUN TATTOOS</span>
                  <span className="text-[#ffd885]">MASTER ARTISTRY</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
