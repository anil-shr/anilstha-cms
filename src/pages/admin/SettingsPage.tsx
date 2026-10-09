import React, { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { getSupabaseCredentials } from '../../lib/supabase';
import { InlineImageUpload } from '../../components/admin/InlineImageUpload';
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
  FileJson,
  Download,
  Upload,
  Eye,
  X,
  FileCheck,
  Home,
  Briefcase,
  User,
  Layers,
  Wrench,
  Sparkles,
  Mail,
  FileText,
  Image as ImageIcon,
  Sliders,
  Monitor,
  Palette,
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
    projects,
    services,
    skills,
    experience,
    socialLinks,
    media,
    profile,
    createDatabaseSnapshot,
    restoreDatabaseSnapshot,
  } = useData();

  const [formData, setFormData] = useState(siteSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedPageMetaPath, setSelectedPageMetaPath] = useState('/');

  useEffect(() => {
    setFormData(siteSettings);
  }, [siteSettings]);

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

  // Manual Database Snapshot State
  const [snapshotSuccess, setSnapshotSuccess] = useState<string | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [copiedPreview, setCopiedPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadSnapshot = () => {
    setIsExporting(true);
    setSnapshotSuccess(null);
    setSnapshotError(null);
    try {
      const snapshot = createDatabaseSnapshot();
      const jsonString = JSON.stringify(snapshot, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
      const fileName = `anil-portfolio-snapshot-${dateStr}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const sizeKb = (blob.size / 1024).toFixed(1);
      setSnapshotSuccess(
        `Database snapshot "${fileName}" (${sizeKb} KB) successfully downloaded! Contains ${snapshot.stats.projectsCount} projects, ${snapshot.stats.servicesCount} services, and current portfolio state.`
      );
    } catch (err: any) {
      setSnapshotError(err.message || 'Failed to generate snapshot');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreviewSnapshot = () => {
    try {
      const snapshot = createDatabaseSnapshot();
      setPreviewContent(JSON.stringify(snapshot, null, 2));
      setShowJsonPreview(true);
    } catch (err: any) {
      setSnapshotError(err.message || 'Failed to preview snapshot');
    }
  };

  const handleImportSnapshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSnapshotSuccess(null);
    setSnapshotError(null);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        const res = await restoreDatabaseSnapshot(parsed);
        if (res.success) {
          setSnapshotSuccess(res.message);
        } else {
          setSnapshotError(res.message);
        }
      } catch (err: any) {
        setSnapshotError(`Invalid JSON snapshot file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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

        {/* Database Snapshot & State Backup (Manual Database Snapshot feature to back up current portfolio state to JSON file) */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Manual Database Snapshot & Backup
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-blue-800/40">
                  JSON Export
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download a complete, offline JSON snapshot of your current portfolio state (projects, services, profile, skills, experience, media metadata, and settings) for disaster recovery and version backups.
              </p>
            </div>
          </div>

          {/* Snapshot Feedback Notices */}
          {snapshotSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <FileCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <p className="leading-relaxed font-medium">{snapshotSuccess}</p>
              </div>
              <button
                type="button"
                onClick={() => setSnapshotSuccess(null)}
                className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {snapshotError && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-relaxed font-medium">{snapshotError}</p>
              </div>
              <button
                type="button"
                onClick={() => setSnapshotError(null)}
                className="text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Current State Content Summary Pills */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block">
              Entities Included in Snapshot
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
                  {projects.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Projects</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
                  {services.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Services</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
                  {skills.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Skills</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
                  {experience.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Experience</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
                  {media.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Media Files</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
                <span className="text-xl font-mono font-bold text-slate-900 dark:text-white block">
                  {socialLinks.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Social Links</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadSnapshot}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Download JSON Snapshot'}</span>
            </button>

            <button
              type="button"
              onClick={handlePreviewSnapshot}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Raw JSON</span>
            </button>

            {/* Hidden file input for restore */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleImportSnapshot}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              title="Restore state from an earlier exported JSON snapshot"
            >
              <Upload className="w-4 h-4" />
              <span>Restore from Snapshot (.json)</span>
            </button>
          </div>
        </div>

        {/* JSON Snapshot Raw Preview Modal */}
        {showJsonPreview && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/15 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Database Snapshot Payload Preview
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(previewContent);
                      setCopiedPreview(true);
                      setTimeout(() => setCopiedPreview(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPreview ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJsonPreview(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs rounded-b-xl">
                <pre>{previewContent}</pre>
              </div>
            </div>
          </div>
        )}

        {/* 2. Brand Logo & Favicon Customization Form */}
        <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Logo & Monogram Options */}
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                    Brand Logo & Monogram Customization
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Upload your primary brand logo or customize the monogram initials displayed in the public header and admin dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-4">
                <InlineImageUpload
                  label="Primary Site Logo"
                  description="Upload SVG, PNG, or WebP. Automatically resized and optimized for high-DPI displays."
                  value={formData.logo_url || ''}
                  onChange={(url) => setFormData({ ...formData, logo_url: url })}
                  maxDimension={600}
                  previewHeightClass="h-28"
                  placeholder="Upload logo directly or paste image URL"
                />

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    Fallback Monogram Initials / Text
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.logo_text || ''}
                    onChange={(e) => setFormData({ ...formData, logo_text: e.target.value })}
                    placeholder="AS"
                    className="w-32 px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none uppercase font-bold text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Displayed in circle when no logo photo is uploaded (default: "AS").
                  </span>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Live Navigation Bar Preview
                </span>
                <div className="space-y-2.5 p-4 rounded-xl bg-slate-100/70 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                  {/* Light theme preview */}
                  <div className="p-2.5 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center gap-3">
                    {formData.logo_url ? (
                      <img
                        src={formData.logo_url}
                        alt="Logo Preview"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                        {formData.logo_text || 'AS'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {formData.fav_name || profile.name || 'Anil Shrestha'}
                      </span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                        Light Mode Header
                      </span>
                    </div>
                  </div>

                  {/* Dark theme preview */}
                  <div className="p-2.5 rounded-full bg-[#18181b] border border-white/10 shadow-xs flex items-center gap-3">
                    {formData.logo_url ? (
                      <img
                        src={formData.logo_url}
                        alt="Logo Preview"
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white text-[#111111] flex items-center justify-center font-bold text-xs">
                        {formData.logo_text || 'AS'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white truncate block">
                        {formData.fav_name || profile.name || 'Anil Shrestha'}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                        Dark Mode Header
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Favicon & Browser Tab Title Customization */}
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                  Favicon & Browser Tab Branding
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Customize the browser tab icon and title displayed on bookmarks and visitor browser windows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InlineImageUpload
                  label="Favicon File"
                  description="Upload custom favicon (ICO, PNG, or SVG). Automatically applied to HTML head."
                  value={formData.fav_icon_url || ''}
                  onChange={(url) => setFormData({ ...formData, fav_icon_url: url })}
                  accept="image/x-icon,image/png,image/svg+xml,image/webp"
                  maxDimension={256}
                  previewHeightClass="h-20"
                  placeholder="Upload favicon or paste icon URL"
                />

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    Browser Tab Brand Name (Favicon / Title Name)
                  </label>
                  <input
                    type="text"
                    value={formData.fav_name || ''}
                    onChange={(e) => setFormData({ ...formData, fav_name: e.target.value })}
                    placeholder="Anil Shrestha Portfolio & CMS"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Used as the default browser tab title and OpenGraph site name.
                  </span>
                </div>
              </div>

              {/* Realistic Browser Tab Mockup Preview */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Browser Tab Live Simulation
                </span>
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="bg-slate-200 dark:bg-[#252526] rounded-t-lg p-1.5 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div className="ml-2 px-3 py-1 bg-white dark:bg-[#1e1e1e] rounded-t-md text-[11px] font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2 max-w-[220px] truncate shadow-xs">
                      {formData.fav_icon_url ? (
                        <img
                          src={formData.fav_icon_url}
                          alt="Favicon"
                          className="w-3.5 h-3.5 shrink-0 object-contain"
                        />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded bg-blue-600 text-[8px] text-white flex items-center justify-center font-bold shrink-0">
                          AS
                        </div>
                      )}
                      <span className="truncate">
                        {formData.fav_name || formData.site_name || 'Anil Shrestha Portfolio'}
                      </span>
                      <X className="w-3 h-3 text-slate-400 shrink-0 ml-auto" />
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1e1e1e] rounded-b-lg border-t border-slate-200/50 dark:border-white/5 text-center text-[10px] text-slate-400">
                    Live browser tab icon and title update dynamically on save.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Per-Page Metadata Text & Metadata Photo Customization */}
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 dark:border-white/10 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                    Per-Page Metadata & Social Share Photos (SEO)
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Customize the title, meta description text, and OpenGraph social share photo for every page individually.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-blue-800/40 self-start sm:self-auto">
                8 Custom Routes
              </span>
            </div>

            {/* Page Tab Selector */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
              {[
                { path: '/', label: 'Home (/)', icon: Home },
                { path: '/work', label: 'Work & Projects', icon: Briefcase },
                { path: '/about', label: 'About Story', icon: User },
                { path: '/services', label: 'Services', icon: Layers },
                { path: '/skills', label: 'Skills & Tools', icon: Wrench },
                { path: '/arcade', label: 'Arcade & Date Converter', icon: Sparkles },
                { path: '/contact', label: 'Contact', icon: Mail },
                { path: '/resume', label: 'Resume / CV', icon: FileText },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = selectedPageMetaPath === p.path;
                const hasCustom = Boolean(
                  formData.page_meta?.[p.path]?.title ||
                    formData.page_meta?.[p.path]?.description ||
                    formData.page_meta?.[p.path]?.og_image
                );
                return (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => setSelectedPageMetaPath(p.path)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.label}</span>
                    {hasCustom && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Page Metadata Editor */}
            {(() => {
              const currentMeta = formData.page_meta?.[selectedPageMetaPath] || {};
              const pageDefaults: Record<string, { title: string; desc: string }> = {
                '/': {
                  title: 'Anil Shrestha — Graphic Designer & UI/UX Specialist | Pokhara, Nepal',
                  desc: 'Portfolio of Anil Shrestha, a multidisciplinary graphic designer and UI/UX specialist from Pokhara, Nepal crafting brand identities, mobile interfaces, and print collateral.',
                },
                '/work': {
                  title: 'Selected Works & Case Studies — Anil Shrestha Design',
                  desc: 'Explore selected graphic design, branding systems, mobile apps, and packaging case studies by Anil Shrestha.',
                },
                '/about': {
                  title: 'About Anil Shrestha — Creative Vision & Design Philosophy',
                  desc: 'Learn about Anil Shrestha, 3–5 years experienced graphic designer & UI/UX specialist based in Pokhara, Nepal.',
                },
                '/services': {
                  title: 'Design Capabilities & Creative Services — Anil Shrestha',
                  desc: 'Comprehensive design services including Brand Identity, UI/UX Mobile & Web, Print & Packaging, and Marketing Collateral.',
                },
                '/skills': {
                  title: 'Technical Proficiencies & Design Tools — Anil Shrestha',
                  desc: 'Mastered design tools and disciplines: Figma, Adobe Illustrator, Photoshop, InDesign, typography, layout, and UI systems.',
                },
                '/arcade': {
                  title: 'Interactive Designer Arcade & Tools — Anil Shrestha',
                  desc: 'Interactive designer arcade featuring Chrome Dino Runner with classic/minimal/retro/cyberpunk themes, Snake Game, Color Palette Generator, and Nepal BS Date Converter.',
                },
                '/contact': {
                  title: 'Contact & Project Inquiries — Anil Shrestha Design Studio',
                  desc: 'Get in touch with Anil Shrestha for freelance projects, full-time opportunities, branding consultations, and creative collaborations.',
                },
                '/resume': {
                  title: 'Professional Resume & Career Timeline — Anil Shrestha',
                  desc: 'View the complete professional curriculum vitae of Anil Shrestha, Lead Graphic Designer & UI/UX Specialist.',
                },
              };

              const activeDefault = pageDefaults[selectedPageMetaPath] || pageDefaults['/'];
              const activeTitle = currentMeta.title !== undefined ? currentMeta.title : activeDefault.title;
              const activeDesc = currentMeta.description !== undefined ? currentMeta.description : activeDefault.desc;
              const activeOgImage = currentMeta.og_image || '/src/assets/images/anil_portrait_1791182391937.jpg';

              const updateActiveMeta = (field: 'title' | 'description' | 'og_image', val: string) => {
                setFormData((prev) => ({
                  ...prev,
                  page_meta: {
                    ...(prev.page_meta || {}),
                    [selectedPageMetaPath]: {
                      ...(prev.page_meta?.[selectedPageMetaPath] || {}),
                      [field]: val,
                    },
                  },
                }));
              };

              return (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Controls */}
                    <div className="space-y-4">
                      {/* Meta Title */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                            Meta Page Title
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {activeTitle.length} chars (opt. 50-60)
                          </span>
                        </div>
                        <input
                          type="text"
                          value={activeTitle}
                          onChange={(e) => updateActiveMeta('title', e.target.value)}
                          placeholder={activeDefault.title}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                            Meta Description Text
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {activeDesc.length} chars (opt. 120-160)
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={activeDesc}
                          onChange={(e) => updateActiveMeta('description', e.target.value)}
                          placeholder={activeDefault.desc}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100 resize-y"
                        />
                      </div>

                      {/* Reset to Default */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const next = { ...(prev.page_meta || {}) };
                            delete next[selectedPageMetaPath];
                            return { ...prev, page_meta: next };
                          });
                        }}
                        className="text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 underline cursor-pointer"
                      >
                        Reset this page to default SEO settings
                      </button>
                    </div>

                    {/* Metadata Photo (OG Image) with direct Inline Upload */}
                    <div className="space-y-4">
                      <InlineImageUpload
                        label={`Metadata Photo for "${selectedPageMetaPath}"`}
                        description="Social media preview image (Facebook, Twitter cards, LinkedIn, WhatsApp). Automatically compressed for fast loading."
                        value={currentMeta.og_image || ''}
                        onChange={(url) => updateActiveMeta('og_image', url)}
                        maxDimension={1200}
                        previewHeightClass="h-32"
                        placeholder="Upload social preview photo directly or paste image URL"
                      />
                    </div>
                  </div>

                  {/* Live Google Search & Social Card Simulation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Google SERP Preview */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                        Google Search Snippet Preview
                      </span>
                      <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                        https://anilshrestha11.com.np{selectedPageMetaPath === '/' ? '' : selectedPageMetaPath}
                      </div>
                      <div className="text-sm font-semibold text-blue-700 dark:text-sky-400 hover:underline cursor-pointer line-clamp-1">
                        {activeTitle}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {activeDesc}
                      </div>
                    </div>

                    {/* Social Share Card Preview */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                        Social Share Card (Twitter / LinkedIn / WhatsApp)
                      </span>
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212]">
                        <div className="aspect-[1.91/1] w-full bg-slate-200 dark:bg-black/50 overflow-hidden">
                          <img
                            src={activeOgImage}
                            alt="Social Share"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="p-2.5 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block truncate">
                            anilshrestha11.com.np
                          </span>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {activeTitle}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {activeDesc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Site Identity & Email Notifications */}
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

          {/* Analytics & Search Console Integration */}
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
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              {saveSuccess && <Check className="w-3.5 h-3.5 text-white" />}
              <span>{saveSuccess ? 'All Settings Saved!' : 'Save All Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
