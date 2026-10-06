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
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-4xl">
        <div className="bg-white border border-[#DEDEDA] p-4 text-xs text-[#6B6B6B]">
          Timeline of professional studios, independent commissions, and positions held.
        </div>

        <div className="space-y-4">
          {experience.length === 0 ? (
            <div className="bg-white border border-[#DEDEDA] p-12 text-center text-xs text-[#888888]">
              No experience records added. Click "Add Position" above to add your first background entry.
            </div>
          ) : (
            experience.map((exp) => (
              <div
                key={exp.id}
                className="bg-white border border-[#DEDEDA] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                      {exp.position}
                    </h3>
                    <span className="text-xs text-[#6B6B6B]">at {exp.company}</span>
                    {exp.current && (
                      <span className="text-[10px] font-mono px-2 py-0.5 border border-emerald-300 text-emerald-800 bg-emerald-50">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-[#888888]">
                    {exp.start_date} — {exp.current ? 'Present' : exp.end_date} {exp.location && `· ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-[#555555] max-w-xl pt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 text-[#111111] hover:text-[#C2410C]"
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
                    className="p-1.5 text-red-600 hover:text-red-800"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#DEDEDA] max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DEDEDA]">
              <h2 className="text-sm font-bold uppercase tracking-tight text-[#111111]">
                {editingExp.company ? `Edit Position` : 'New Position'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#888888] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
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
                    className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
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
                    className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
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
                    className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
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
                    className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none font-mono disabled:opacity-40"
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
                    className="w-4 h-4 accent-[#111111]"
                  />
                  <span className="text-xs font-medium text-[#111111]">
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
                  className="px-2 py-1 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                  Responsibilities & Achievements
                </label>
                <textarea
                  rows={3}
                  value={editingExp.description || ''}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, description: e.target.value })
                  }
                  placeholder="Brief summary of projects handled..."
                  className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none resize-y"
                />
              </div>

              <div className="pt-4 border-t border-[#DEDEDA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6B6B] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors"
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
