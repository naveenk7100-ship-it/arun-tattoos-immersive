import React, { useState, useEffect } from 'react';
import { GALLERY_ITEMS, STUDIO_VIDEOS, COVERUP_CASE_STUDY } from '../../data/studioData';
import type { GalleryArtwork, GalleryCategory } from '../../types';
import { 
  Eye, 
  Sparkles, 
  Play, 
  Layers, 
  ShieldCheck, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  X
} from 'lucide-react';
import { ArtworkInspectorModal } from '../ui/ArtworkInspectorModal';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { useLanguage } from '../../translations/LanguageContext';

interface GalleryZoneProps {
  onSelectPieceForBooking?: (artwork: GalleryArtwork) => void;
  onOpenBookingWithStyle?: (style: string, artist: string) => void;
}

export const GalleryZone: React.FC<GalleryZoneProps> = ({
  onSelectPieceForBooking,
  onOpenBookingWithStyle,
}) => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArtwork, setActiveArtwork] = useState<GalleryArtwork | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'All', label: t.zones.gallery.filterAll },
    { key: 'Portrait', label: t.zones.gallery.filterPortrait },
    { key: 'Black & Grey', label: t.zones.gallery.filterBlackGrey },
    { key: 'Fine Line', label: t.zones.gallery.filterFineLine },
    { key: 'Micro Realism', label: t.zones.gallery.filterMicroRealism },
    { key: 'Sacred / Devotional', label: t.zones.gallery.filterSacred },
    { key: 'Cover-Up', label: t.zones.gallery.filterCoverUp },
    { key: 'Minimal', label: t.zones.gallery.filterMinimal },
    { key: 'Full Back / Large Scale', label: t.zones.gallery.filterFullBack },
  ];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory as GalleryCategory);

  // Check initial URL hash (e.g. #art=art-01) on load for shareable link support
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#art=')) {
      const artId = hash.replace('#art=', '');
      const found = GALLERY_ITEMS.find((item) => item.id === artId);
      if (found) {
        setActiveArtwork(found);
      }
    }
  }, []);

  const handleNextArt = () => {
    if (!activeArtwork) return;
    const currentIdx = filteredItems.findIndex((item) => item.id === activeArtwork.id);
    const nextIdx = (currentIdx + 1) % filteredItems.length;
    setActiveArtwork(filteredItems[nextIdx]);
  };

  const handlePrevArt = () => {
    if (!activeArtwork) return;
    const currentIdx = filteredItems.findIndex((item) => item.id === activeArtwork.id);
    const prevIdx = (currentIdx - 1 + filteredItems.length) % filteredItems.length;
    setActiveArtwork(filteredItems[prevIdx]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-14 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t.zones.gallery.code} • {t.zones.gallery.subhead}
        </span>
        <h2 className={`text-3xl md:text-5xl font-bold text-white mt-1 mb-3 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
          {t.zones.gallery.name}
        </h2>
        <p className={`text-xs md:text-sm text-zinc-300 ${language === 'te' ? 'font-telugu' : 'font-sans'}`}>
          {t.zones.gallery.desc}
        </p>
      </div>

      {/* Category Pills (8 Categories + All) */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 border ${
              selectedCategory === cat.key
                ? 'bg-[#d4af37] text-black font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/25'
                : 'subtle-glass border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Master Artwork Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {filteredItems.map((artwork) => (
          <div
            key={artwork.id}
            onClick={() => setActiveArtwork(artwork)}
            className="group cursor-pointer rounded-2xl overflow-hidden subtle-glass border border-white/10 hover:border-[#d4af37]/60 transition-all duration-300 transform hover:-translate-y-2 shadow-xl shadow-black/60 flex flex-col justify-between"
          >
            {/* Image Preview with Hover Lift */}
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
              />
              
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

              {/* Category Pill Tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#d4af37] font-semibold">
                {artwork.category}
              </div>

              {/* View Loupe Badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-4 py-2 rounded-full bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                  <Eye className="w-3.5 h-3.5" />
                  {t.zones.gallery.inspectBtn}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 border-t border-white/10 bg-[#0d0d12]/90">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>By {artwork.artist}</span>
                <span className="text-zinc-500">•</span>
                <span className="truncate">{artwork.placement}</span>
              </div>

              <h3 className={`text-base font-bold text-white group-hover:text-[#ffd885] transition-colors truncate mb-2 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
                {artwork.title}
              </h3>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-[#ffd885]">
                  <Clock className="w-3 h-3" />
                  {artwork.sessionDuration.split(' ')[0]} {t.common.hours}
                </span>
                <span className="text-zinc-500 uppercase">{artwork.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURED CASE STUDY: COVER-UP BEFORE / AFTER SECTION */}
      <div className="mb-16 p-6 sm:p-10 rounded-3xl subtle-glass-gold border border-[#d4af37]/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" />
              {t.zones.gallery.beforeAfterTitle}
            </span>
            <h3 className={`text-2xl sm:text-3xl font-bold text-white mt-1 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
              {COVERUP_CASE_STUDY.title}
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {COVERUP_CASE_STUDY.subtitle}
            </p>
          </div>

          <button
            onClick={() => setShowCaseStudy(!showCaseStudy)}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-200 flex items-center gap-2 border border-white/10 self-start md:self-auto transition-colors"
          >
            <Layers className="w-4 h-4 text-[#d4af37]" />
            <span>{showCaseStudy ? 'Hide Case Study Roadmap' : 'Examine 4-Step Process'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Before & After Slider */}
          <div className="lg:col-span-7">
            <BeforeAfterSlider
              beforeImage={COVERUP_CASE_STUDY.beforeImage!}
              afterImage={COVERUP_CASE_STUDY.afterImage}
              beforeLabel="2014 OLD SCAR / TRIBAL"
              afterLabel="HEALED PHOENIX RESTORATION"
            />
          </div>

          {/* Context & Description */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 leading-relaxed font-sans">
              <p>{COVERUP_CASE_STUDY.context}</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 font-mono flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{COVERUP_CASE_STUDY.outcome}</span>
            </div>

            <button
              onClick={() => onOpenBookingWithStyle?.('Cover-up & Scar Camouflage', 'Yeswanth')}
              className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold uppercase tracking-wider text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>Consult on Cover-up / Scar Camouflage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable 4-Step Process Roadmap */}
        {showCaseStudy && (
          <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in duration-300">
            <h4 className="text-xs font-mono uppercase text-[#d4af37] tracking-wider mb-4">
              Step-by-Step Restoration Methodology:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {COVERUP_CASE_STUDY.steps.map((st) => (
                <div key={st.step} className="p-4 rounded-2xl bg-black/50 border border-white/5">
                  <span className="text-[10px] font-mono text-[#d4af37] block mb-1">
                    PHASE {st.step}
                  </span>
                  <h5 className="text-xs font-bold text-white mb-1.5 font-cinzel">
                    {st.title}
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {st.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STUDIO STORIES / VIDEO SECTION ARCHITECTURE */}
      <div className="mb-10 text-left">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-wider block">
              CINEMATIC ARCHIVES
            </span>
            <h3 className={`text-2xl font-bold text-white ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
              Studio Stories & Process Films
            </h3>
          </div>
          <a
            href="https://www.youtube.com/@aruntattoostudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#ffd885] hover:underline flex items-center gap-1"
          >
            <span>YouTube @aruntattoostudio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STUDIO_VIDEOS.map((vid) => (
            <div
              key={vid.id}
              className="rounded-2xl overflow-hidden subtle-glass border border-white/10 flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-black overflow-hidden group">
                <img
                  src={vid.poster}
                  alt={vid.title}
                  className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedVideo(vid.id)}
                    className="w-14 h-14 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform"
                    aria-label={`Play ${vid.title}`}
                  >
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                  {vid.duration}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#d4af37] mb-1">
                  <span>{vid.category}</span>
                  <span>With {vid.artist}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 font-cinzel">
                  {vid.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {vid.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN ARTWORK INSPECTOR MODAL WITH ZOOM LOUPE */}
      <ArtworkInspectorModal
        artwork={activeArtwork}
        onClose={() => setActiveArtwork(null)}
        onSelectSimilarStyle={(style, artist) => {
          if (onOpenBookingWithStyle) {
            onOpenBookingWithStyle(style, artist);
          } else if (onSelectPieceForBooking && activeArtwork) {
            onSelectPieceForBooking(activeArtwork);
          }
        }}
        onNextArtwork={handleNextArt}
        onPrevArtwork={handlePrevArt}
      />

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h4 className="text-sm font-cinzel font-bold text-white">
                {STUDIO_VIDEOS.find((v) => v.id === selectedVideo)?.title}
              </h4>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                title="Studio Video"
                src={`https://www.youtube-nocookie.com/embed/${STUDIO_VIDEOS.find((v) => v.id === selectedVideo)?.youtubeId || ''}?autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
