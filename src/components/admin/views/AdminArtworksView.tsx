import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Eye, EyeOff, Star, Upload, X } from 'lucide-react';
import { api } from '../../../services/api';

export const AdminArtworksView: React.FC = () => {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Artwork Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Portrait');
  const [newArtist, setNewArtist] = useState('Arun');
  const [newDescription, setNewDescription] = useState('');
  const [newPlacement, setNewPlacement] = useState('Inner Forearm');
  const [newStyle, setNewStyle] = useState('Greywash Realism');
  const [newSessionDuration, setNewSessionDuration] = useState('4-6 Hours');
  const [newDifficulty, setNewDifficulty] = useState('Master');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminArtworks();
      setArtworks(data);
    } catch (err) {
      console.error('Failed to load artworks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createArtwork({
        title: newTitle,
        category: newCategory,
        artist: newArtist,
        description: newDescription,
        placement: newPlacement,
        style: newStyle,
        sessionDuration: newSessionDuration,
        difficulty: newDifficulty,
        featured: isFeatured ? 1 : 0,
        isPlaceholder: isPlaceholder ? 1 : 0,
        published: 1,
      }, imageFile || undefined);

      setShowAddModal(false);
      // Reset
      setNewTitle('');
      setNewDescription('');
      setImageFile(null);
      setImagePreview(null);
      fetchArtworks();
    } catch (err) {
      console.error('Failed to create artwork:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      await api.updateArtwork(id, { published: currentPublished ? 0 : 1 });
      fetchArtworks();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await api.updateArtwork(id, { featured: currentFeatured ? 0 : 1 });
      fetchArtworks();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this artwork from the studio catalog?')) return;
    try {
      await api.deleteArtwork(id);
      fetchArtworks();
    } catch (err) {
      console.error('Failed to delete artwork:', err);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-cinzel font-bold text-white tracking-wide">
            Master Portfolio Catalog
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Curate pieces displayed across the virtual 3D Art Gallery & Inspector
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-[#d4af37]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Artwork</span>
        </button>
      </div>

      {/* Artworks List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-500">
          Loading atelier portfolio...
        </div>
      ) : artworks.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-500">
          No artworks found in catalog. Click "Add New Artwork" to publish one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {artworks.map((art) => {
          const isPub = art.published === 1 || art.published === true;
          const isFeat = art.featured === 1 || art.featured === true;
          const isPlh = art.is_placeholder === 1 || art.is_placeholder === true || art.isPlaceholder;

          return (
            <div
              key={art.id}
              className="rounded-2xl subtle-glass border border-white/10 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={art.imageUrl || art.image_url}
                    alt={art.title}
                    className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#ffd885] border border-white/10">
                      {art.category}
                    </span>
                    {isPlh && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 font-bold">
                        INTERNAL PLACEHOLDER
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleFeatured(art.id, isFeat)}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                      isFeat ? 'bg-[#d4af37] text-black' : 'bg-black/60 text-zinc-400 hover:text-white'
                    }`}
                    title={isFeat ? 'Featured on home' : 'Click to feature'}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>By {art.artist}</span>
                    <span>{art.sessionDuration || art.session_duration}</span>
                  </div>

                  <h4 className="text-sm font-cinzel font-bold text-white leading-snug">
                    {art.title}
                  </h4>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => handleTogglePublish(art.id, isPub)}
                  className={`flex items-center gap-1 text-[11px] font-semibold ${
                    isPub ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isPub ? 'Published' : 'Hidden Draft'}</span>
                </button>

                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  title="Delete artwork"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Artwork Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-[#121217] p-6 rounded-3xl border border-white/15 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-cinzel font-bold text-white">Curate New Artwork</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArtwork} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mythological Lord Shiva Half Sleeve"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Portrait">Portrait</option>
                    <option value="Black & Grey">Black & Grey</option>
                    <option value="Fine Line">Fine Line</option>
                    <option value="Micro Realism">Micro Realism</option>
                    <option value="Sacred / Devotional">Sacred / Devotional</option>
                    <option value="Cover-Up">Cover-Up</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Full Back / Large Scale">Full Back / Large Scale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Artist *</label>
                  <select
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Arun">Arun</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Style Spec</label>
                  <input
                    type="text"
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value)}
                    placeholder="e.g. Greywash Realism"
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Essential">Essential</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tonal shading notes, needle config, story..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Placement</label>
                  <input
                    type="text"
                    value={newPlacement}
                    onChange={(e) => setNewPlacement(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Session Duration</label>
                  <input
                    type="text"
                    value={newSessionDuration}
                    onChange={(e) => setNewSessionDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-zinc-400 mb-1">Upload Photo (JPG, PNG, WebP)</label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/20">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer p-4 rounded-xl border border-dashed border-white/20 text-center hover:bg-white/5 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-zinc-400 mx-auto mb-1" />
                    <span className="text-zinc-300 block">Click to select high-res image</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Safeguard Checkboxes */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-black border-white/20 text-[#d4af37]"
                  />
                  <span>Feature in Highlights</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPlaceholder}
                    onChange={(e) => setIsPlaceholder(e.target.checked)}
                    className="rounded bg-black border-white/20 text-amber-500"
                  />
                  <span className="text-amber-400">Mark as Placeholder (Not Verified)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold uppercase tracking-wider text-xs font-mono transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Uploading to Studio...' : 'Save & Publish to Gallery'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
