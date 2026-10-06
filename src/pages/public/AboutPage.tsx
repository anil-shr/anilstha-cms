import React, { useEffect } from 'react';
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
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { profile, experience, cookieConsent } = useData();

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

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
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
        {/* Left Column: Portrait & Details */}
        <div className="lg:col-span-5 space-y-6">
          <SpotlightCard className="p-3">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10">
              <img
                src={portraitImg}
                alt={profile.name || 'Anil Shrestha'}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-5 space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Location:</strong> {profile.location || 'Pokhara, Nepal'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
              <a href={`mailto:${profile.email}`} className="text-blue-600 dark:text-sky-400 hover:underline font-medium">
                {profile.email || 'hello@anilshrestha.design'}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Primary Discipline:</strong> Graphic Design & Brand Identity
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-white">Secondary Superpower:</strong> UI/UX & Vibe Coding
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
              <Link
                to="/resume"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Clean Resume Sheet (PDF)</span>
              </Link>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Full Story & Experience */}
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

          {/* Experience Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SpotlightCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                <Briefcase className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Design Roles & Studio</h3>
              </div>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-blue-500 pl-3 space-y-0.5">
                    <p className="font-semibold text-slate-900 dark:text-slate-200">{exp.position}</p>
                    <p className="text-blue-600 dark:text-sky-400 font-mono text-[11px]">{exp.company} • {exp.start_date} – {exp.end_date || 'Present'}</p>
                    <p className="text-[11px] leading-relaxed pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                <Layers className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Creative Focus</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Brand Identity:</strong> Monograms, logos, typography, visual guidelines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Packaging & Print:</strong> Bottle labels, boxes, dielines, pre-press spot UV.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>UI/UX Design:</strong> High-fidelity Figma prototypes & scalable tokens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Vibe Coding:</strong> Tailwind CSS & fluid modern web micro-interactions.</span>
                </li>
              </ul>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
};
