import React, { useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import { ProjectDetailSkeleton } from '../../components/public/Skeletons';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { params } = useRouter();
  const { projects, profile, cookieConsent, isLoading } = useData();

  const slug = params.slug;
  const project = projects.find((p) => p.slug === slug);

  const publishedProjects = projects.filter((p) => p.published);
  const currentIndex = publishedProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex !== -1 && currentIndex < publishedProjects.length - 1
      ? publishedProjects[currentIndex + 1]
      : null;

  useEffect(() => {
    if (project) {
      updateSEO({
        title: project.seo_title || `${project.title} — ${profile.name || 'Anil Shrestha'}`,
        description: project.seo_description || project.description,
        canonicalUrl: typeof window !== 'undefined' ? window.location.href : '',
        ogType: 'article',
        ogImage: project.og_image_url || project.cover_image_url,
      });
      trackEvent(
        'project_view',
        { project_id: project.id, project_title: project.title },
        cookieConsent.analytics
      );
    }
  }, [project, profile, cookieConsent.analytics]);

  if (isLoading && !project) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold font-mono">
          Error 404
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Project Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
          The requested portfolio piece may have been updated or archived.
        </p>
        <Link
          to="/work"
          className="mt-4 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 inline-flex items-center gap-2 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-10 md:py-16 max-w-5xl mx-auto px-4 md:px-8 space-y-10">
      {/* Back link */}
      <div>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Project Header */}
      <div className="space-y-3 pb-8 border-b border-slate-200 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono font-semibold">
            {project.category}
          </span>
          <span>•</span>
          <span className="font-mono">{project.year}</span>
          {project.client && (
            <>
              <span>•</span>
              <span>{project.client}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </div>

      {/* Metadata Specification Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {project.role && (
          <SpotlightCard className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Role</span>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{project.role}</p>
          </SpotlightCard>
        )}

        {project.services && project.services.length > 0 && (
          <SpotlightCard className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Scope</span>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
              {project.services.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
          </SpotlightCard>
        )}

        {project.tools && project.tools.length > 0 && (
          <SpotlightCard className="p-4 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Tools & Software</span>
            <div className="flex flex-wrap gap-1 pt-1">
              {project.tools.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                  {t}
                </span>
              ))}
            </div>
          </SpotlightCard>
        )}

        {project.project_url && (
          <SpotlightCard className="p-4 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Live Presentation</span>
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-sky-400 hover:underline font-semibold"
            >
              <span>View Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </SpotlightCard>
        )}
      </div>

      {/* Main Cover Visual */}
      {project.cover_image_url && (
        <SpotlightCard className="p-2 overflow-hidden">
          <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </SpotlightCard>
      )}

      {/* Narrative & Case Study Content */}
      <div className="space-y-6">
        <SpotlightCard className="p-6 sm:p-8 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Project Overview & Creative Concept</h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {project.fullDescription || project.description}
          </p>
        </SpotlightCard>

        {project.challenge && (
          <SpotlightCard className="p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Creative Brief & Challenge</h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{project.challenge}</p>
          </SpotlightCard>
        )}

        {project.solution && (
          <SpotlightCard className="p-6 sm:p-8 space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Design Solution & Execution</h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{project.solution}</p>
          </SpotlightCard>
        )}
      </div>

      {/* Prev / Next Pagination */}
      <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
        {prevProject ? (
          <Link
            to={`/work/${prevProject.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev: {prevProject.title}</span>
          </Link>
        ) : <div />}

        {nextProject && (
          <Link
            to={`/work/${nextProject.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>Next: {nextProject.title}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </article>
  );
};
