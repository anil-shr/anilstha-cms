import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import {
  Palette,
  Layout,
  Layers,
  Sparkles,
  Printer,
  Compass,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const { profile, skills, cookieConsent } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    updateSEO({
      title: `Skills & Design Disciplines — ${profile.name || 'Anil Shrestha'}`,
      description:
        'Explore graphic design disciplines, software tools, typography, packaging, and UI/UX capabilities of Anil Shrestha in Nepal.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/skills' : '',
    });
    trackEvent('page_view', { page_path: '/skills' }, cookieConsent.analytics);
  }, [profile, cookieConsent.analytics]);

  const rawCategories = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
  const categories = ['All', ...rawCategories];

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const getFallbackIcon = (category: string, name: string) => {
    const norm = (category + ' ' + name).toLowerCase();
    if (norm.includes('ui') || norm.includes('ux') || norm.includes('web') || norm.includes('mobile')) {
      return Layout;
    }
    if (norm.includes('packag') || norm.includes('print') || norm.includes('dieline')) {
      return Layers;
    }
    if (norm.includes('vibe') || norm.includes('code') || norm.includes('frontend')) {
      return Sparkles;
    }
    if (norm.includes('tool') || norm.includes('software')) {
      return Wrench;
    }
    return Palette;
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>Core Disciplines & Software Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Graphic Design & Creative Disciplines
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Comprehensive toolset across brand identity, packaging dielines, editorial layout, Figma UI/UX, and modern web vibe coding. Fully managed from the admin panel.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Skills Grid */}
      <h2 className="sr-only">Core Competencies & Creative Toolset</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((sk) => {
          const FallbackIcon = getFallbackIcon(sk.category, sk.name);
          return (
            <SpotlightCard key={sk.id} className="p-6 flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#121212] border border-blue-100 dark:border-white/10 text-blue-600 dark:text-sky-400 flex items-center justify-center p-2.5 overflow-hidden">
                    {sk.custom_icon_url ? (
                      <img
                        src={sk.custom_icon_url}
                        alt={sk.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FallbackIcon className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#121212] text-blue-600 dark:text-sky-400 border border-slate-200/80 dark:border-white/5">
                    {sk.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {sk.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Professional expertise in {sk.category.toLowerCase()} workflow and production.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Production Ready</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
