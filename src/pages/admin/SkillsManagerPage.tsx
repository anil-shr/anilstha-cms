import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Skill } from '../../types/database';
import { Plus, Trash2, X } from 'lucide-react';

export const SkillsManagerPage: React.FC = () => {
  const { skills, saveSkill, deleteSkill } = useData();

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Core Disciplines');

  const categories = ['Core Disciplines', 'Software & Tools', 'Craft & Technical'];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSkill: Skill = {
      id: 'sk-' + Date.now(),
      name: newName.trim(),
      category: newCategory,
      sort_order: skills.length + 1,
    };

    await saveSkill(newSkill);
    setNewName('');
  };

  return (
    <AdminLayout title="Skills & Tools">
      <div className="space-y-8 max-w-4xl">
        <div className="bg-white border border-[#DEDEDA] p-4 text-xs text-[#6B6B6B]">
          Skills are organized by disciplined categories. In accordance with professional graphic design standards, skill names are presented without arbitrary numerical percentages.
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAdd} className="bg-white border border-[#DEDEDA] p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-bold text-[#111111]">
            Add New Discipline or Tool
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Skill / Tool Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Adobe InDesign, Risograph Printing"
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#111111] block">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-1.5"
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
              <div key={cat} className="bg-white border border-[#DEDEDA] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#DEDEDA] pb-2">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#111111]">
                    {cat}
                  </h3>
                  <span className="text-[11px] font-mono text-[#888888]">
                    {catSkills.length} entries
                  </span>
                </div>

                {catSkills.length === 0 ? (
                  <p className="text-xs text-[#888888] py-2">No skills in this category yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((sk) => (
                      <div
                        key={sk.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F7F7F5] border border-[#DEDEDA] text-xs text-[#111111]"
                      >
                        <span className="font-medium">{sk.name}</span>
                        <button
                          type="button"
                          onClick={() => deleteSkill(sk.id)}
                          className="text-[#888888] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove skill"
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
