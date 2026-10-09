import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Check, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { InlineImageUpload } from '../../components/admin/InlineImageUpload';

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
            <span className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2.5 py-1 rounded-md">
              Unsaved changes
            </span>
          )}
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-600/25"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : null}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Changes'}</span>
          </button>
        </div>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-left">
        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Profile and biography saved successfully. Live website updated.</span>
          </div>
        )}

        {/* Core Identity Section */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              1. Basic Identity & Contact
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Primary public identity attributes displayed across navigation, hero, and SEO headers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="prof-name" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-profession" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Profession / Discipline
              </label>
              <input
                id="prof-profession"
                type="text"
                name="profession"
                required
                value={formData.profession}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-location" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Location
              </label>
              <input
                id="prof-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Pokhara, Nepal"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-email" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Contact Email
              </label>
              <input
                id="prof-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="anil@shrestha.design"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="prof-headline" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
              Professional Headline
            </label>
            <input
              id="prof-headline"
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Creative designer turning ideas into visual experiences."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Narrative & Biography */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              2. Narrative & Biography Content
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Used across the dedicated About page and meta description tags.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="prof-short-bio" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Short Bio (Meta & Preview Snippet)
              </label>
              <textarea
                id="prof-short-bio"
                name="short_bio"
                rows={2}
                value={formData.short_bio}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-long-bio" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Full Biography (About Page Extended Story)
              </label>
              <textarea
                id="prof-long-bio"
                name="long_bio"
                rows={6}
                value={formData.long_bio}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Config */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              3. Homepage Hero Presentation
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Headline and subtext prominently visible on the landing hero section.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="prof-hero-heading" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Hero Headline (Leave blank to use default styled serif headline)
              </label>
              <input
                id="prof-hero-heading"
                type="text"
                name="hero_heading"
                value={formData.hero_heading || ''}
                onChange={handleChange}
                placeholder="Creative designer turning ideas into visual experiences"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-hero-desc" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Hero Supporting Paragraph
              </label>
              <textarea
                id="prof-hero-desc"
                name="hero_description"
                rows={3}
                value={formData.hero_description || ''}
                onChange={handleChange}
                placeholder="I craft meaningful visual identities, tactile packaging, and intuitive digital experiences with zero creative compromise."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Media & Resume Documents */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              4. Portrait Photo & Resume Assets
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Manage personal avatar photo and curriculum vitae download.
            </p>
          </div>

          <div className="space-y-5">
            <InlineImageUpload
              label="Portrait Photo"
              description="High-resolution personal portrait displayed across About, Hero, and Navigation. Automatically resized & compressed for fast loading."
              value={formData.profile_image_url}
              onChange={(url) => {
                setIsDirty(true);
                setFormData({ ...formData, profile_image_url: url });
              }}
              maxDimension={1200}
              previewHeightClass="h-40"
              placeholder="Upload portrait photo directly or paste image URL"
            />

            <div className="space-y-2">
              <label htmlFor="prof-resume-url" className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Curriculum Vitae / Resume PDF (Upload or Link)
              </label>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  id="prof-resume-url"
                  type="text"
                  name="resume_url"
                  value={formData.resume_url || ''}
                  onChange={handleChange}
                  placeholder="https://... or /resume.pdf"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
                />
                
                <label className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white rounded-xl cursor-pointer shrink-0 text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs">
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
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
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
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            {saving ? 'Updating...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
