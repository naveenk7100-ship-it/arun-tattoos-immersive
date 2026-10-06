import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  Layers, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';
import { assetUrl } from '../../utils/assetUrl';
import { useLanguage } from '../../translations/LanguageContext';
import { studioAudio } from '../../utils/audio';

interface ReferenceEditorialGridProps {
  onOpenBooking: (service?: string, date?: string) => void;
  onViewAllServices: () => void;
  onLearnJourney: () => void;
  onSelectArtworkModal?: (imageUrl: string, title: string) => void;
}

export const ReferenceEditorialGrid: React.FC<ReferenceEditorialGridProps> = ({
  onOpenBooking,
  onViewAllServices,
  onLearnJourney,
  onSelectArtworkModal,
}) => {
  const { language } = useLanguage();

  const [selectedService, setSelectedService] = useState('Custom Tattoos');
  const [selectedDate, setSelectedDate] = useState('');

  // 6 Authentic Style Tiles matching Reference Column 1
  const styles = [
    {
      name: 'REALISM',
      teluguName: 'రియలిజం',
      image: assetUrl('/images/gallery/realism-portrait-tribute.png'),
    },
    {
      name: 'BLACK & GREY',
      teluguName: 'బ్లాక్ & గ్రే',
      image: assetUrl('/images/gallery/shiva-mahakal-trishul.png'),
    },
    {
      name: 'FINE LINE',
      teluguName: 'ఫైన్ లైన్',
      image: assetUrl('/images/gallery/compass-geometric-band.png'),
    },
    {
      name: 'MINIMAL',
      teluguName: 'మినిమల్',
      image: assetUrl('/images/gallery/compass-geometric-band.png'),
    },
    {
      name: 'PORTRAIT',
      teluguName: 'పోర్ట్రెయిట్',
      image: assetUrl('/images/gallery/realism-portrait-tribute.png'),
    },
    {
      name: 'CUSTOM',
      teluguName: 'కస్టమ్',
      image: assetUrl('/images/gallery/kali-goddess-backpiece.jpg'),
    },
  ];

  // 5 Step Timeline matching Reference Column 2
  const steps = [
    {
      num: '1',
      title: 'IDEA',
      desc: 'Share your vision',
      teluguTitle: 'ఐడియా',
      teluguDesc: 'మీ ఆలోచనను పంచుకోండి',
      icon: <Sparkles className="w-3.5 h-3.5 text-zinc-300" />,
    },
    {
      num: '2',
      title: 'DESIGN',
      desc: 'We create the art',
      teluguTitle: 'డిజైన్',
      teluguDesc: 'కస్టమ్ డ్రాఫ్టింగ్',
      icon: <PenTool className="w-3.5 h-3.5 text-zinc-300" />,
    },
    {
      num: '3',
      title: 'CONSULTATION',
      desc: 'Discuss & finalize',
      teluguTitle: 'కన్సల్టేషన్',
      teluguDesc: 'ప్లేస్‌మెంట్ & సైజింగ్',
      icon: <Layers className="w-3.5 h-3.5 text-zinc-300" />,
    },
    {
      num: '4',
      title: 'TATTOO',
      desc: 'Bringing it to life',
      teluguTitle: 'టాటూ సెషన్',
      teluguDesc: 'స్టెరైల్ ప్రెసిషన్',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />,
    },
    {
      num: '5',
      title: 'AFTERCARE',
      desc: 'Keep it looking fresh',
      teluguTitle: 'ఆఫ్టర్‌కేర్',
      teluguDesc: 'శాశ్వత రక్షణ',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-zinc-300" />,
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    studioAudio.playZoneTransitionChime();
    onOpenBooking(selectedService, selectedDate);
  };

  return (
    <div className={`w-full py-6 select-none ${language === 'te' ? 'font-telugu' : ''}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: SERVICES & STYLES (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 bg-[#0a0a0d] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-widest uppercase">
              SERVICES & STYLES
            </h3>
            <p className="text-[11px] font-sans text-zinc-400 mt-1 mb-5">
              {language === 'te' 
                ? 'మినిమల్ నుండి రియలిస్టిక్ వరకు — ప్రతి శైలికి జీవం పోస్తాం.' 
                : 'From minimal to realistic — we bring every style to life.'}
            </p>

            {/* 6 Authentic Style Tiles in a Horizontal Row matching Reference */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
              {styles.map((style, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    studioAudio.playZoneTransitionChime();
                    if (onSelectArtworkModal) {
                      onSelectArtworkModal(style.image, style.name);
                    } else {
                      onViewAllServices();
                    }
                  }}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/10 bg-black/60 group-hover:border-[#d4af37] transition-all relative">
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute bottom-1 inset-x-0 text-center">
                      <span className="text-[8px] font-mono tracking-wider text-zinc-300 group-hover:text-[#ffd885] uppercase truncate px-0.5 block">
                        {language === 'te' ? style.teluguName : style.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VIEW ALL SERVICES Button */}
          <button
            onClick={onViewAllServices}
            className="w-fit px-5 py-2 rounded-full border border-white/20 hover:border-[#d4af37] hover:bg-white/5 text-[11px] font-sans tracking-widest text-zinc-200 hover:text-white uppercase flex items-center gap-2 transition-all mt-auto"
          >
            <span>VIEW ALL SERVICES</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: THE TATTOO JOURNEY (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 relative overflow-hidden bg-[#0a0a0d] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all">
          {/* Authentic Studio Session In-Progress Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter grayscale opacity-25 mix-blend-luminosity pointer-events-none"
            style={{ backgroundImage: `url(${assetUrl('/images/gallery/arun-studio-session.png')})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/80 to-[#0a0a0d]/60 pointer-events-none" />

          <div className="relative z-10">
            <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-widest uppercase">
              THE TATTOO JOURNEY
            </h3>
            <p className="text-[11px] font-sans text-zinc-400 mt-1 mb-8">
              {language === 'te'
                ? 'ఆలోచన నుండి ఆఫ్టర్‌కేర్ వరకు సంపూర్ణ సురక్షిత ప్రక్రియ.'
                : 'A seamless process from idea to aftercare.'}
            </p>

            {/* 5 Connected Circular Nodes Progression matching Reference Image */}
            <div className="relative flex items-center justify-between mb-8 px-2">
              {/* Horizontal Connecting Line */}
              <div className="absolute left-6 right-6 top-4 h-px bg-white/20 -z-0" />

              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group cursor-pointer" onClick={onLearnJourney}>
                  <div className="w-8 h-8 rounded-full border border-white/30 bg-[#0a0a0d] flex items-center justify-center group-hover:border-[#d4af37] group-hover:scale-110 transition-all shadow-lg mb-2">
                    {step.icon}
                  </div>
                  <span className="text-[9px] font-mono tracking-wider text-white font-bold block uppercase">
                    {step.num}. {language === 'te' ? step.teluguTitle : step.title}
                  </span>
                  <span className="text-[8px] font-sans text-zinc-400 max-w-[55px] leading-tight mt-0.5 hidden sm:block">
                    {language === 'te' ? step.teluguDesc : step.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LEARN MORE Button */}
          <div className="relative z-10 mt-auto">
            <button
              onClick={onLearnJourney}
              className="w-fit px-5 py-2 rounded-full border border-white/20 hover:border-[#d4af37] hover:bg-white/5 text-[11px] font-sans tracking-widest text-zinc-200 hover:text-white uppercase flex items-center gap-2 transition-all"
            >
              <span>LEARN MORE</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: BOOK YOUR SESSION & SLEEVE CROP (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 bg-[#0a0a0d] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden">
          
          <div className="flex gap-4">
            
            {/* Form Section */}
            <div className="flex-1">
              <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-widest uppercase">
                BOOK YOUR SESSION
              </h3>
              <p className="text-[11px] font-sans text-zinc-400 mt-1 mb-5">
                {language === 'te' 
                  ? 'మీ కొత్త టాటూ కోసం ఇప్పుడే రిజర్వ్ చేసుకోండి.' 
                  : "Let's create something amazing together."}
              </p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-sans text-zinc-400 uppercase tracking-wider block mb-1">
                    Select Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-[#d4af37] text-zinc-200 text-xs font-sans focus:outline-none transition-colors"
                  >
                    <option value="Custom Tattoos">Custom Tattoos (Original Concept)</option>
                    <option value="Fine Line">Fine Line & Geometric</option>
                    <option value="Blackwork">Blackwork & Shiva Devotional</option>
                    <option value="Realism">Realism Portraiture</option>
                    <option value="Cover Up">Cover Up & Scar Camouflage</option>
                    <option value="Tattoo Consultation">In-Person Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-sans text-zinc-400 uppercase tracking-wider block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/15 focus:border-[#d4af37] text-zinc-200 text-xs font-sans focus:outline-none transition-colors"
                  />
                </div>

                {/* Warm Gold Solid Pill Button CONTINUE -> */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-6 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-black font-sans font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-black/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </form>
            </div>

            {/* Right Edge: Vertical Sleeve Crop matching Reference Image */}
            <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center justify-between border-l border-white/10 pl-3">
              {/* Sleeve Photograph */}
              <div className="w-full h-36 rounded-lg overflow-hidden border border-white/10 relative">
                <img
                  src={assetUrl('/images/gallery/compass-geometric-band.png')}
                  alt="Authentic Sleeve Ink"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Vertical Text: YOUR STORY OUR INK */}
              <div className="text-center pt-2">
                <span className="text-[8px] font-mono tracking-[0.25em] text-zinc-400 uppercase leading-relaxed block">
                  YOUR<br />STORY<br />OUR INK
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
