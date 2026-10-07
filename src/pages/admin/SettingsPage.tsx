import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { getSupabaseCredentials } from '../../lib/supabase';
import {
  Check,
  Database,
  Globe,
  Cloud,
  ShieldCheck,
  UploadCloud,
  DownloadCloud,
  RefreshCw,
  Copy,
  AlertCircle,
  ExternalLink,
  Key,
  Server,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    isCloudConnected,
    pushAllToSupabase,
    pullFromSupabase,
    configureSupabase,
    isLoading,
  } = useData();

  const [formData, setFormData] = useState(siteSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Supabase live configuration state
  const initialCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(initialCreds.url);
  const [supabaseKey, setSupabaseKey] = useState(initialCreds.key);
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [connectionNotice, setConnectionNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleConnectSupabase = async () => {
    setTestingConnection(true);
    setConnectionNotice(null);
    try {
      const res = await configureSupabase(supabaseUrl, supabaseKey);
      if (res.success) {
        setConnectionNotice({
          type: 'success',
          message: 'Connected to Supabase! You can now push all your local changes to the live site.',
        });
      } else {
        setConnectionNotice({
          type: 'error',
          message: res.message,
        });
      }
    } catch (err: any) {
      setConnectionNotice({
        type: 'error',
        message: err.message || 'Connection failed.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handlePushAll = async () => {
    setSyncingCloud(true);
    setConnectionNotice(null);
    try {
      const res = await pushAllToSupabase();
      if (res.success) {
        setConnectionNotice({
          type: 'success',
          message: res.message,
        });
      } else {
        setConnectionNotice({
          type: 'error',
          message: res.message,
        });
      }
    } catch (err: any) {
      setConnectionNotice({
        type: 'error',
        message: err.message || 'Push to Supabase failed.',
      });
    } finally {
      setSyncingCloud(false);
    }
  };

  const handlePullAll = async () => {
    setSyncingCloud(true);
    setConnectionNotice(null);
    try {
      const res = await pullFromSupabase();
      if (res.success) {
        setConnectionNotice({
          type: 'success',
          message: res.message,
        });
      } else {
        setConnectionNotice({
          type: 'error',
          message: res.message,
        });
      }
    } catch (err: any) {
      setConnectionNotice({
        type: 'error',
        message: err.message || 'Failed to pull from Supabase.',
      });
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleCopySqlSetup = () => {
    const sqlContent = `-- Run this in your Supabase SQL Editor:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID,
  name TEXT NOT NULL DEFAULT 'Anil Shrestha',
  profession TEXT NOT NULL DEFAULT 'Graphic Designer & UI/UX Specialist',
  headline TEXT NOT NULL DEFAULT 'Creative designer turning ideas into visual experiences.',
  short_bio TEXT,
  long_bio TEXT,
  location TEXT DEFAULT 'Pokhara, Nepal',
  email TEXT DEFAULT 'hello@anilshrestha.design',
  availability TEXT DEFAULT 'Available for Hire & Projects',
  profile_image_url TEXT,
  hero_heading TEXT,
  hero_description TEXT,
  primary_cta_label TEXT DEFAULT 'Explore My Work',
  primary_cta_url TEXT DEFAULT '/work',
  secondary_cta_label TEXT DEFAULT 'View Services',
  secondary_cta_url TEXT DEFAULT '/services',
  resume_url TEXT DEFAULT '/resume',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Brand Identity',
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  year TEXT NOT NULL DEFAULT '2026',
  client TEXT,
  role TEXT DEFAULT 'Lead Graphic Designer',
  services TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  challenge TEXT,
  solution TEXT,
  result TEXT,
  approach TEXT,
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  project_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'layout',
  custom_icon_url TEXT,
  deliverables TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Core Disciplines',
  custom_icon_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN NOT NULL DEFAULT false,
  location TEXT DEFAULT 'Nepal',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  custom_icon_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  dimensions TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  site_name TEXT NOT NULL DEFAULT 'Anil Shrestha Portfolio & CMS',
  ga_id TEXT,
  google_site_verification TEXT,
  contact_email TEXT DEFAULT 'hello@anilshrestha.design',
  allow_indexing BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  services TEXT,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and grant public access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Public Read Social" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Full Access Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Services" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Experience" ON public.experience FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Social" ON public.social_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Media" ON public.media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlContent);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <AdminLayout
      title="Settings & Live Cloud Sync"
      actionButton={
        <button
          type="submit"
          form="settings-form"
          className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/25"
        >
          {saveSuccess && <Check className="w-3.5 h-3.5 text-white" />}
          <span>{saveSuccess ? 'Saved ✓' : 'Save Settings'}</span>
        </button>
      }
    >
      <div className="space-y-8 max-w-4xl text-left">
        {/* Flash Message Banner */}
        {connectionNotice && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 shadow-sm ${
              connectionNotice.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/40 text-red-800 dark:text-red-300'
            }`}
          >
            {connectionNotice.type === 'success' ? (
              <Check className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold block">
                {connectionNotice.type === 'success' ? 'Cloud Sync Status' : 'Attention Required'}
              </span>
              <p className="leading-relaxed">{connectionNotice.message}</p>
            </div>
          </div>
        )}

        {/* 1. Supabase Cloud Sync Center (The Core Fix) */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Live Supabase & Public Site Synchronization
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your cloud database so any update made in this admin panel reflects everywhere in real-time.
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                isCloudConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isCloudConnected ? 'Cloud Active & Synced' : 'Local Storage Mode'}</span>
            </span>
          </div>

          {/* Connection inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                <span>Supabase Project URL</span>
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                <span>Supabase Anon / Public Key</span>
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={testingConnection || !supabaseUrl.trim() || !supabaseKey.trim()}
                onClick={handleConnectSupabase}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                {testingConnection ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Cloud className="w-3.5 h-3.5" />
                )}
                <span>{testingConnection ? 'Testing...' : 'Connect to Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySqlSetup}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">SQL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Supabase SQL Setup</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sync Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Data Synchronization Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Push all current projects, services, bio, and settings to Supabase so visitors on the live site see your newest changes instantly.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={syncingCloud || isLoading}
                onClick={handlePushAll}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                {syncingCloud ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>Push All Changes to Supabase & Live Site</span>
              </button>

              <button
                type="button"
                disabled={syncingCloud || isLoading}
                onClick={handlePullAll}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Pull from Cloud Database</span>
              </button>
            </div>
          </div>

          {/* Cloudflare Pages Environment Variable Notice */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-sky-300">
              <Cloud className="w-4 h-4" />
              <span>Hosting on Cloudflare Pages?</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              To guarantee that every public visitor across the globe automatically reads from Supabase on first page load, add these two Environment Variables in your <strong>Cloudflare Pages Dashboard &rarr; Project Settings &rarr; Environment variables</strong>:
            </p>
            <div className="font-mono text-[10px] space-y-1 bg-white/80 dark:bg-black/40 p-2.5 rounded-lg border border-blue-200/60 dark:border-white/10">
              <p>VITE_SUPABASE_URL = {supabaseUrl || 'https://your-project.supabase.co'}</p>
              <p>VITE_SUPABASE_ANON_KEY = {supabaseKey ? '••••••••••••••••••••••••' : 'your-anon-public-key'}</p>
            </div>
          </div>
        </div>

        {/* 2. General Site Configurations Form */}
        <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                Site Identity & Notifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Notification / Inquiries Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allow_indexing}
                    onChange={(e) =>
                      setFormData({ ...formData, allow_indexing: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Permit Search Engine Indexing (Google, Bing, robots.txt allow)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. Analytics & Search Console Integration */}
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                  Google Analytics 4 & Search Console
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={formData.ga_id || ''}
                  onChange={(e) => setFormData({ ...formData, ga_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Google Search Console Verification Token
                </label>
                <input
                  type="text"
                  value={formData.google_site_verification || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, google_site_verification: e.target.value })
                  }
                  placeholder="google-site-verification token"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              Save All Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
