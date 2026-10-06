import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Check, AlertCircle, RefreshCw, FileText } from 'lucide-react';

export const ProfileEditorPage: React.FC = () => {
  const { profile, updateProfile, media } = useData();

  const [formData, setFormData] = useState(profile);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData(profile);
    setIsDirty(false);
  }, [profile]);

  // Unsaved changes browser guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved profile changes.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setIsDirty(true);
    setSaveSuccess(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      const ok = await updateProfile(formData);
      if (ok) {
        setIsDirty(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMessage('Failed to update profile. Please verify your connection.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Profile & Biography Editor"
      actionButton={
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1">
              Unsaved changes
            </span>
          )}
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Changes'}</span>
          </button>
        </div>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Profile and biography saved successfully. Live website updated.</span>
          </div>
        )}

        {/* Core Identity Section */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              1. Basic Identity & Contact
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              Primary public identity attributes displayed across navigation, hero, and SEO headers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Profession / Discipline
              </label>
              <input
                type="text"
                name="profession"
                required
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kathmandu, Nepal"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Primary Inquiry Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Availability Status Indicator
              </label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="e.g. Available for selected projects"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              2. Hero Section & Call-to-Actions
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              Controls the initial impact on the homepage.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Hero Heading Wordmark
              </label>
              <input
                type="text"
                name="hero_heading"
                value={formData.hero_heading}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Hero Statement / Intent
              </label>
              <textarea
                name="hero_description"
                rows={3}
                value={formData.hero_description}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  name="primary_cta_label"
                  value={formData.primary_cta_label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Primary CTA Destination URL
                </label>
                <input
                  type="text"
                  name="primary_cta_url"
                  value={formData.primary_cta_url}
                  onChange={handleChange}
                  placeholder="/work"
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  name="secondary_cta_label"
                  value={formData.secondary_cta_label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Secondary CTA Destination URL
                </label>
                <input
                  type="text"
                  name="secondary_cta_url"
                  value={formData.secondary_cta_url}
                  onChange={handleChange}
                  placeholder="/contact"
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Biography & Philosophy */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              3. Biography & Design Philosophy
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              In-depth copy displayed on the About page and footer.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Short Introduction (1–2 sentences)
              </label>
              <textarea
                name="short_bio"
                rows={2}
                value={formData.short_bio}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Comprehensive Biography / Philosophy
              </label>
              <textarea
                name="long_bio"
                rows={5}
                value={formData.long_bio}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* Images & Resume Assets */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              4. Media Assets & Curriculum Vitae
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              Provide links or pick from your uploaded Media Library.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Profile Portrait Image URL
              </label>
              <input
                type="text"
                name="profile_image_url"
                value={formData.profile_image_url}
                onChange={handleChange}
                placeholder="/src/assets/images/... or https://..."
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
              {media.length > 0 && (
                <div className="pt-1 flex items-center gap-2 text-[11px] text-[#6B6B6B]">
                  <span>Quick select:</span>
                  {media.slice(0, 3).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setIsDirty(true);
                        setFormData({ ...formData, profile_image_url: m.url });
                      }}
                      className="underline hover:text-[#111111]"
                    >
                      {m.filename}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] dark:text-white block">
                Curriculum Vitae / Resume PDF (Upload or Link)
              </label>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  name="resume_url"
                  value={formData.resume_url || ''}
                  onChange={handleChange}
                  placeholder="https://... or /resume.pdf"
                  className="flex-1 px-3 py-2 text-xs bg-[#F7F7F5] dark:bg-[#12141c] border border-[#DEDEDA] dark:border-white/10 focus:border-blue-500 focus:outline-none font-mono"
                />
                
                <label className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer shrink-0 text-center flex items-center justify-center gap-1.5 transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Upload PDF File</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        if (dataUrl) {
                          setIsDirty(true);
                          setFormData((prev) => ({ ...prev, resume_url: dataUrl }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              {formData.resume_url && (
                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                  <span>Current resume configured:</span>
                  <span className="font-mono text-blue-600 dark:text-sky-400 truncate max-w-xs">
                    {formData.resume_url.startsWith('data:') ? 'Custom uploaded PDF document' : formData.resume_url}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDirty(true);
                      setFormData((prev) => ({ ...prev, resume_url: '' }));
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors cursor-pointer"
          >
            {saving ? 'Updating...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
