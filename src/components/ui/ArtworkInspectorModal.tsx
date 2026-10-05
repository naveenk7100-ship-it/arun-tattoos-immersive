import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Share2,
  Check
} from 'lucide-react';
import type { GalleryArtwork } from '../../types';
import { useLanguage } from '../../translations/LanguageContext';

interface ArtworkInspectorModalProps {
  artwork: GalleryArtwork | null;
  onClose: () => void;
  onSelectSimilarStyle: (style: string, artist: string) => void;
  onNextArtwork?: () => void;
  onPrevArtwork?: () => void;
}

export const ArtworkInspectorModal: React.FC<ArtworkInspectorModalProps> = ({
  artwork,
  onClose,
  onSelectSimilarStyle,
  onNextArtwork,
  onPrevArtwork,
}) => {
  const { t, language } = useLanguage();
  const [isLoupeActive, setIsLoupeActive] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const [mobileZoomScale, setMobileZoomScale] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize URL hash for shareable artwork state
  useEffect(() => {
    if (artwork) {
      window.location.hash = `art=${artwork.id}`;
    } else {
      if (window.location.hash.startsWith('#art=')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [artwork]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNextArtwork) {
        onNextArtwork();
      } else if (e.key === 'ArrowLeft' && onPrevArtwork) {
        onPrevArtwork();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextArtwork, onPrevArtwork]);

  // Mouse move handler for Zoom Loupe
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setIsLoupeActive(false);
      return;
    }

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setLensPos({ x, y, bgX, bgY });
    setIsLoupeActive(true);
  }, []);

  const handleMouseLeave = () => {
    setIsLoupeActive(false);
  };

  const handleCopyShareLink = () => {
    if (!artwork) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#art=${artwork.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300">
      
      {/* Outer Card Container */}
      <div className="relative w-full max-w-6xl my-auto subtle-glass-gold rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-2xl flex flex-col lg:flex-row max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          {/* Share Link Button */}
          <button
            onClick={handleCopyShareLink}
            className="p-2.5 rounded-full bg-black/70 border border-white/10 text-zinc-300 hover:text-white hover:border-[#d4af37] transition-all"
            title="Copy shareable link to this artwork"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/70 border border-white/10 text-zinc-300 hover:text-white hover:border-red-400 transition-all"
            aria-label="Close artwork inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Previous & Next Art Navigation Buttons (Floating on sides) */}
        {onPrevArtwork && (
          <button
            onClick={onPrevArtwork}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 border border-white/15 text-zinc-300 hover:text-white hover:border-[#d4af37] transition-all"
            title="Previous artwork (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {onNextArtwork && (
          <button
            onClick={onNextArtwork}
            className="hidden sm:flex absolute right-3 lg:right-[48%] top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/70 border border-white/15 text-zinc-300 hover:text-white hover:border-[#d4af37] transition-all"
            title="Next artwork (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* LEFT: ARTWORK DISPLAY & ZOOM LOUPE AREA */}
        <div className="lg:w-7/12 bg-black relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-white/10">
          
          {/* Zoom Instruction Pill */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{t.zones.gallery.zoomHint}</span>
          </div>

          {/* Main Image Container */}
          <div
            ref={imgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-crosshair rounded-2xl overflow-hidden max-h-[70vh] flex items-center justify-center shadow-2xl"
          >
            <img
              src={artwork.highResUrl || artwork.imageUrl}
              alt={artwork.title}
              className="max-h-[68vh] w-auto object-contain rounded-xl transition-transform duration-200"
              style={{ transform: `scale(${mobileZoomScale})` }}
            />

            {/* Desktop Zoom Magnifier Loupe */}
            {isLoupeActive && (
              <div
                className="hidden lg:block absolute w-48 h-48 rounded-full border-2 border-[#d4af37] shadow-[0_0_25px_rgba(0,0,0,0.9)] pointer-events-none overflow-hidden"
                style={{
                  left: `${lensPos.x - 96}px`,
                  top: `${lensPos.y - 96}px`,
                  backgroundImage: `url(${artwork.highResUrl || artwork.imageUrl})`,
                  backgroundPosition: `${lensPos.bgX}% ${lensPos.bgY}%`,
                  backgroundSize: '300%',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Loupe crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-[#d4af37]" />
                  <div className="h-full w-[1px] bg-[#d4af37] absolute" />
                </div>
                <div className="absolute bottom-2 inset-x-0 text-center">
                  <span className="px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#ffd885]">
                    3.0X DETAIL
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Zoom Controls */}
          <div className="lg:hidden flex items-center gap-3 mt-3">
            <button
              onClick={() => setMobileZoomScale((s) => Math.min(s + 0.5, 2.5))}
              className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono flex items-center gap-1 text-zinc-300"
            >
              <ZoomIn className="w-3.5 h-3.5" /> +
            </button>
            <button
              onClick={() => setMobileZoomScale((s) => Math.max(s - 0.5, 1))}
              className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono flex items-center gap-1 text-zinc-300"
            >
              <ZoomOut className="w-3.5 h-3.5" /> -
            </button>
            {mobileZoomScale > 1 && (
              <button
                onClick={() => setMobileZoomScale(1)}
                className="px-3 py-1 rounded-full bg-[#d4af37]/20 text-xs font-mono text-[#d4af37] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: STRUCTURED METADATA & BOOKING INTENT */}
        <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            
            {/* Category & Verified Badge */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[10px] font-mono text-[#d4af37] font-bold uppercase">
                {artwork.category}
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-[10px] font-mono text-zinc-400">
                {artwork.difficulty} Level
              </span>
              {artwork.isPlaceholder ? (
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-400 border border-zinc-700">
                  {t.zones.gallery.placeholderBadge}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-[9px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t.zones.gallery.verifiedBadge}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-2 ${language === 'te' ? 'font-telugu' : 'font-cinzel'}`}>
              {artwork.title}
            </h2>

            {/* Placement & Artist Credit */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#ffd885] mb-4">
              <span>By {artwork.artist}</span>
              <span className="text-zinc-600">/</span>
              <span>{artwork.placement}</span>
            </div>

            {/* Description */}
            <p className={`text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 ${language === 'te' ? 'font-telugu' : 'font-sans'}`}>
              {artwork.description}
            </p>

            {/* Structured Specifications Matrix */}
            <div className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 text-xs font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">SESSION DURATION</span>
                <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  {artwork.sessionDuration}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">NEEDLE TECHNIQUE</span>
                <span className="text-zinc-200 font-medium truncate block mt-0.5" title={artwork.technique}>
                  {artwork.technique}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">HEALING ESTIMATE</span>
                <span className="text-[#ffd885] font-medium mt-0.5 block">
                  {artwork.healingEstimate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">APPROXIMATE SIZE</span>
                <span className="text-white font-medium mt-0.5 block">
                  {artwork.size}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <button
              onClick={() => {
                onSelectSimilarStyle(artwork.style, artwork.artist);
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38728] hover:from-[#e5c158] hover:to-[#c5a059] text-black font-bold uppercase tracking-wider text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>{t.zones.gallery.requestSimilar}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={() => {
                onSelectSimilarStyle(artwork.category, artwork.artist);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t.zones.gallery.bookConsultation}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
