import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { Project } from '../../types/database';
import {
  Plus,
  Trash2,
  Edit,
  Star,
  ExternalLink,
  Search,
  AlertTriangle,
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
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterCat === c
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Projects Table / Card Grid */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
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
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No projects matched your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project, idx) => (
                    <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                      {/* Reorder Buttons */}
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveOrder(project, 'up')}
                            className="p-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move up in order"
                          >
                            ▲
                          </button>
                          <span>{project.sort_order || idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === filteredProjects.length - 1}
                            onClick={() => handleMoveOrder(project, 'down')}
                            className="p-1 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Move down in order"
                          >
                            ▼
                          </button>
                        </div>
                      </td>

                      {/* Project title and cover preview with descriptive alt */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-md shrink-0 overflow-hidden">
                            {project.cover_image_url ? (
                              <img
                                src={project.cover_image_url}
                                alt={`Cover thumbnail for ${project.title}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                                None
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              to={`/admin/projects/${project.id}`}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-sky-400 tracking-tight block"
                            >
                              {project.title}
                            </Link>
                            <span className="text-[11px] font-mono text-slate-400">
                              /{project.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{project.category}</td>

                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{project.year}</td>

                      {/* Published Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleProjectPublish(project.id)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded-md border cursor-pointer ${
                            project.published
                              ? 'border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                              : 'border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40'
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
                              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
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
                              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                              title="View on live website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <Link
                            to={`/admin/projects/${project.id}`}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400"
                            title="Edit project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteModalProject(project)}
                            className="p-1.5 text-red-600 hover:text-red-700 cursor-pointer"
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
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                Delete this project permanently?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-slate-900 dark:text-white">"{deleteModalProject.title}"</strong>?
              This action cannot be undone and will immediately remove the case study and its URL from your portfolio.
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalProject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
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
