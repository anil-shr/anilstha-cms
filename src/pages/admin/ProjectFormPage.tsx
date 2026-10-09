import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { useRouter, Link } from '../../lib/router';
import { Project } from '../../types/database';
import {
  ArrowLeft,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  Plus,
  UploadCloud,
} from 'lucide-react';
import { InlineImageUpload } from '../../components/admin/InlineImageUpload';
import { optimizeImageFile } from '../../lib/imageOptimizer';

export const ProjectFormPage: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const { projects, saveProject, media } = useData();
  const { navigate } = useRouter();

  const isEdit = Boolean(projectId && projectId !== 'new');
  const existingProject = isEdit
    ? projects.find((p) => p.id === projectId || p.slug === projectId)
    : null;

  const [formData, setFormData] = useState<Project>({
    id: projectId && projectId !== 'new' ? projectId : 'proj-' + Date.now(),
    title: '',
    slug: '',
    category: 'Brand Identity',
    year: '2026',
    client: '',
    description: '',
    cover_image_url: '/src/assets/images/project_himalayan_crafts.png',
    alt_text: '',
    gallery_urls: [],
    challenge: '',
    solution: '',
    result: '',
    services: ['Brand Identity'],
    tools: ['Adobe Illustrator'],
    featured: false,
    published: true,
    sort_order: projects.length + 1,
    seo_title: '',
    seo_description: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newService, setNewService] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (existingProject) {
      setFormData(existingProject);
      setIsDirty(false);
    }
  }, [existingProject]);

  // Unsaved changes browser warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved project changes.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setIsDirty(true);
    setSaveSuccess(false);

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setIsDirty(true);
    setSaveSuccess(false);
    if (!isEdit && (!formData.slug || formData.slug === generateSlug(formData.title))) {
      setFormData({
        ...formData,
        title: newTitle,
        slug: generateSlug(newTitle),
      });
    } else {
      setFormData({ ...formData, title: newTitle });
    }
  };

  const handleAddService = () => {
    if (!newService.trim()) return;
    setIsDirty(true);
    setFormData({
      ...formData,
      services: [...formData.services, newService.trim()],
    });
    setNewService('');
  };

  const handleRemoveService = (idx: number) => {
    setIsDirty(true);
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== idx),
    });
  };

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    setIsDirty(true);
    setFormData({
      ...formData,
      tools: [...formData.tools, newTool.trim()],
    });
    setNewTool('');
  };

  const handleRemoveTool = (idx: number) => {
    setIsDirty(true);
    setFormData({
      ...formData,
      tools: formData.tools.filter((_, i) => i !== idx),
    });
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setIsDirty(true);
    setFormData({
      ...formData,
      gallery_urls: [...(formData.gallery_urls || []), newGalleryUrl.trim()],
    });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setIsDirty(true);
    setFormData({
      ...formData,
      gallery_urls: formData.gallery_urls.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Project title is required.');
      return;
    }

    const cleanSlug = generateSlug(formData.slug || formData.title);
    if (!cleanSlug) {
      setErrorMessage('A valid URL slug is required.');
      return;
    }

    // Slug uniqueness check
    const duplicate = projects.find(
      (p) => p.slug === cleanSlug && p.id !== formData.id
    );
    if (duplicate) {
      setErrorMessage(`The slug "${cleanSlug}" is already used by another project.`);
      return;
    }

    setSaving(true);
    try {
      const payload: Project = {
        ...formData,
        slug: cleanSlug,
        updated_at: new Date().toISOString(),
      };

      await saveProject(payload);
      setIsDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

      if (!isEdit) {
        navigate(`/admin/projects/${payload.id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit: ${formData.title || 'Untitled'}` : 'New Project'}
      actionButton={
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            form="project-form"
            disabled={saving}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : null}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Project'}</span>
          </button>
        </div>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-left">
        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Project changes saved and synced to the portfolio.</span>
          </div>
        )}

        {/* 1. Core Metadata */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              1. Title & URL Slug
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Defines the project identifier and SEO-friendly permalink.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Himalayan Heritage Crafts"
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                URL Slug (/work/[slug]) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="himalayan-heritage-crafts"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="Brand Identity">Brand Identity</option>
                <option value="Poster & Visual Communication">Poster & Visual Communication</option>
                <option value="Editorial & Book Design">Editorial & Book Design</option>
                <option value="Packaging Design">Packaging Design</option>
                <option value="Digital & Content Design">Digital & Content Design</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Client (Optional)
              </label>
              <input
                type="text"
                name="client"
                value={formData.client || ''}
                onChange={handleChange}
                placeholder="e.g. Kathmandu Jazz Collective"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Short Description / Overview
              </label>
              <textarea
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Concise overview of the project brief and design intent..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* 2. Visual Media: Cover & Gallery */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              2. Cover Image & Gallery
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Upload photos directly here, auto-optimized for faster page loading and crisp display.
            </p>
          </div>

          <div className="space-y-6">
            <InlineImageUpload
              label="Cover Image"
              description="Primary project cover banner (automatically resized & compressed to WebP/JPEG for fast load)."
              value={formData.cover_image_url}
              onChange={(url) => {
                setIsDirty(true);
                setFormData({ ...formData, cover_image_url: url });
              }}
              altText={formData.alt_text}
              onAltChange={(alt) => {
                setIsDirty(true);
                setFormData({ ...formData, alt_text: alt });
              }}
              maxDimension={1920}
              placeholder="Upload photo directly or paste image URL"
            />

            {/* Gallery URLs */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    Additional Gallery Presentation Plates ({formData.gallery_urls?.length || 0})
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Add detail shots, mobile layouts, packaging dielines, and collateral.
                  </p>
                </div>

                {/* Direct Upload Plate Button */}
                <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Plate Directly</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const opt = await optimizeImageFile(file, { maxDimension: 1920 });
                        setIsDirty(true);
                        setFormData((prev) => ({
                          ...prev,
                          gallery_urls: [...(prev.gallery_urls || []), opt.dataUrl],
                        }));
                      } catch (err) {
                        console.error('Gallery plate upload failed:', err);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="Or paste external image URL..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 rounded-xl shadow-xs cursor-pointer border border-slate-200 dark:border-white/10"
                >
                  Add Link
                </button>
              </div>

              {formData.gallery_urls && formData.gallery_urls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {formData.gallery_urls.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video rounded-xl overflow-hidden bg-black/10 dark:bg-black/50 border border-slate-200 dark:border-white/10 shadow-xs"
                    >
                      <img
                        src={url}
                        alt={`Plate ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                        <span className="text-[10px] font-mono text-white truncate max-w-[80px]">
                          Plate #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                          title="Remove plate"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Narrative Breakdown (Challenge, Solution, Result) */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              3. Case Study Narrative
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Only non-empty fields will be displayed on the project page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                The Challenge
              </label>
              <textarea
                name="challenge"
                rows={3}
                value={formData.challenge || ''}
                onChange={handleChange}
                placeholder="What was the problem or communication constraint?"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Design Solution
              </label>
              <textarea
                name="solution"
                rows={3}
                value={formData.solution || ''}
                onChange={handleChange}
                placeholder="How did you resolve it through typography, form, and substrate?"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Outcome & Impact (Optional)
              </label>
              <textarea
                name="result"
                rows={3}
                value={formData.result || ''}
                onChange={handleChange}
                placeholder="Exhibition response, print run, or client deliverable status..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* 4. Services, Tools & External Link */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              4. Deliverables & Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Services Tags */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Services Provided
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. Packaging Design"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-3.5 py-2 text-xs font-bold uppercase text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-lg"
                  >
                    <span>{srv}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tools Tags */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Tools Used
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="e.g. Adobe InDesign"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTool}
                  className="px-3.5 py-2 text-xs font-bold uppercase text-white bg-blue-600 hover:bg-blue-500 rounded-xl cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.tools.map((tl, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-lg"
                  >
                    <span>{tl}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(idx)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Live External URL (Optional)
              </label>
              <input
                type="url"
                name="project_url"
                value={formData.project_url || ''}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 5. Publishing Status & SEO */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-white/10 pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              5. Publishing & SEO Tags
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Published (Visible to public visitors)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Feature on Homepage Grid
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  SEO Custom Title
                </label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title || ''}
                  onChange={handleChange}
                  placeholder="Defaults to Project Title — Anil Shrestha"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  SEO Description
                </label>
                <input
                  type="text"
                  name="seo_description"
                  value={formData.seo_description || ''}
                  onChange={handleChange}
                  placeholder="Defaults to project description"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
