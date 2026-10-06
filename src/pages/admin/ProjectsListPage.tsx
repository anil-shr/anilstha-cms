import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { Project } from '../../types/database';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Star,
  ExternalLink,
  Search,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const {
    projects,
    deleteProject,
    toggleProjectPublish,
    toggleProjectFeature,
    saveProject,
  } = useData();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [deleteModalProject, setDeleteModalProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = filterCat === 'All' || p.category === filterCat;
    const matchesSearch =
      search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteModalProject) return;
    setIsDeleting(true);
    await deleteProject(deleteModalProject.id);
    setIsDeleting(false);
    setDeleteModalProject(null);
  };

  const handleMoveOrder = async (project: Project, direction: 'up' | 'down') => {
    const currentIndex = projects.findIndex((p) => p.id === project.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const targetProject = projects[targetIndex];
    const currentOrder = project.sort_order;
    const targetOrder = targetProject.sort_order;

    await saveProject({ ...project, sort_order: targetOrder });
    await saveProject({ ...targetProject, sort_order: currentOrder });
  };

  return (
    <AdminLayout
      title="Projects Archive"
      actionButton={
        <Link
          to="/admin/projects/new"
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#DEDEDA] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold transition-colors ${
                  filterCat === c
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F7F7F5] text-[#6B6B6B] hover:text-[#111111]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F7F5] border border-[#DEDEDA] focus:border-[#111111] focus:outline-none"
            />
          </div>
        </div>

        {/* Projects Table / Card Grid */}
        <div className="bg-white border border-[#DEDEDA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] border-b border-[#DEDEDA] text-[#6B6B6B] uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAE6]">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#888888]">
                      No projects matched your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project, idx) => (
                    <tr key={project.id} className="hover:bg-[#FAFAFA] transition-colors">
                      {/* Reorder Buttons */}
                      <td className="py-3 px-4 text-[#888888] whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(project, 'up')}
                            className="p-1 hover:text-[#111111] disabled:opacity-20 cursor-pointer"
                            title="Move up in order"
                          >
                            ▲
                          </button>
                          <span>{project.sort_order || idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === filteredProjects.length - 1}
                            onClick={() => handleMoveOrder(project, 'down')}
                            className="p-1 hover:text-[#111111] disabled:opacity-20 cursor-pointer"
                            title="Move down in order"
                          >
                            ▼
                          </button>
                        </div>
                      </td>

                      {/* Project title and cover preview */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-[#ECECE9] border border-[#DEDEDA] shrink-0 overflow-hidden">
                            {project.cover_image_url ? (
                              <img
                                src={project.cover_image_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-[#888888]">
                                None
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/admin/projects/${project.id}`}
                              className="font-bold text-[#111111] hover:underline uppercase tracking-tight block"
                            >
                              {project.title}
                            </Link>
                            <span className="text-[11px] font-mono text-[#888888]">
                              /{project.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#555555] font-medium">{project.category}</td>

                      <td className="py-3 px-4 font-mono text-[#666666]">{project.year}</td>

                      {/* Published Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleProjectPublish(project.id)}
                          className={`px-2 py-0.5 text-[10px] font-mono border cursor-pointer ${
                            project.published
                              ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                              : 'border-amber-300 text-amber-800 bg-amber-50'
                          }`}
                        >
                          {project.published ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleProjectFeature(project.id)}
                          className={`p-1.5 transition-colors cursor-pointer ${
                            project.featured
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-[#CCCCCC] hover:text-[#888888]'
                          }`}
                          title={project.featured ? 'Featured on home' : 'Click to feature on home'}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {project.published && (
                            <Link
                              to={`/work/${project.slug}`}
                              target="_blank"
                              className="p-1.5 text-[#6B6B6B] hover:text-[#111111]"
                              title="View on live website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <Link
                            to={`/admin/projects/${project.id}`}
                            className="p-1.5 text-[#111111] hover:text-[#C2410C]"
                            title="Edit project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteModalProject(project)}
                            className="p-1.5 text-red-600 hover:text-red-800 cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#DEDEDA] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                Delete this project permanently?
              </h3>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-[#111111]">"{deleteModalProject.title}"</strong>?
              This action cannot be undone and will immediately remove the case study and its URL from your portfolio.
            </p>

            <div className="pt-4 border-t border-[#DEDEDA] flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalProject(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
