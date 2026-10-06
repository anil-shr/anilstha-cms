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
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const { profile, cookieConsent } = useData();
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

  const skillCards = [
    {
      id: 'sk-1',
      name: 'Brand Identity & Visual Strategy',
      category: 'Graphic Design',
      level: 'Advanced',
      icon: Palette,
      description: 'End-to-end brand guidelines, logo systems, color palettes, and typographic hierarchies built for multi-channel recognition.',
      toolsUsed: ['Adobe Illustrator', 'Brand Strategy', 'Logo Suite', 'Style Guides'],
    },
    {
      id: 'sk-2',
      name: 'Packaging Design & Dieline Engineering',
      category: 'Graphic Design',
      level: 'Advanced',
      icon: Layers,
      description: 'Custom box packaging, bottle labels, retail containers, tactile material selection, and pre-press color separations.',
      toolsUsed: ['Adobe Illustrator', 'CAD Dielines', 'Pre-Press', 'Spot UV & Foiling'],
    },
    {
      id: 'sk-3',
      name: 'UI/UX & Mobile / Web Interfaces',
      category: 'UI/UX Design',
      level: 'Advanced',
      icon: Layout,
      description: 'Designing intuitive user interfaces, modular design systems, clickable high-fidelity Figma prototypes, and responsive layouts.',
      toolsUsed: ['Figma', 'Design Systems', 'Interactive Prototyping', 'Component Specs'],
    },
    {
      id: 'sk-4',
      name: 'Editorial Layout & Typography',
      category: 'Graphic Design',
      level: 'Proficient',
      icon: Printer,
      description: 'Brochures, annual reports, brand lookbooks, and high-impact cultural event posters with razor-sharp editorial discipline.',
      toolsUsed: ['Adobe InDesign', 'Adobe Photoshop', 'Typeface Pairing', 'Editorial Grid'],
    },
    {
      id: 'sk-5',
      name: 'Vibe Coding & Frontend Prototyping',
      category: 'Vibe Coding',
      level: 'Proficient',
      icon: Sparkles,
      description: 'Transforming Figma artboards into living, interactive web interfaces with Tailwind CSS, React, and subtle micro-interactions.',
      toolsUsed: ['Tailwind CSS', 'React', 'Modern CSS', 'Cursor Spotlight Effects'],
    },
    {
      id: 'sk-6',
      name: 'Art Direction & Print Production',
      category: 'Graphic Design',
      level: 'Advanced',
      icon: Compass,
      description: 'Overseeing print vendor proofing, CMYK color management, large format banners, and retail store point-of-sale graphics.',
      toolsUsed: ['CMYK & Pantone', 'Press Quality Proofing', 'Signage Specs'],
    },
  ];

  const categories = ['All', 'Graphic Design', 'UI/UX Design', 'Vibe Coding'];

  const filteredCards =
    activeCategory === 'All'
      ? skillCards
      : skillCards.filter((card) => card.category === activeCategory);

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
          Comprehensive toolset across brand identity, packaging dielines, editorial layout, Figma UI/UX, and modern web vibe coding.
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
                  : 'bg-white dark:bg-[#181b26] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <SpotlightCard key={card.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-blue-600 dark:text-sky-400 border border-slate-200 dark:border-white/5">
                    {card.level}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                    {card.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {card.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {card.toolsUsed.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-[#1f2434] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
};
