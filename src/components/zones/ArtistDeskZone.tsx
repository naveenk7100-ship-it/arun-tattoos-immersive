import React, { useState } from 'react';
import { ARTISTS } from '../../data/studioData';
import type { Artist } from '../../types';
import { Award, CheckCircle2, Quote, Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '../../translations/LanguageContext';

interface ArtistDeskZoneProps {
  onSelectArtistForBooking?: (artistName: string) => void;
}

export const ArtistDeskZone: React.FC<ArtistDeskZoneProps> = ({ onSelectArtistForBooking }) => {
  const { t, language } = useLanguage();
  const [selectedArtist, setSelectedArtist] = useState<Artist>(ARTISTS[0]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t.zones.artistDesk.code} • {t.zones.artistDesk.subhead}
        </span>
        <h2 className={`text-3xl md:text-5xl font-bold text-white mt-1 mb-3 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
          {t.zones.artistDesk.name}
        </h2>
        <p className={`text-xs md:text-sm text-zinc-300 ${language === 'te' ? 'font-telugu' : 'font-sans'}`}>
          {t.zones.artistDesk.desc}
        </p>
      </div>

      {/* Artist Switcher Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {ARTISTS.map((artist) => {
          const isSelected = selectedArtist.id === artist.id;
          return (
            <button
              key={artist.id}
              onClick={() => setSelectedArtist(artist)}
              className={`px-6 py-3 rounded-2xl flex items-center gap-3.5 transition-all duration-300 border ${
                isSelected
                  ? 'subtle-glass-gold border-[#d4af37] shadow-xl shadow-[#d4af37]/20 scale-105'
                  : 'subtle-glass border-white/5 hover:border-white/20 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37]">
                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover filter grayscale contrast-125" />
              </div>
              <div className="text-left">
                <div className={`text-sm font-bold ${isSelected ? 'text-[#ffd885]' : 'text-white'} ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
                  {artist.name}
                </div>
                <div className="text-[10px] font-mono text-zinc-400">
                  {artist.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Artist Dossier Card */}
      <div className="subtle-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 md:p-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Portrait & Stats Left Column */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 shadow-2xl mb-5">
              <img
                src={selectedArtist.image}
                alt={selectedArtist.name}
                className="w-full h-full object-cover object-center filter grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 inset-x-3 text-left">
                <span className="text-[10px] font-mono uppercase text-[#d4af37] tracking-widest block">
                  VIJAYAWADA RESIDENT CRAFTSMAN
                </span>
                <div className="text-base font-bold text-white font-cinzel">
                  {selectedArtist.name}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6 text-left">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">{t.zones.artistDesk.experienceYears}</span>
                <span className="text-base font-bold text-[#d4af37] font-mono">{selectedArtist.yearsExperience}+ Years</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">{t.zones.artistDesk.startedAge}</span>
                <span className="text-base font-bold text-white font-mono">{selectedArtist.careerStartAge} Years</span>
              </div>
            </div>

            {/* Book with Artist Direct Action */}
            <button
              onClick={() => onSelectArtistForBooking?.(selectedArtist.name)}
              className="w-full max-w-sm py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#e5c158] hover:to-[#c5a059] text-black font-bold uppercase tracking-wider text-xs font-mono flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/20 transition-all transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>{t.zones.artistDesk.bookWith} {selectedArtist.name}</span>
            </button>
          </div>

          {/* Biography, Credentials & Selected Works Right Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-xs font-mono text-[#d4af37] mb-3">
                <Sparkles className="w-3 h-3" />
                <span>{t.zones.artistDesk.principalTitle}</span>
              </div>

              <h3 className={`text-2xl sm:text-3xl font-bold text-white mb-3 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
                {selectedArtist.name}
              </h3>

              <div className="relative pl-4 border-l-2 border-[#d4af37] mb-5 italic text-xs sm:text-sm text-[#ffd885] font-sans">
                <Quote className="w-4 h-4 inline-block mr-1 opacity-50" />
                "{selectedArtist.quote}"
              </div>

              <p className={`text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 ${language === 'te' ? 'font-telugu' : 'font-sans'}`}>
                {selectedArtist.bio}
              </p>

              {/* Verified Credentials */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-[#d4af37] tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {t.zones.artistDesk.credentialsTitle}
                </h4>
                <div className="space-y-2">
                  {selectedArtist.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Signature Works */}
              <div className="mb-6">
                <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2.5">
                  Featured Portfolio Masterpieces
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedArtist.featuredWorks.map((work, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-200 font-mono"
                    >
                      <span className="text-[#d4af37] text-[10px] block mb-0.5">0{idx + 1} • MASTERPIECE</span>
                      <span className="font-medium">{work}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2.5">
                  {t.zones.artistDesk.specialtiesTitle}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtist.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[#ffd885] font-mono"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
