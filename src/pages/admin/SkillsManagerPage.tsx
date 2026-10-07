import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Skill } from '../../types/database';
import { Plus, Trash2, Upload, Image as ImageIcon, Check, X } from 'lucide-react';

export const SkillsManagerPage: React.FC = () => {
  const { skills, saveSkill, deleteSkill } = useData();

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Graphic Design');
  const [newCustomIconUrl, setNewCustomIconUrl] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const categories = [
    'Graphic Design',
    'UI/UX Design',
    'Software & Tools',
    'Craft & Technical',
    'Vibe Coding',
  ];

  const handleIconUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setNewCustomIconUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSkill: Skill = {
      id: 'sk-' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      sort_order: skills.length + 1,
      custom_icon_url: newCustomIconUrl.trim() || undefined,
    };

    await saveSkill(newSkill);
    setNewName('');
    setNewCustomIconUrl('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this skill?')) {
      await deleteSkill(id);
    }
  };

  return (
    <AdminLayout title="Skills & Tools">
      <div className="space-y-8 max-w-4xl text-left">
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-400">
          Manage design disciplines, tools, and technical competencies. You can now upload a custom SVG or PNG icon for any skill, which will appear on the public Skills & Services pages.
        </div>

        {savedNotice && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Skill saved and published dynamically!</span>
          </div>
        )}

        {/* Add Skill Form */}
        <form onSubmit={handleAdd} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
            Add New Discipline, Tool or Skill
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Skill / Tool Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Adobe InDesign, Figma, Risograph"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-slate-900 dark:text-slate-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Icon Field */}
          <div className="p-4 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-white/10 space-y-3">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Optional Custom Icon (SVG / PNG)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Upload Icon File
                </label>
                <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 dark:border-white/20 rounded-lg hover:border-blue-500 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors bg-white dark:bg-white/5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose SVG or PNG file</span>
                  <input
                    type="file"
                    accept="image/*,.svg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleIconUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Or Icon URL
                </label>
                <input
                  type="url"
                  value={newCustomIconUrl}
                  onChange={(e) => setNewCustomIconUrl(e.target.value)}
                  placeholder="https://.../icon.svg"
                  className="w-full px-2.5 py-2 text-xs bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {newCustomIconUrl && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Preview:</span>
                  <div className="w-6 h-6 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 p-0.5 flex items-center justify-center">
                    <img src={newCustomIconUrl} alt={`${newName || 'Skill'} icon preview`} className="w-full h-full object-contain" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNewCustomIconUrl('')}
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Clear icon
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </form>

        {/* Categorized Skills List */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <div key={cat} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-slate-900 dark:text-white">
                    {cat}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {catSkills.length} entries
                  </span>
                </div>

                {catSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No skills in this category yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {catSkills.map((sk) => (
                      <div
                        key={sk.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-800 dark:text-slate-200 group"
                      >
                        {sk.custom_icon_url ? (
                          <img
                            src={sk.custom_icon_url}
                            alt={sk.name}
                            className="w-4 h-4 object-contain"
                          />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                        <span className="font-medium">{sk.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(sk.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                          title="Delete skill"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};
