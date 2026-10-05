import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ArrowLeft, 
  Sparkles,
  Lock
} from 'lucide-react';
import { STUDIO_CONTACT } from '../../data/studioData';
import { useLanguage } from '../../translations/LanguageContext';

interface ExitZoneProps {
  onReturnToStart: () => void;
  onOpenBooking: () => void;
  onOpenAdmin?: () => void;
}

export const ExitZone: React.FC<ExitZoneProps> = ({ onReturnToStart, onOpenBooking, onOpenAdmin }) => {
  const { t, language } = useLanguage();
  const ez = t.zones.finalExit;

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-8 md:py-14 text-center animate-in fade-in duration-500 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          ZONE 09 • DEPARTURE & CONNECT
        </span>
        <h2 className="text-4xl md:text-6xl font-cinzel font-black text-white mt-2 mb-3">
          {ez.name}
        </h2>
        <p className="font-cinzel text-lg md:text-xl text-[#d4af37] font-semibold mb-1">
          "INK YOUR STORY."
        </p>
        <p className="text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase mb-4">
          PRECISION. ARTISTRY. IDENTITY.
        </p>
        <p className="text-xs md:text-sm text-zinc-300 font-sans">
          {ez.desc}
        </p>
      </div>

      {/* Main Studio Information & Maps Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 subtle-glass p-6 md:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl mb-10 text-left">
        
        {/* Address & Direct Channels */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider">
                  {ez.coordinatesTitle}
                </h4>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {STUDIO_CONTACT.address.doorNo}, {STUDIO_CONTACT.address.colony},
                  <br />{STUDIO_CONTACT.address.landmark}, {STUDIO_CONTACT.address.opposite},
                  <br /><span className="text-white font-medium">{STUDIO_CONTACT.address.road}, {STUDIO_CONTACT.address.city} - {STUDIO_CONTACT.address.pincode}</span>,
                  <br />Andhra Pradesh, India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white shrink-0 mt-0.5">
                <Phone className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider">
                  {ez.directLine}
                </h4>
                <div className="flex flex-col gap-1 mt-1">
                  <a
                    href={`tel:${STUDIO_CONTACT.phone}`}
                    className="text-xs font-mono text-[#ffd885] hover:underline block"
                  >
                    {STUDIO_CONTACT.formattedPhone}
                  </a>
                  {STUDIO_CONTACT.formattedSecondaryPhone && (
                    <a
                      href={`tel:${STUDIO_CONTACT.secondaryPhone}`}
                      className="text-xs font-mono text-zinc-300 hover:text-white hover:underline block"
                    >
                      {STUDIO_CONTACT.formattedSecondaryPhone} <span className="text-[10px] text-zinc-500">(Direct Studio Line)</span>
                    </a>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">Available 10:30 AM – 9:30 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white shrink-0 mt-0.5">
                <Mail className="w-5 h-5 text-[#d4af37]" />
              </div>
              <div>
                <h4 className="text-sm font-cinzel font-bold text-white uppercase tracking-wider">
                  {ez.officialEmail}
                </h4>
                <a
                  href={`mailto:${STUDIO_CONTACT.email}`}
                  className="text-xs font-mono text-zinc-300 hover:text-white mt-1 block"
                >
                  {STUDIO_CONTACT.email}
                </a>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-2">
              Official Studio Channels
            </span>
            <div className="flex items-center gap-2">
              {/* Instagram */}
              <a
                href={STUDIO_CONTACT.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-black/40 hover:bg-pink-900/30 text-zinc-300 hover:text-pink-400 border border-white/5 hover:border-pink-500/30 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={STUDIO_CONTACT.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-xl bg-black/40 hover:bg-blue-900/30 text-zinc-300 hover:text-blue-400 border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.582 9 4.615V8z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={STUDIO_CONTACT.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2.5 rounded-xl bg-black/40 hover:bg-red-900/30 text-zinc-300 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={STUDIO_CONTACT.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-xl bg-black/40 hover:bg-emerald-900/30 text-zinc-300 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Google Maps Embed from official site */}
        <div className="md:col-span-6 rounded-2xl overflow-hidden border border-white/10 min-h-[260px] bg-black">
          <iframe
            title="Arun Tattoo Studio Location Map"
            src="https://maps.google.com/maps?q=arun%20tattoo%20studio%20vijayawada&t=m&z=14&output=embed&iwloc=near"
            className="w-full h-full min-h-[280px] border-0 filter invert contrast-125 opacity-80 hover:opacity-100 transition-opacity"
            loading="lazy"
          />
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onReturnToStart}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full subtle-glass text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{ez.walkthroughAgain}</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#e5c158] hover:to-[#c5a059] text-black font-bold uppercase tracking-widest text-xs font-mono shadow-xl shadow-[#d4af37]/25 transition-all"
        >
          {ez.reserveNow}
        </button>
      </div>

      {/* Staff Concierge Access */}
      {onOpenAdmin && (
        <div className="mt-12 pt-6 border-t border-white/5">
          <button
            onClick={onOpenAdmin}
            className="text-[11px] font-mono text-zinc-600 hover:text-[#d4af37] transition-colors inline-flex items-center gap-1.5"
            title="Studio Team Portal Login"
          >
            <Lock className="w-3 h-3" />
            <span>Studio Staff Concierge Portal</span>
          </button>
        </div>
      )}

    </div>
  );
};
