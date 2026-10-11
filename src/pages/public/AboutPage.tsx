import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import portraitImg from '../../assets/images/anil_portrait_1791182391937.jpg';
import {
  Sparkles,
  MapPin,
  Mail,
  FileText,
  Palette,
  Briefcase,
  Layers,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowUpRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { profile, experience, cookieConsent } = useData();
  const [showAllExperience, setShowAllExperience] = useState(false);

  useEffect(() => {
    updateSEO({
      title: `About Anil Shrestha — Graphic Designer & Visual Creative`,
      description:
        profile.short_bio ||
        'Learn about Anil Shrestha, Graphic Designer based in Pokhara, Nepal with 3–5 years of experience in brand identity, packaging, and UI/UX design.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/about' : '',
    });
    trackEvent('page_view', { page_path: '/about' }, cookieConsent.analytics);
  }, [profile, cookieConsent.analytics]);

  const sortedExperience = [...(experience || [])].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );

  // If more than 2 experiences, limit default view to prevent page elongation
  const visibleExperience = showAllExperience
    ? sortedExperience
    : sortedExperience.slice(0, 2);

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12 text-left">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>About Anil Shrestha</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Graphic Designer & Visual Creative.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {profile.headline ||
            'Creative designer turning ideas into visual experiences. Crafting meaningful visual identities, intuitive interfaces, and packaging systems.'}
        </p>
      </div>

      {/* Grid: Photo & Biography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Portrait & Details with Clean Breathable Spacing */}
        <div className="lg:col-span-5 space-y-6">
          <SpotlightCard className="p-3">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
              <img
                src={profile.profile_image_url || portraitImg}
                alt={profile.name || 'Anil Shrestha'}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
            </div>
          </SpotlightCard>

          {/* Quick Info Panel with Clean Breathable Spacing */}
          <SpotlightCard className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>Studio & Contact Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Location Row */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-3.5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 block">
                    Location Base
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs truncate block">
                    {profile.location || 'Pokhara, Nepal'}
                  </span>
                </div>
              </div>

              {/* Direct Mail Row */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-3.5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${profile.email || 'inquiry@anilshrestha11.com.np'}`}
                    className="font-semibold text-blue-600 dark:text-sky-400 hover:underline text-xs truncate block"
                  >
                    {profile.email || 'inquiry@anilshrestha11.com.np'}
                  </a>
                </div>
              </div>

              {/* Primary Discipline */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-3.5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 block">
                    Primary Discipline
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                    Graphic Design & Brand Systems
                  </span>
                </div>
              </div>

              {/* Secondary Superpower */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 flex items-center gap-3.5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300 block">
                    Creative Vibe Coding
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                    UI/UX Prototyping & Tailwind Web
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/resume"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Open Clean Resume Sheet (PDF)</span>
              </Link>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Full Story, Focus & Managed Experience Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <SpotlightCard className="p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              <span>Background & Design Philosophy</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              I am a Graphic Designer from Pokhara, Nepal dedicated to creating meaningful visual communication, distinctive brand identities, and high-impact digital experiences. With 3–5 years of specialized design practice, my passion lies in distilling complex narratives into clean, memorable visual forms.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.long_bio ||
                'Creative designer with 3–5 years of specialized experience in visual communication, branding systems, and intuitive UI/UX design. Based in Pokhara, Nepal, I bridge human empathy with aesthetic precision across digital products, mobile interfaces, and high-impact print collateral.'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              As a modern "vibe coder", I also prototype and build interactive interfaces with Tailwind CSS and React, allowing me to take design concepts from static Figma canvases directly into functional, responsive web environments with zero creative compromise.
            </p>
          </SpotlightCard>

          {/* Balanced 2-Column Focus & Specialties Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SpotlightCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                <Layers className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Creative Focus</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Brand Identity:</strong> Monograms, logos, typography systems, styleguides.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Packaging & Print:</strong> Bottle labels, retail boxes, dielines, pre-press spot UV.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>UI/UX Design:</strong> High-fidelity Figma prototypes, tokens, mobile UI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Vibe Coding:</strong> Tailwind CSS & fluid modern web micro-interactions.</span>
                </li>
              </ul>
            </SpotlightCard>

            <SpotlightCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Design Standards</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Visual Consistency:</strong> Disciplined grid alignment & balanced whitespace.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Pre-Press Perfection:</strong> CMYK color separation & print-ready PDF/X-1a.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Client Collaboration:</strong> Clear iterations with prompt delivery cycles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Global Delivery:</strong> Partnering with businesses in Nepal & overseas.</span>
                </li>
              </ul>
            </SpotlightCard>
          </div>

          {/* Experience Timeline Panel — Proportioned with Max Height / Compact View */}
          <SpotlightCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5 text-blue-600 dark:text-sky-400">
                <Briefcase className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Design Roles & Career Journey
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {sortedExperience.length} professional positions recorded
                  </span>
                </div>
              </div>

              {sortedExperience.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllExperience(!showAllExperience)}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{showAllExperience ? 'Collapse' : `View All (${sortedExperience.length})`}</span>
                  {showAllExperience ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Experience List Container - Proportioned and smoothly scrollable when expanded */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
              {visibleExperience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border-l-4 border-l-blue-600 dark:border-l-sky-400 border border-slate-200/60 dark:border-white/5 space-y-1.5 transition-all hover:bg-slate-100/70 dark:hover:bg-white/[0.05]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {exp.position}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-400 font-mono text-[10px] font-bold">
                      {exp.start_date} – {exp.end_date || (exp.current ? 'Present' : '')}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 font-medium text-xs flex items-center gap-1.5">
                    <span>{exp.company}</span>
                    {exp.location && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-[11px] text-slate-500">{exp.location}</span>
                      </>
                    )}
                  </p>

                  {exp.description && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-mono">
                Looking for detailed project breakdowns?
              </span>
              <Link
                to="/work"
                className="text-blue-600 dark:text-sky-400 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Browse Portfolio Works</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
