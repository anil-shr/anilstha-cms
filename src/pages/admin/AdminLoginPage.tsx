import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { updateSEO } from '../../lib/seo';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAdmin, isCloudConnected } = useData();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('anil@shrestha.design');
  const [password, setPassword] = useState('design2026');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    updateSEO({
      title: 'Admin Authentication — Anil Shrestha CMS',
      description: 'Secure administrative entry point.',
      noindex: true,
    });
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center p-6 text-slate-100 relative">
      <SpotlightCard className="w-full max-w-md p-8 md:p-10 space-y-6 border-white/10 shadow-2xl">
        <div className="space-y-2 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>PORTFOLIO CMS</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isCloudConnected ? 'Cloud Mode' : 'Local CMS Mode'}</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to manage projects, profile data, skills, services, and inquiries.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090d16] text-xs text-white border border-white/10 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090d16] text-xs text-white border border-white/10 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Portfolio
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
};
