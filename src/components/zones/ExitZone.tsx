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
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-xl bg-black/60 p-1">
          <img
            src={STUDIO_CONTACT.logoUrl}
            alt="Arun Tattoos Official Logo"
            className="w-full h-full object-contain aspect-square"
          />
        </div>
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          ZONE 09 • DEPARTURE & CONNECT
        </span>
        <h2 className="text-3xl md:text-5xl font-cinzel font-black text-white mt-2 mb-3">
          {ez.name}
        </h2>
        <p className="font-cinzel text-lg md:text-xl text-[#d4af37] font-semibold mb-1">
          "CRAFTED IN INK. DEFINED BY YOU."
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
                  <span className="text-white font-medium">{STUDIO_CONTACT.address.fullString}</span>
                  <br />
                  <span className="text-zinc-400 font-mono text-[11px]">{STUDIO_CONTACT.address.landmark}</span>
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
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">{STUDIO_CONTACT.workingHours}</span>
              </div>
            </div>

            {STUDIO_CONTACT.email && (
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
            )}
          </div>

          {/* Socials */}
          {STUDIO_CONTACT.socials?.whatsapp && (
            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-2">
                Official Studio Contact
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={STUDIO_CONTACT.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="px-4 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-2 text-xs font-mono"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Consultation with Arun</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Live Google Maps Embed from official site */}
        <div className="md:col-span-6 rounded-2xl overflow-hidden border border-white/10 min-h-[260px] bg-black">
          <iframe
            title="Arun Tattoos Location Map"
            src="https://maps.google.com/maps?q=Opposite+to+Gravity+Gym+First+Floor&t=m&z=15&output=embed&iwloc=near"
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
            title="Studio Portal Login"
          >
            <Lock className="w-3 h-3" />
            <span>Studio Concierge Portal</span>
          </button>
        </div>
      )}

    </div>
  );
};
