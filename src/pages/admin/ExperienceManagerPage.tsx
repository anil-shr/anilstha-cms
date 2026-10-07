import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Experience } from '../../types/database';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export const ExperienceManagerPage: React.FC = () => {
  const { experience, saveExperience, deleteExperience } = useData();

  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingExp({
      id: 'exp-' + Date.now(),
      company: '',
      position: '',
      description: '',
      start_date: '2024',
      end_date: 'Present',
      current: true,
      location: 'Kathmandu, Nepal',
      sort_order: experience.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.company.trim() || !editingExp.position.trim()) return;

    await saveExperience(editingExp);
    setIsModalOpen(false);
    setEditingExp(null);
  };

  return (
    <AdminLayout
      title="Experience History"
      actionButton={
        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-4xl text-left">
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
          Timeline of professional studios, independent commissions, and positions held.
        </div>

        <div className="space-y-4">
          {experience.length === 0 ? (
            <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center text-xs text-slate-400 shadow-xs">
              No experience records added. Click "Add Position" above to add your first background entry.
            </div>
          ) : (
            experience.map((exp) => (
              <div
                key={exp.id}
                className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <span className="text-xs text-slate-600 dark:text-slate-400">at {exp.company}</span>
                    {exp.current && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date} {exp.location && `· ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl pt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer"
                    title="Edit entry"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove position at ${exp.company}?`)) {
                        deleteExperience(exp.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-700 cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && editingExp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
        >
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                {editingExp.company ? `Edit Position` : 'New Position'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    Position Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.position}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, position: e.target.value })
                    }
                    placeholder="e.g. Lead Designer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    Company / Studio
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    placeholder="e.g. Studio Mandap"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    Start Date
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.start_date}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, start_date: e.target.value })
                    }
                    placeholder="e.g. 2023"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={editingExp.current}
                    value={editingExp.end_date || ''}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, end_date: e.target.value })
                    }
                    placeholder="e.g. 2025"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingExp.current}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        current: e.target.checked,
                        end_date: e.target.checked ? 'Present' : '',
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Currently working here
                  </span>
                </label>

                <input
                  type="text"
                  value={editingExp.location || ''}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, location: e.target.value })
                  }
                  placeholder="Location (e.g. Kathmandu)"
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
                  Responsibilities & Achievements
                </label>
                <textarea
                  rows={3}
                  value={editingExp.description || ''}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, description: e.target.value })
                  }
                  placeholder="Brief summary of projects handled..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none resize-y"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
