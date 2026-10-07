import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { Project } from '../../types/database';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import { SocialIcon } from '../../components/public/SocialIcon';
import {
  Palette,
  Layout,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Eye,
  X,
  FileText,
  Download,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { profile, projects, socialLinks, cookieConsent } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  useEffect(() => {
    updateSEO({
      title: `${profile.name || 'Anil Shrestha'} — Graphic Designer & UI/UX Specialist`,
      description:
        profile.short_bio ||
        'Creative designer turning ideas into visual experiences. Branding, UI/UX, and print solutions based in Pokhara, Nepal.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/' : '',
      ogType: 'website',
      ogImage: profile.profile_image_url,
    });
    trackEvent('page_view', { page_path: '/' }, cookieConsent.analytics);
  }, [profile, cookieConsent.analytics]);

  const publishedProjects = projects.filter((p) => p.published);
  const categories = ['All', 'Branding', 'UI/UX Design', 'Graphic Design'];

  const filteredProjects =
    selectedCategory === 'All'
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === selectedCategory);

  const activeSocials = socialLinks.filter((s) => s.active);

  // Exact Marquee tape items matching the user's reference image
  const marqueeItems = [
    'ART DIRECTION',
    'TYPOGRAPHY',
    'EDITORIAL DESIGN',
    'SOCIAL MEDIA CAMPAIGNS',
    'POSTER & FLYER DESIGN',
    'CORELDRAW & ADOBE MASTER',
    'FIGMA & DESIGN SYSTEMS',
    'LARGE FORMAT & SIGNAGE',
  ];

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      
      {/* ========================================================================= */}
      {/* HERO SECTION (Exact Match to User's Uploaded Screenshot)                  */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 md:px-8 max-w-7xl mx-auto text-center">
        
        {/* Soft Ambient Pastel Glows from Screenshot - Sky Blue on left, Mint/Lime on right (NO PURPLE) */}
        <div className="absolute top-10 left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-200/40 dark:bg-sky-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-16 right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 dark:bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-hero-grid opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          
          {/* Top Pill Badge matching screenshot */}
          <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#1e1e1e] border border-slate-200/90 dark:border-white/10 shadow-xs text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white">
              {profile.name || 'Anil Shrestha'}
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
            <span className="truncate">{profile.profession || 'Graphic Designer & UI/UX Specialist'}</span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-blue-600 dark:text-sky-400 font-medium">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{profile.location || 'Pokhara, Nepal'}</span>
            </span>
          </div>

          {/* Grand Centered Headline matching screenshot exactly */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08]">
              Creative designer turning
              <br />
              ideas into{' '}
              <span className="font-serif-italic font-normal italic text-blue-600 dark:text-sky-400 text-[1.12em]">
                visual
              </span>
              <br />
              <span className="font-serif-italic font-normal italic text-blue-600 dark:text-sky-400 text-[1.12em]">
                experiences.
              </span>
            </h1>

            {/* Subtitle matching screenshot */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal pt-2">
              {profile.hero_description ||
                'Crafting meaningful visual identities, intuitive web & mobile interfaces, marketing collateral, and precision print solutions for clients in Pokhara, Nepal and worldwide.'}
            </p>
          </div>

          {/* CTA Buttons Row (Centered) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/work"
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#0f1422] dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all active:scale-95 inline-flex items-center gap-2 group"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/services"
              className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-2xs transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>VIEW SERVICES</span>
            </Link>
          </div>

          {/* 4 Stat / Feature Cards matching Screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 max-w-4xl mx-auto text-left">
            {/* Card 1: Graphic Design */}
            <SpotlightCard className="p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                  Graphic Design
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Branding & Print
                </p>
              </div>
            </SpotlightCard>

            {/* Card 2: UI/UX Design */}
            <SpotlightCard className="p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Layout className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                  UI/UX Design
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Web & Mobile Apps
                </p>
              </div>
            </SpotlightCard>

            {/* Card 3: Experience */}
            <SpotlightCard className="p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                  3–5 Years
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Industry Experience
                </p>
              </div>
            </SpotlightCard>

            {/* Card 4: Projects */}
            <SpotlightCard className="p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                  100+ Projects
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Delivered Globally
                </p>
              </div>
            </SpotlightCard>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM MARQUEE TAPE BANNER (Matching Screenshot Exactly)                  */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#18181b] border-y border-slate-200 dark:border-white/10 text-white py-3 sm:py-3.5 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-slate-200">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-sky-400 text-sm">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC SOCIAL LINKS SECTION WITH REAL ICONS                              */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="space-y-3 text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-sky-400">
            Connect Across Social Platforms
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find Me Online & Explore My Portfolios
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Follow my latest branding case studies, packaging dielines, UI/UX shots, and design thoughts.
          </p>
        </div>

        {/* Dynamic Socials Grid with Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {activeSocials.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200/90 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-sky-400/50 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group text-slate-800 dark:text-slate-200"
            >
              <div className="p-2.5 rounded-full bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-400 group-hover:scale-110 transition-transform">
                <SocialIcon platform={link.platform} customIconUrl={link.custom_icon_url} className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tracking-tight">{link.platform}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 dark:group-hover:text-sky-400 flex items-center gap-0.5">
                <span>Visit</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED WORK & CASE STUDIES                                             */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10">
        <div className="space-y-4 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-sky-400">
                Selected Portfolio
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Design Case Studies
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
                Visual brand identities, digital interfaces, packaging systems, and editorial print work.
              </p>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 hover:underline"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0f1422] dark:bg-white text-white dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard key={project.id} className="group flex flex-col justify-between">
              <div>
                {/* Project Cover */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10">
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {project.category}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono text-slate-200 bg-black/60 backdrop-blur-md">
                    {project.year}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5 text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
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

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  <span>Preview</span>
                </button>

                <Link
                  to={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* DOWNLOAD RESUME / CV SECTION                                             */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 md:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10">
        <SpotlightCard className="p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-br from-blue-50/40 via-white to-sky-50/40 dark:from-[#1e1e1e] dark:via-[#222226] dark:to-[#1e1e1e] border-blue-200/60 dark:border-white/10">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800/40 inline-block">
              Curriculum Vitae
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Looking for my professional design background?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
              Access my dedicated, distraction-free resume sheet outlining design disciplines, software tools, client experience, and education. Ready to save directly as PDF.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {profile.resume_url && profile.resume_url.endsWith('.pdf') ? (
                <a
                  href={profile.resume_url}
                  download="Anil_Shrestha_Resume.pdf"
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Resume</span>
                </a>
              ) : null}

              <Link
                to="/resume"
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View & Download PDF Resume</span>
              </Link>
              <Link
                to="/about"
                className="px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all inline-flex items-center gap-1.5"
              >
                <span>Read Full Biography</span>
              </Link>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ========================================================================= */}
      {/* QUICK PREVIEW MODAL                                                      */}
      {/* ========================================================================= */}
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
                <p className="text-xs text-blue-600 dark:text-sky-400">
                  {activeModalProject.category} • {activeModalProject.year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-black/50">
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
              <span className="text-xs text-slate-500">
                Client: {activeModalProject.client || 'Private'}
              </span>
              <Link
                to={`/work/${activeModalProject.slug}`}
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>View Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
