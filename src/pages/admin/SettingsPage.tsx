import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Check, Database, Globe, Cloud, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { siteSettings, updateSiteSettings, isCloudConnected } = useData();

  const [formData, setFormData] = useState(siteSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <AdminLayout
      title="Site Settings & Cloudflare Integration"
      actionButton={
        <button
          type="submit"
          form="settings-form"
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          {saveSuccess && <Check className="w-3.5 h-3.5 text-white" />}
          <span>{saveSuccess ? 'Saved ✓' : 'Save Settings'}</span>
        </button>
      }
    >
      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-left">
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Settings updated and saved successfully.</span>
          </div>
        )}

        {/* Database & Cloud Connection Status */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
                Global Cross-Device Sync (Supabase PostgreSQL)
              </h2>
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                isCloudConnected
                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40'
                  : 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-sky-300 dark:border-blue-800/40'
              }`}
            >
              {isCloudConnected ? 'Cloud Active & Synced' : 'Local Storage Mode'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isCloudConnected
              ? 'Your portfolio is synced with Supabase PostgreSQL and Realtime. Any change made in this admin panel from your phone, laptop, or any computer immediately updates the live site across the world.'
              : 'Currently operating in Local Storage Mode (browser memory). To enable full global sync so you can log into /admin from any device anywhere in the world and update the site live, add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Cloudflare Pages environment variables.'}
          </p>

          <div className="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="font-mono text-[11px]">Database Schema file: /supabase/migrations/20261005_init.sql</span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Ready for Supabase SQL Editor</span>
          </div>
        </div>

        {/* General Site Configurations */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              General Site Metadata & Notifications
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
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
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
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
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
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
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
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-slate-100"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Operates strictly with user consent (Google Consent Mode v2).
              </span>
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
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
