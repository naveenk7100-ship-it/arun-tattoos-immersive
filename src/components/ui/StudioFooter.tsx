import { 
  MapPin, 
  Phone, 
  ArrowUp, 
  MessageSquare 
} from 'lucide-react';
import { STUDIO_CONTACT } from '../../data/studioData';
import { useLanguage } from '../../translations/LanguageContext';

interface StudioFooterProps {
  onScrollToTop: () => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({ onScrollToTop }) => {
  const { language } = useLanguage();

  return (
    <footer className={`w-full border-t border-white/10 bg-[#070709] py-8 px-4 sm:px-8 lg:px-12 select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Studio Location Coordinates */}
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#d4af37] shrink-0 bg-white/5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-sans font-bold text-white tracking-wider block uppercase">
              {STUDIO_CONTACT.address.fullString}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 block">
              Landmark: {STUDIO_CONTACT.address.landmark}
            </span>
          </div>
        </div>

        {/* Center-Left: Direct Phone */}
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-[#d4af37]" />
          <a
            href={`tel:${STUDIO_CONTACT.phone}`}
            className="text-xs font-mono text-zinc-300 hover:text-white hover:underline transition-colors"
          >
            {STUDIO_CONTACT.formattedPhone}
          </a>
        </div>

        {/* Center: Social Channels */}
        <div className="flex items-center gap-3">
          <a
            href={STUDIO_CONTACT.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://instagram.com/arun_tattoos"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <span className="text-[11px] font-sans text-zinc-400">
            Follow us @arun_tattoos
          </span>
        </div>

        {/* Right: Signature & Scroll to Top */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="font-script text-2xl text-white leading-none">
              Arun Tattoos
            </div>
            <span className="text-[9px] font-sans tracking-[0.25em] text-zinc-500 uppercase mt-0.5 block">
              CRAFTED IN INK. DEFINED BY YOU.
            </span>
          </div>

          <button
            onClick={onScrollToTop}
            aria-label="Scroll to top"
            className="w-9 h-9 rounded-full border border-white/20 hover:border-[#d4af37] flex items-center justify-center text-zinc-400 hover:text-white transition-all bg-white/5 active:scale-95"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4 text-zinc-300" />
          </button>
        </div>

      </div>
    </footer>
  );
};
