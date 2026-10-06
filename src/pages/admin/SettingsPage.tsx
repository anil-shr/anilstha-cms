import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Check, ShieldCheck, Database, Globe } from 'lucide-react';

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
      title="Site Settings & Integrations"
      actionButton={
        <button
          type="submit"
          form="settings-form"
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          {saveSuccess && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{saveSuccess ? 'Saved ✓' : 'Save Settings'}</span>
        </button>
      }
    >
      <form id="settings-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Settings updated successfully.</span>
          </div>
        )}

        {/* Database & Cloud Connection Status */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#DEDEDA] pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#111111]" />
              <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
                Supabase & PostgreSQL Status
              </h2>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 border ${
                isCloudConnected
                  ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                  : 'border-amber-300 text-amber-800 bg-amber-50'
              }`}
            >
              {isCloudConnected ? 'Connected & Synced' : 'Local Storage Mode'}
            </span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed">
            {isCloudConnected
              ? 'Your application is connected directly to Supabase PostgreSQL and Storage. Row Level Security policies enforce read-only public access and authenticated admin mutations.'
              : 'Running in Local Storage Mode. All project edits, profile changes, and media uploads persist in browser memory across sessions. To link your cloud Supabase database, supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your environment.'}
          </p>
        </div>

        {/* General Site Configurations */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              General Site Metadata
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Site Name
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Notification / Inquiries Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allow_indexing}
                  onChange={(e) =>
                    setFormData({ ...formData, allow_indexing: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#111111]"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Permit Search Engine Indexing (robots.txt Allow)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Analytics & Search Console Integration */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#111111]" />
              <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
                Google Analytics 4 & Search Console
              </h2>
            </div>
            <p className="text-[11px] text-[#6B6B6B]">
              Configure your measurement and verification keys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                value={formData.ga_id || ''}
                onChange={(e) => setFormData({ ...formData, ga_id: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
              <span className="text-[11px] text-[#888888] block">
                Operates strictly with user consent (Google Consent Mode v2).
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Google Search Console Verification
              </label>
              <input
                type="text"
                value={formData.google_site_verification || ''}
                onChange={(e) =>
                  setFormData({ ...formData, google_site_verification: e.target.value })
                }
                placeholder="google-site-verification token"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
