import React from 'react';
import { TATTOO_SERVICES } from '../../data/studioData';
import { ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface TattooStationZoneProps {
  onOpenBooking: () => void;
}

export const TattooStationZone: React.FC<TattooStationZoneProps> = ({ onOpenBooking }) => {
  const { t, language } = useLanguage();
  const tsz = t.zones.tattooStation;

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500 ${language === 'te' ? 'font-telugu' : ''}`}>
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          ZONE 05 • STERILE STATION
        </span>
        <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white mt-1 mb-3">
          {tsz.name}
        </h2>
        <p className="text-xs md:text-sm text-zinc-300 font-sans">
          {tsz.desc}
        </p>
      </div>

      {/* Sterile Equipment Anatomy Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl subtle-glass border border-emerald-500/20 text-left">
          <span className="text-[10px] font-mono text-emerald-400 block mb-1">STANDARD 01</span>
          <h4 className="text-base font-cinzel font-bold text-white mb-2">Single-Use Kwadron Cartridges</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Every needle cartridge is sealed with ethylene oxide (EO gas) indicator strips, verified, and unsealed directly before your eyes prior to application.
          </p>
        </div>

        <div className="p-5 rounded-2xl subtle-glass border border-emerald-500/20 text-left">
          <span className="text-[10px] font-mono text-emerald-400 block mb-1">STANDARD 02</span>
          <h4 className="text-base font-cinzel font-bold text-white mb-2">Triple Barrier Protection</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            All power cords, rotary machine housings, squeeze bottles, and leather armrests are sheathed in disposable barrier films replaced fresh for each client.
          </p>
        </div>

        <div className="p-5 rounded-2xl subtle-glass border border-emerald-500/20 text-left">
          <span className="text-[10px] font-mono text-emerald-400 block mb-1">STANDARD 03</span>
          <h4 className="text-base font-cinzel font-bold text-white mb-2">CRI 98 Surgical Daylight</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            5500K color-calibrated flicker-free lamps ensure that tonal gradients, black saturation, and fine stippling are placed with micro-millimeter precision.
          </p>
        </div>
      </div>

      {/* Services Menu Offered at this Station */}
      <div className="mb-10">
        <h3 className="text-xl md:text-2xl font-cinzel font-bold text-white text-center mb-6">
          Station Services & Master Capabilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TATTOO_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-2xl subtle-glass border border-white/10 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-[#d4af37] px-2 py-0.5 rounded bg-[#d4af37]/10 border border-[#d4af37]/30">
                    {srv.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {srv.prepTime}
                  </span>
                </div>

                <h4 className="text-lg font-cinzel font-bold text-white mb-2">
                  {srv.title}
                </h4>

                <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                  {srv.description}
                </p>

                <div className="space-y-1.5 mb-4">
                  {srv.processPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-[#ffd885] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-400 italic">Ideal: {srv.idealFor}</span>
                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#d4af37] hover:text-black font-mono text-xs font-semibold text-white transition-colors"
                >
                  {tsz.bookService}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
