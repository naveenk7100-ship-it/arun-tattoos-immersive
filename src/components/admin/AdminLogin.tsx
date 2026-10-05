import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, Shield, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { api, setStoredAuth } from '../../services/api';
import type { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStudio: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStudio }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.login(email, password);
      setStoredAuth(res.token, res.user);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@aruntattoos.com');
    setPassword('ArunTattoos@2025');
  };

  const handleFillDemoArtist = () => {
    setEmail('arun@aruntattoos.com');
    setPassword('ArunTattoos@2025');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      
      {/* Background radial gold aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-40 pointer-events-none" />

      {/* Back to Studio Link */}
      <button
        onClick={onBackToStudio}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to 3D Virtual Studio</span>
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md subtle-glass-gold p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl shadow-black text-center animate-in zoom-in-95 duration-300">
        
        {/* Monogram Crest */}
        <div className="w-14 h-14 rounded-full border-2 border-[#d4af37]/60 bg-[#121217] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-black">
          <span className="font-cinzel text-xl font-bold text-[#d4af37]">A</span>
        </div>

        <h2 className="text-2xl font-cinzel font-bold text-white tracking-wider mb-1">
          ARUN TATTOOS
        </h2>
        <p className="text-xs font-mono tracking-widest text-[#d4af37] uppercase mb-6">
          PRIVATE CONCIERGE & ATELIER PORTAL
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Studio Email</span>
            </label>
            <input
              type="email"
              required
              placeholder="admin@aruntattoostudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Passphrase</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold uppercase tracking-wider text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Enter Admin Console</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="mt-6 pt-5 border-t border-white/10 text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            Quick Demo Autofill (For Testing):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 transition-colors"
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={handleFillDemoArtist}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 transition-colors"
            >
              Fill Artist Demo
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
