import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  PenTool, 
  Layers, 
  ShieldCheck, 
  HeartHandshake, 
  Flame
} from 'lucide-react';
import { assetUrl } from '../../utils/assetUrl';
import { useLanguage } from '../../translations/LanguageContext';
import { studioAudio } from '../../utils/audio';

interface ReferenceEditorialGridProps {
  onOpenBooking: (service?: string) => void;
  onViewAllServices: () => void;
  onLearnJourney: () => void;
}

export const ReferenceEditorialGrid: React.FC<ReferenceEditorialGridProps> = ({
  onOpenBooking,
  onViewAllServices,
  onLearnJourney,
}) => {
  const { language } = useLanguage();

  // Quick booking mini-form state
  const [selectedService, setSelectedService] = useState('Custom Tattoos');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Afternoon');

  const services = [
    {
      title: 'Realism',
      teluguTitle: 'రియలిజం పోర్ట్రెయిట్',
      style: 'Lifelike Shading',
      image: assetUrl('/images/gallery/realism-portrait-tribute.png'),
    },
    {
      title: 'Black & Grey',
      teluguTitle: 'బ్లాక్ & గ్రే',
      style: 'Shiva & Devotional',
      image: assetUrl('/images/gallery/shiva-mahakal-trishul.png'),
    },
    {
      title: 'Fine Line',
      teluguTitle: 'ఫైన్ లైన్',
      style: 'Geometric Band',
      image: assetUrl('/images/gallery/compass-geometric-band.png'),
    },
    {
      title: 'Sacred Art',
      teluguTitle: 'సేక్రెడ్ బ్యాక్‌పీస్',
      style: 'Kali Goddess Piece',
      image: assetUrl('/images/gallery/kali-goddess-backpiece.jpg'),
    },
    {
      title: 'Studio Craft',
      teluguTitle: 'స్టూడియో ఆర్టిస్ట్రీ',
      style: 'Sterile Execution',
      image: assetUrl('/images/gallery/arun-studio-session.png'),
    },
    {
      title: 'Custom Concepts',
      teluguTitle: 'కస్టమ్ కాన్సెప్ట్స్',
      style: 'Bespoke Stencil',
      isBadge: true,
    },
  ];

  const journeySteps = [
    {
      num: '01',
      title: 'IDEA',
      teluguTitle: 'ఐడియా & కథ',
      desc: 'Bring your personal narrative, memories, or visual reference.',
      teluguDesc: 'మీ వ్యక్తిగత కథ లేదా ఆలోచనను తీసుకురండి.',
      icon: <Sparkles className="w-4 h-4 text-[#d4af37]" />,
    },
    {
      num: '02',
      title: 'DESIGN',
      teluguTitle: 'డిజైన్ రచన',
      desc: 'Arun drafts original sketches calibrated to your body flow.',
      teluguDesc: 'అరుణ్ డిజిటల్ స్కెచింగ్ ద్వారా ప్రత్యేక డిజైన్ రూపొందిస్తారు.',
      icon: <PenTool className="w-4 h-4 text-[#ffd885]" />,
    },
    {
      num: '03',
      title: 'CONSULTATION',
      teluguTitle: 'కన్సల్టేషన్ & సైజింగ్',
      desc: 'Sizing test, anatomical placement, and thermal stencil test.',
      teluguDesc: 'శరీర భాగానికి తగినట్లు సైజింగ్ మరియు ప్లేస్‌మెంట్ పరీక్ష.',
      icon: <Layers className="w-4 h-4 text-[#d4af37]" />,
    },
    {
      num: '04',
      title: 'TATTOO',
      teluguTitle: 'టాటూ సెషన్',
      desc: 'Sterile rotary execution with hospital-grade hygiene.',
      teluguDesc: 'క్లినికల్ పరిశుభ్రతతో ప్రొఫెషనల్ సూది పనితనం.',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      num: '05',
      title: 'AFTERCARE',
      teluguTitle: 'ఆఫ్టర్‌కేర్ కేర్',
      desc: 'Medical-grade SecondSkin barrier & lifelong healing care.',
      teluguDesc: 'శాశ్వత కాంతివంతమైన హీలింగ్ కోసం రక్షణ పద్ధతులు.',
      icon: <HeartHandshake className="w-4 h-4 text-[#ffd885]" />,
    },
  ];

  const handleQuickBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    studioAudio.playZoneTransitionChime();
    onOpenBooking(selectedService);
  };

  return (
    <div className={`w-full py-6 select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: SERVICES & STYLES (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between subtle-glass rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
                SIGNATURE ARTISTRY
              </span>
              <span className="text-[10px] font-mono text-zinc-500">6 STYLES</span>
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide uppercase mb-1">
              SERVICES & STYLES
            </h3>
            <p className="text-xs text-zinc-400 font-sans mb-6">
              {language === 'te' 
                ? 'ఫైన్ లైన్ నుండి హైపర్ రియలిజం వరకు - సంపూర్ణ కళాత్మకత.'
                : 'From minimal to realism. Every discipline executed with single-needle precision.'}
            </p>

            {/* 6 Mini Style Showcase Cards (2 columns x 3 rows) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {services.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    studioAudio.playZoneTransitionChime();
                    onOpenBooking(item.title);
                  }}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-black/40 border border-white/10 hover:border-[#d4af37]/60 transition-all duration-300 p-2.5 flex flex-col justify-between hover:-translate-y-0.5 active:scale-95"
                >
                  {item.image ? (
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2 bg-[#121217]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 right-1.5">
                        <span className="text-[9px] font-mono text-[#ffd885] tracking-wider uppercase block truncate">
                          {item.style}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-24 rounded-xl mb-2 bg-gradient-to-br from-[#d4af37]/15 to-black/80 border border-[#d4af37]/20 flex flex-col items-center justify-center p-2 text-center">
                      <Sparkles className="w-5 h-5 text-[#d4af37] mb-1 animate-pulse" />
                      <span className="text-[10px] font-mono text-zinc-300 uppercase">Original Art</span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-white group-hover:text-[#ffd67a] transition-colors truncate">
                      {language === 'te' ? item.teluguTitle : item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={onViewAllServices}
            className="w-full py-3 rounded-full subtle-glass border border-white/20 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-xs font-mono tracking-widest text-[#ffd885] uppercase flex items-center justify-center gap-2 transition-all group"
          >
            <span>VIEW ALL SERVICES</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: THE TATTOO JOURNEY (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between subtle-glass rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                STANDARDIZED PROTOCOL
              </span>
              <span className="text-[10px] font-mono text-zinc-500">5 PHASES</span>
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide uppercase mb-1">
              THE TATTOO JOURNEY
            </h3>
            <p className="text-xs text-zinc-400 font-sans mb-6">
              {language === 'te'
                ? 'మీ ఆలోచన నుండి శాశ్వత మాస్టర్‌పీస్ వరకు దశల వారీ ప్రయాణం.'
                : 'Step-by-step master process ensuring anatomical comfort & lasting vibrancy.'}
            </p>

            {/* 5-Step Connected Timeline Nodes */}
            <div className="space-y-4 relative pl-3 sm:pl-4 mb-6">
              {/* Vertical connecting line */}
              <div className="absolute left-[19px] sm:left-[23px] top-3 bottom-3 w-px bg-gradient-to-b from-[#d4af37] via-[#d4af37]/40 to-transparent" />

              {journeySteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3.5 group">
                  {/* Node icon pill */}
                  <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full subtle-glass border border-[#d4af37]/60 group-hover:border-[#d4af37] flex items-center justify-center shrink-0 bg-[#070709] transition-transform group-hover:scale-110">
                    <span className="text-[10px] font-mono font-bold text-[#ffd885]">
                      {step.num}
                    </span>
                  </div>

                  {/* Step text */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-cinzel text-xs font-bold text-white group-hover:text-[#ffd67a] transition-colors">
                        {language === 'te' ? step.teluguTitle : step.title}
                      </h4>
                      {step.icon}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug font-sans mt-0.5">
                      {language === 'te' ? step.teluguDesc : step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={onLearnJourney}
            className="w-full py-3 rounded-full subtle-glass border border-white/20 hover:border-[#d4af37] hover:bg-[#d4af37]/10 text-xs font-mono tracking-widest text-[#ffd885] uppercase flex items-center justify-center gap-2 transition-all group"
          >
            <span>LEARN MORE</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#d4af37] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: BOOK YOUR SESSION & AUTHENTIC SLEEVE BADGE (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between subtle-glass rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                DIRECT ATELIER CALENDAR
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide uppercase mb-1">
              BOOK YOUR SESSION
            </h3>
            <p className="text-xs text-zinc-400 font-sans mb-5">
              {language === 'te'
                ? 'మాస్టర్ ఆర్టిస్ట్ అరుణ్‌తో డైరెక్ట్ సెషన్ లేదా కన్సల్టేషన్ ఖరారు చేసుకోండి.'
                : 'Reserve your personal date. Private atelier sessions with master artist Arun.'}
            </p>

            {/* Quick Interactive Reservation Form */}
            <form onSubmit={handleQuickBookSubmit} className="space-y-3.5 mb-6">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Select Style / Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-[#d4af37] text-white text-xs font-mono focus:outline-none transition-colors"
                >
                  <option value="Custom Tattoos">Custom Tattoos (Original Concept)</option>
                  <option value="Fine Line">Fine Line & Geometric</option>
                  <option value="Blackwork">Blackwork & Shiva Devotional</option>
                  <option value="Realism">Monochrome Realism Portrait</option>
                  <option value="Cover Up">Cover Up & Scar Camouflage</option>
                  <option value="Tattoo Consultation">In-Person Consultation (30-45m)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-[#d4af37] text-white text-xs font-mono focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Preferred Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-[#d4af37] text-white text-xs font-mono focus:outline-none transition-colors"
                  >
                    <option value="Morning">Morning (11:00 AM)</option>
                    <option value="Afternoon">Afternoon (02:30 PM)</option>
                    <option value="Evening">Evening (06:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Gold Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b38728] text-black font-bold uppercase tracking-widest text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <span>CONTINUE TO BOOKING</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </form>

            {/* Sleeve Preview Card: YOUR STORY / OUR INK */}
            <div className="rounded-2xl p-3 bg-black/40 border border-white/10 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#d4af37]/40">
                <img
                  src={assetUrl('/images/gallery/compass-geometric-band.png')}
                  alt="Fine Line Geometric Band"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#ffd885] tracking-wider uppercase font-bold">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>YOUR STORY / OUR INK</span>
                </div>
                <p className="text-[11px] text-zinc-300 font-sans truncate mt-0.5">
                  Private Atelier • Master Artist Arun
                </p>
                <p className="text-[9px] text-zinc-500 font-mono truncate">
                  Opposite to Gravity Gym, First Floor
                </p>
              </div>
            </div>
          </div>

          {/* Quick Direct Link */}
          <div className="pt-3 text-center">
            <span className="text-[10px] font-mono text-zinc-400">
              Immediate inquiry? Call <a href="tel:7207202082" className="text-[#ffd885] hover:underline font-bold">+91 7207202082</a>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
