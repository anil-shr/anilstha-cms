import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { updateSEO } from '../../lib/seo';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Sun,
  Moon,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAdmin, isCloudConnected } = useData();
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    updateSEO({
      title: 'Admin Authentication — CMS Portal',
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
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      }
    } catch {
      setErrorMsg('Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#121212] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-slate-100 relative transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <SpotlightCard className="w-full max-w-md p-6 sm:p-10 space-y-6 bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl text-left">
        <div className="space-y-2 border-b border-slate-100 dark:border-white/10 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>PORTFOLIO CMS</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isCloudConnected ? 'Cloud Active' : 'Protected'}</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Authorized administrative access to manage portfolio case studies, bio, services, and inquiries.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Account
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="text"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email or username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-pass" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-pass"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Return to Public Portfolio
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
};
