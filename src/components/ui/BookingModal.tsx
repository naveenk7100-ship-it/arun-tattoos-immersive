import React from 'react';
import { X } from 'lucide-react';
import { BookingAreaZone } from '../zones/BookingAreaZone';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArtist?: string;
  initialStyle?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialArtist,
  initialStyle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl my-auto">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2.5 rounded-full bg-black/80 border border-white/15 text-zinc-300 hover:text-white hover:border-[#d4af37] transition-all shadow-xl"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[92vh] overflow-y-auto rounded-3xl">
          <BookingAreaZone
            initialArtist={initialArtist}
            initialStyle={initialStyle}
            onReturnToStudio={onClose}
          />
        </div>
      </div>
    </div>
  );
};
