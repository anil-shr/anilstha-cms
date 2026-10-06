import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { Project } from '../../types/database';
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  X,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export const ProjectFormPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const { projects, saveProject, media } = useData();

  const isEdit = Boolean(params.id);
  const existingProject = isEdit ? projects.find((p) => p.id === params.id) : null;

  const [formData, setFormData] = useState<Project>(() => {
    if (existingProject) return existingProject;
    return {
      id: 'proj-' + Date.now(),
      title: '',
      slug: '',
      category: 'Brand Identity',
      description: '',
      year: new Date().getFullYear().toString(),
      client: '',
      role: 'Lead Graphic Designer',
      services: ['Brand Identity', 'Typography System'],
      tools: ['Adobe Illustrator', 'Adobe InDesign'],
      challenge: '',
      solution: '',
      result: '',
      cover_image_url: '',
      gallery_urls: [],
      project_url: '',
      featured: false,
      published: true,
      sort_order: projects.length + 1,
      seo_title: '',
      seo_description: '',
      og_image_url: '',
      alt_text: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New tag inputs
  const [newService, setNewService] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (existingProject) {
      setFormData(existingProject);
      setIsDirty(false);
    }
  }, [existingProject]);

  // Unsaved changes browser prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes to this project.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Helper to slugify title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setIsDirty(true);
    setSaveSuccess(false);
    if (!isEdit || !formData.slug) {
      setFormData({
        ...formData,
        title: titleVal,
        slug: generateSlug(titleVal),
      });
    } else {
      setFormData({ ...formData, title: titleVal });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setIsDirty(true);
    setSaveSuccess(false);
    const target = e.target;
    const value =
      target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleAddService = () => {
    if (!newService.trim()) return;
    setIsDirty(true);
    setFormData({
      ...formData,
      services: [...(formData.services || []), newService.trim()],
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
      tools: [...(formData.tools || []), newTool.trim()],
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
            className="px-3 py-1.5 text-xs text-[#6B6B6B] hover:text-[#111111] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            form="project-form"
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : null}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Project'}</span>
          </button>
        </div>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Project changes saved and synced to the portfolio.</span>
          </div>
        )}

        {/* 1. Core Metadata */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              1. Title & URL Slug
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              Defines the project identifier and SEO-friendly permalink.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Himalayan Heritage Crafts"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                URL Slug (/work/[slug]) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="himalayan-heritage-crafts"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              >
                <option value="Brand Identity">Brand Identity</option>
                <option value="Poster & Visual Communication">Poster & Visual Communication</option>
                <option value="Editorial & Book Design">Editorial & Book Design</option>
                <option value="Packaging Design">Packaging Design</option>
                <option value="Digital & Content Design">Digital & Content Design</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="2026"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Client (Optional)
              </label>
              <input
                type="text"
                name="client"
                value={formData.client || ''}
                onChange={handleChange}
                placeholder="e.g. Kathmandu Jazz Collective"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Short Description / Overview
              </label>
              <textarea
                name="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Concise overview of the project brief and design intent..."
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* 2. Visual Media: Cover & Gallery */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              2. Cover Image & Gallery
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              Enter direct image paths or select from your uploaded media library.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Cover Image URL
              </label>
              <input
                type="text"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={handleChange}
                placeholder="/src/assets/images/... or https://..."
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
              {media.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#6B6B6B]">
                  <span>Insert from Media Library:</span>
                  {media.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setIsDirty(true);
                        setFormData({ ...formData, cover_image_url: m.url });
                      }}
                      className="underline hover:text-[#111111]"
                    >
                      {m.filename}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Cover Image Alt Text
              </label>
              <input
                type="text"
                name="alt_text"
                value={formData.alt_text || ''}
                onChange={handleChange}
                placeholder="Descriptive explanation for accessibility"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            {/* Gallery URLs */}
            <div className="pt-4 border-t border-[#EAEAE6] space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Additional Gallery Presentation Plates
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-3 py-1.5 text-xs font-semibold uppercase text-white bg-[#111111] hover:bg-[#333333]"
                >
                  Add Image
                </button>
              </div>

              {formData.gallery_urls && formData.gallery_urls.length > 0 && (
                <div className="space-y-2 pt-2">
                  {formData.gallery_urls.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#F7F7F5] border border-[#DEDEDA] text-xs font-mono"
                    >
                      <span className="truncate max-w-lg">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Narrative Breakdown (Challenge, Solution, Result) */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              3. Case Study Narrative
            </h2>
            <p className="text-[11px] text-[#6B6B6B]">
              Only non-empty fields will be displayed on the project page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                The Challenge
              </label>
              <textarea
                name="challenge"
                rows={3}
                value={formData.challenge || ''}
                onChange={handleChange}
                placeholder="What was the problem or communication constraint?"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Design Solution
              </label>
              <textarea
                name="solution"
                rows={3}
                value={formData.solution || ''}
                onChange={handleChange}
                placeholder="How did you resolve it through typography, form, and substrate?"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Outcome & Impact (Optional)
              </label>
              <textarea
                name="result"
                rows={3}
                value={formData.result || ''}
                onChange={handleChange}
                placeholder="Exhibition response, print run, or client deliverable status..."
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>

        {/* 4. Services, Tools & External Link */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              4. Deliverables & Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Services Tags */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Services Provided
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. Packaging Design"
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-3 py-1.5 text-xs font-semibold uppercase text-white bg-[#111111]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#F7F7F5] border border-[#DEDEDA] text-[#111111]"
                  >
                    <span>{srv}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="text-[#888888] hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tools Tags */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Tools Used
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="e.g. Adobe InDesign"
                  className="flex-1 px-3 py-1.5 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTool}
                  className="px-3 py-1.5 text-xs font-semibold uppercase text-white bg-[#111111]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.tools.map((tl, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#F7F7F5] border border-[#DEDEDA] text-[#111111]"
                  >
                    <span>{tl}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(idx)}
                      className="text-[#888888] hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Live External URL (Optional)
              </label>
              <input
                type="url"
                name="project_url"
                value={formData.project_url || ''}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* 5. Publishing Status & SEO */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-6">
          <div className="border-b border-[#DEDEDA] pb-3">
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
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
                  className="w-4 h-4 accent-[#111111]"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Published (Visible to public visitors)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#111111]"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Feature on Homepage Grid
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  SEO Custom Title
                </label>
                <input
                  type="text"
                  name="seo_title"
                  value={formData.seo_title || ''}
                  onChange={handleChange}
                  placeholder="Defaults to Project Title — Anil Shrestha"
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  SEO Description
                </label>
                <input
                  type="text"
                  name="seo_description"
                  value={formData.seo_description || ''}
                  onChange={handleChange}
                  placeholder="Defaults to project description"
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2 text-xs text-[#6B6B6B] hover:text-[#111111]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
