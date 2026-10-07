import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { SocialLink } from '../../types/database';
import { SocialIcon } from '../../components/public/SocialIcon';
import { Check, Plus, Trash2, ArrowUpRight, Upload, Image as ImageIcon, X } from 'lucide-react';

export const SocialLinksPage: React.FC = () => {
  const { socialLinks, saveSocialLinks } = useData();

  const supportedPlatforms = [
    'Facebook',
    'Instagram',
    'Behance',
    'Dribbble',
    'LinkedIn',
    'GitHub',
    'X',
    'YouTube',
    'TikTok',
    'Pinterest',
    'ArtStation',
  ];

  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const [customPlatform, setCustomPlatform] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [editingIconIdx, setEditingIconIdx] = useState<number | null>(null);

  const handleUrlChange = (idx: number, newUrl: string) => {
    const updated = [...links];
    updated[idx].url = newUrl;
    setLinks(updated);
  };

  const handleActiveToggle = (idx: number) => {
    const updated = [...links];
    updated[idx].active = !updated[idx].active;
    setLinks(updated);
  };

  const handleCustomIconUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated = [...links];
      updated[idx].custom_icon_url = result;
      setLinks(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomIconUrlChange = (idx: number, url: string) => {
    const updated = [...links];
    updated[idx].custom_icon_url = url;
    setLinks(updated);
  };

  const handleClearCustomIcon = (idx: number) => {
    const updated = [...links];
    delete updated[idx].custom_icon_url;
    setLinks(updated);
  };

  const handleAddNewPlatform = (platform: string) => {
    const trimmed = platform.trim();
    if (!trimmed) return;
    if (links.some((l) => l.platform.toLowerCase() === trimmed.toLowerCase())) return;
    const newEntry: SocialLink = {
      id: 'soc-' + Date.now(),
      platform: trimmed,
      url: '',
      sort_order: links.length + 1,
      active: true,
    };
    setLinks([...links, newEntry]);
    setCustomPlatform('');
  };

  const handleRemove = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    await saveSocialLinks(links);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <AdminLayout
      title="Social Links & Icons"
      actionButton={
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          {savedNotice && <Check className="w-3.5 h-3.5 text-white" />}
          <span>{savedNotice ? 'Saved ✓' : 'Save Social Links'}</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-4xl text-left">
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400">
          Configure dynamic social links (Facebook, Instagram, Behance, Dribbble, LinkedIn, etc.). You can now upload your own custom icons (SVG, PNG) or use the built-in crisp platform icons. Only links with valid URLs and active toggles appear on the public website.
        </div>

        {savedNotice && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Social links and custom icons updated across public views and footer successfully.</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5 shadow-xs">
          {links.map((link, idx) => (
            <div key={link.id || idx} className="p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 w-full sm:w-1/3">
                  <input
                    type="checkbox"
                    checked={link.active}
                    onChange={() => handleActiveToggle(idx)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title="Toggle active on public site"
                  />
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 overflow-hidden">
                    <SocialIcon
                      platform={link.platform}
                      customIconUrl={link.custom_icon_url}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                      {link.platform}
                    </span>
                    {link.custom_icon_url && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        Custom Icon
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleUrlChange(idx, e.target.value)}
                    placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-slate-900 dark:text-slate-100"
                  />
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                      title="Open link in new tab"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingIconIdx(editingIconIdx === idx ? null : idx)}
                    className={`p-2 rounded-lg transition-colors cursor-pointer text-xs font-medium flex items-center gap-1 ${
                      editingIconIdx === idx || link.custom_icon_url
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    title="Upload or change custom icon"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete from list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Custom Icon drawer/editor for this row */}
              {editingIconIdx === idx && (
                <div className="mt-2 p-3.5 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>Custom Icon for {link.platform}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingIconIdx(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* File Upload */}
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Upload Image / SVG File
                      </label>
                      <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 dark:border-white/20 rounded-lg hover:border-blue-500 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors bg-white dark:bg-white/5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose SVG or PNG</span>
                        <input
                          type="file"
                          accept="image/*,.svg"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleCustomIconUpload(idx, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                        Or Icon Image URL
                      </label>
                      <input
                        type="url"
                        value={link.custom_icon_url || ''}
                        onChange={(e) => handleCustomIconUrlChange(idx, e.target.value)}
                        placeholder="https://.../icon.svg"
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {link.custom_icon_url && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Preview:</span>
                        <div className="w-6 h-6 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 p-0.5 flex items-center justify-center">
                          <img
                            src={link.custom_icon_url}
                            alt={`${link.platform || 'Social'} icon preview`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClearCustomIcon(idx)}
                        className="text-[11px] text-red-500 hover:underline cursor-pointer"
                      >
                        Revert to default icon
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add more platforms */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white block">
            Add Social Platform
          </span>

          <div className="flex flex-wrap gap-2">
            {supportedPlatforms
              .filter(
                (p) => !links.some((l) => l.platform.toLowerCase() === p.toLowerCase())
              )
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleAddNewPlatform(p)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-white/10 hover:border-blue-500 text-slate-800 dark:text-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-blue-500" />
                  <span>{p}</span>
                </button>
              ))}
          </div>

          <div className="pt-2 flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              placeholder="Or custom platform name..."
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg flex-1 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddNewPlatform(customPlatform)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
