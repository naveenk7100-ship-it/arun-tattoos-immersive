import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Star, X } from 'lucide-react';
import { api } from '../../../services/api';

export const AdminTestimonialsView: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [review, setReview] = useState('');
  const [artist, setArtist] = useState('Nani Kumar');
  const [tattooDone, setTattooDone] = useState('');
  const [location, setLocation] = useState('Vijayawada, AP');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !review.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createTestimonial({
        clientName,
        review,
        rating,
        artist,
        tattooDone,
        location,
        published: 1,
      });

      setShowAddModal(false);
      setClientName('');
      setReview('');
      setTattooDone('');
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to create testimonial:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      await api.updateTestimonial(id, { published: currentPublished ? 0 : 1 });
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to update testimonial:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this client testimonial?')) return;
    try {
      await api.deleteTestimonial(id);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
            Collector Testimonials & Reviews
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Curate verified client feedback displayed on the public studio portal
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-[#d4af37]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-500">
          Loading client testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-500">
          No testimonials logged yet. Click "Add Verified Review" to publish one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => {
            const isPub = t.published !== 0 && t.published !== false;
            return (
              <div
                key={t.id || `test-${idx}`}
                className="p-5 rounded-2xl subtle-glass border border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-[#ffd885]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#ffd885] text-[#ffd885]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {t.location || 'Vijayawada'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 italic leading-relaxed">
                    "{t.review}"
                  </p>

                <div className="pt-2 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-white font-medium block">{t.clientName || t.author}</span>
                  <span className="text-zinc-500 text-[10px]">{t.tattooDone}</span>
                  <span className="text-[#d4af37] text-[10px] block mt-0.5">By {t.artist}</span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => handleTogglePublish(t.id, isPub)}
                  className={`flex items-center gap-1 text-[11px] font-semibold ${
                    isPub ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isPub ? 'Published' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121217] p-6 rounded-3xl border border-white/15 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-cinzel font-bold text-white">Log Verified Review</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Naidu"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Client Review *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Paste verified feedback text..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Artist *</label>
                  <select
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Nani Kumar">Nani Kumar</option>
                    <option value="Yeswanth">Yeswanth</option>
                    <option value="Yeswanth & Nani Kumar">Yeswanth & Nani Kumar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Tattoo Done</label>
                <input
                  type="text"
                  placeholder="e.g. Memorial Portrait on Forearm"
                  value={tattooDone}
                  onChange={(e) => setTattooDone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Vijayawada, AP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold uppercase tracking-wider text-xs font-mono transition-colors disabled:opacity-50"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
