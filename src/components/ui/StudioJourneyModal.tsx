import React from 'react';
import { X, CheckCircle, ShieldCheck, HeartHandshake, PenTool, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface StudioJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const StudioJourneyModal: React.FC<StudioJourneyModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const phases = [
    {
      num: '01',
      title: 'IDEA & INSPIRATION',
      teluguTitle: 'ఆలోచన & స్ఫూర్తి',
      desc: 'Bring your personal story, emotional narrative, or visual references. Arun listens closely to extract the underlying meaning.',
      icon: <Sparkles className="w-5 h-5 text-[#d4af37]" />,
    },
    {
      num: '02',
      title: 'CUSTOM DESIGN & COMPOSITION',
      teluguTitle: 'కస్టమ్ డిజైన్ & డ్రాఫ్టింగ్',
      desc: 'Every piece is drawn from scratch. Arun uses digital displays to test sizing, line weights, and muscle contour alignment.',
      icon: <PenTool className="w-5 h-5 text-[#ffd885]" />,
    },
    {
      num: '03',
      title: 'CONSULTATION & STENCIL FIT',
      teluguTitle: 'కన్సల్టేషన్ & ప్లేస్‌మెంట్',
      desc: 'In-studio sizing review. Thermal stencils are applied to skin to evaluate natural movement, joint flexing, and visual balance.',
      icon: <Layers className="w-5 h-5 text-[#d4af37]" />,
    },
    {
      num: '04',
      title: 'STERILE TATTOO SESSION',
      teluguTitle: 'స్టెరైల్ టాటూ సెషన్',
      desc: 'Surgical daylight lighting, single-use Kwadron cartridge needles, Bishop rotary precision, and continuous antiseptic wiping.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: '05',
      title: 'MEDICAL AFTERCARE REGIMEN',
      teluguTitle: 'మెడికల్ ఆఫ్టర్‌కేర్ కేర్',
      desc: 'Medical-grade SecondSkin barrier applied immediately to lock out bacteria. Full healing kit and lifelong color vibrancy instructions provided.',
      icon: <HeartHandshake className="w-5 h-5 text-[#ffd885]" />,
    },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 ${language === 'te' ? 'font-telugu' : ''}`}>
      <div className="relative w-full max-w-3xl bg-[#0d0d12] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            STUDIO PROTOCOL & METHODOLOGY
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white uppercase">
            THE TATTOO JOURNEY
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            From initial concept to lifelong healed art — executed with clinical precision by Arun.
          </p>
        </div>

        {/* 5 Phases */}
        <div className="space-y-4 mb-8">
          {phases.map((phase, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-4 hover:border-[#d4af37]/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {phase.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#d4af37]">{phase.num}</span>
                  <h4 className="font-sans text-xs font-bold text-white tracking-wider uppercase">
                    {language === 'te' ? phase.teluguTitle : phase.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-zinc-400">
            Ready to initiate your custom tattoo piece?
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#c5a059] hover:bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <span>BOOK SESSION WITH ARUN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
