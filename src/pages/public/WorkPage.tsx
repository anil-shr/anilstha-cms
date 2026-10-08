import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { Project } from '../../types/database';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import { ProjectGridSkeleton } from '../../components/public/Skeletons';
import {
  Search,
  ArrowRight,
  Eye,
  Code2,
  Palette,
  X,
  ExternalLink,
} from 'lucide-react';

export const WorkPage: React.FC = () => {
  const { profile, projects, cookieConsent, isLoading } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  useEffect(() => {
    updateSEO({
      title: `Design Portfolio & Case Studies — ${profile.name || 'Anil Shrestha'}`,
      description:
        'Explore branding identities, packaging, editorial print, and UI/UX design case studies by Anil Shrestha in Nepal.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/work' : '',
    });
    trackEvent('page_view', { page_path: '/work' }, cookieConsent.analytics);
  }, [profile, cookieConsent.analytics]);

  const publishedProjects = projects.filter((p) => p.published);

  const categories = ['All', 'Branding', 'UI/UX Design', 'Graphic Design'];

  const filteredProjects = publishedProjects.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.category === selectedCategory ||
      (p.tags && p.tags.includes(selectedCategory));

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>Design Archive & Case Studies</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Selected Design Work
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Brand identity systems, tactile packaging, cultural event posters, and intuitive UI/UX design.
        </p>
      </div>

      {/* Controls: Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-[#121212] text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading && projects.length === 0 ? (
        <ProjectGridSkeleton count={6} />
      ) : filteredProjects.length === 0 ? (
        <SpotlightCard className="p-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No projects found</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium"
          >
            Reset Filters
          </button>
        </SpotlightCard>
      ) : (
        <>
          <h2 className="sr-only">Selected Projects Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard key={project.id} className="group flex flex-col justify-between">
              <div>
                {/* Project Cover */}
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10">
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/90 dark:bg-black/80 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10">
                      {project.category}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-black/60">
                    {project.year}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Overview</span>
                </button>

                <Link
                  to={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </>
    )}

      {/* Quick View Modal */}
      {activeModalProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeModalProject.title}
                </h3>
                <p className="text-xs text-blue-600 dark:text-sky-400 font-mono">{activeModalProject.category} • {activeModalProject.year}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-black/50">
                <img
                  src={activeModalProject.cover_image_url}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeModalProject.fullDescription || activeModalProject.description}
              </p>

              {activeModalProject.tools && activeModalProject.tools.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Tools & Software:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeModalProject.tools.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              {activeModalProject.project_url ? (
                <a
                  href={activeModalProject.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1"
                >
                  <span>Live Case Study</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">
                  Client: {activeModalProject.client || 'Studio Work'}
                </span>
              )}
              <Link
                to={`/work/${activeModalProject.slug}`}
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
