import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  ArrowRight,
  Sparkles,
  Gamepad2,
  FolderKanban,
  FileText,
  User,
  Layers,
  Wrench,
  Mail,
  Sun,
  Moon,
  X,
  Calendar,
  Zap,
  Grid,
  Trophy,
  Code,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  label: string;
  subtitle: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Pages' | 'Projects' | 'Tools' | 'Games';
  keywords?: string[];
  action?: () => void;
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const { projects } = useData();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Pages' | 'Projects' | 'Tools' | 'Games'>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedCategory('All');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const publishedProjects = (projects || []).filter((p) => p.published);

  // Standard public navigation items — completely excludes any admin CMS panel
  const navigationItems: PaletteItem[] = [
    {
      id: 'page-home',
      label: 'Home Page',
      subtitle: 'Overview, hero showcase & featured visual works',
      path: '/',
      icon: User,
      category: 'Pages',
      keywords: ['main', 'start', 'anil', 'landing', 'portfolio'],
    },
    {
      id: 'page-work',
      label: 'Selected Works',
      subtitle: 'Browse case studies, client branding & packaging design',
      path: '/work',
      icon: FolderKanban,
      category: 'Pages',
      keywords: ['projects', 'case studies', 'portfolio', 'branding', 'packaging'],
    },
    {
      id: 'page-services',
      label: 'Design Services',
      subtitle: 'Brand identity, UI/UX, packaging, editorial & print production',
      path: '/services',
      icon: Layers,
      category: 'Pages',
      keywords: ['offerings', 'pricing', 'brand', 'ui', 'ux', 'packaging'],
    },
    {
      id: 'page-skills',
      label: 'Technical Proficiencies',
      subtitle: 'Design tools (Figma, Illustrator, Photoshop) & design disciplines',
      path: '/skills',
      icon: Wrench,
      category: 'Pages',
      keywords: ['tools', 'software', 'skills', 'figma', 'illustrator', 'photoshop', 'indesign'],
    },
    {
      id: 'page-about',
      label: 'About Anil',
      subtitle: 'Creative director biography, design philosophy & roots in Nepal',
      path: '/about',
      icon: User,
      category: 'Pages',
      keywords: ['bio', 'profile', 'story', 'experience', 'nepal', 'kathmandu'],
    },
    {
      id: 'page-resume',
      label: 'Professional Resume',
      subtitle: 'Curriculum vitae, career milestones & work history',
      path: '/resume',
      icon: FileText,
      category: 'Pages',
      keywords: ['cv', 'resume', 'experience', 'career', 'education'],
    },
    {
      id: 'page-contact',
      label: 'Contact Studio',
      subtitle: 'Inquire for freelance projects, branding, Gmail & WhatsApp direct',
      path: '/contact',
      icon: Mail,
      category: 'Pages',
      keywords: ['hire', 'message', 'email', 'gmail', 'whatsapp', 'inquiry', 'quote'],
    },
    {
      id: 'tool-date',
      label: 'Nepali Date Converter (B.S. ↔ A.D.)',
      subtitle: 'Bikram Sambat, Gregorian converter & live Nepal Standard Time',
      path: '/arcade#date',
      icon: Calendar,
      category: 'Tools',
      keywords: ['nepal', 'bikram', 'sambat', 'bs', 'ad', 'converter', 'calendar', 'patro', 'nepali'],
    },
    {
      id: 'tool-pixel',
      label: 'Pixel Art Creator',
      subtitle: 'Interactive retro canvas, flood fill, color palette & high-res PNG export',
      path: '/arcade#pixel',
      icon: Grid,
      category: 'Tools',
      keywords: ['draw', 'pixel', 'paint', 'canvas', 'retro', '8-bit', 'export', 'artwork'],
    },
    {
      id: 'tool-palette',
      label: 'Color Palette Studio',
      subtitle: 'Generate harmonized color schemes & copy hex codes for UI design',
      path: '/arcade#palette',
      icon: Palette,
      category: 'Tools',
      keywords: ['colors', 'swatches', 'hex', 'generator', 'scheme', 'design'],
    },
    {
      id: 'game-tictactoe',
      label: 'Tic-Tac-Toe Arena',
      subtitle: 'Play vs AI or local 2-player with 6 clean themes & audio effects',
      path: '/arcade#tictactoe',
      icon: Trophy,
      category: 'Games',
      keywords: ['game', 'xo', 'ai', 'multiplayer', 'board', 'classic', 'minimalist', 'retro'],
    },
    {
      id: 'game-reaction',
      label: 'Reaction Rush',
      subtitle: 'Measure your reflex latency in milliseconds with instant feedback',
      path: '/arcade#reaction',
      icon: Zap,
      category: 'Games',
      keywords: ['speed', 'reflex', 'reaction', 'latency', 'milliseconds', 'test'],
    },
    {
      id: 'game-flexbox',
      label: 'CSS Flexbox Challenge',
      subtitle: 'Interactive visual alignment puzzle to master modern layout principles',
      path: '/arcade#flexbox',
      icon: Code,
      category: 'Games',
      keywords: ['css', 'flexbox', 'justify', 'align', 'developer', 'puzzle'],
    },
    {
      id: 'game-dino',
      label: 'Chrome Dino Runner',
      subtitle: 'Endless retro runner with high scores and dynamic jump physics',
      path: '/arcade#dino',
      icon: Gamepad2,
      category: 'Games',
      keywords: ['runner', 'jump', 'dinosaur', 'cactus', 'arcade', 'retro'],
    },
    {
      id: 'game-snake',
      label: 'Snake Arcade',
      subtitle: 'Classic retro snake with smooth controls, grid wrap & record score',
      path: '/arcade#snake',
      icon: Sparkles,
      category: 'Games',
      keywords: ['snake', 'retro', 'arcade', 'nokia', 'classic'],
    },
  ];

  // Dynamic project items mapped from published works
  const projectItems: PaletteItem[] = publishedProjects.map((p) => ({
    id: `project-${p.id}`,
    label: p.title,
    subtitle: `${p.category} (${p.year}) — ${p.client || 'Client Case Study'}`,
    path: `/work/${p.slug}`,
    icon: Sparkles,
    category: 'Projects',
    keywords: [
      p.category.toLowerCase(),
      p.client?.toLowerCase() || '',
      ...(p.tags || []).map((t) => t.toLowerCase()),
      ...(p.services || []).map((s) => s.toLowerCase()),
      ...(p.tools || []).map((t) => t.toLowerCase()),
    ],
  }));

  // Direct quick action item for switching theme when queried
  const quickThemeItem: PaletteItem = {
    id: 'action-theme',
    label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
    subtitle: `Toggle application color theme (currently ${theme})`,
    path: '#theme',
    icon: theme === 'dark' ? Sun : Moon,
    category: 'Pages',
    keywords: ['theme', 'dark', 'light', 'mode', 'color', 'toggle', 'switch'],
    action: () => toggleTheme(),
  };

  const allItems = useMemo(() => {
    return [...navigationItems, quickThemeItem, ...projectItems];
  }, [projectItems, theme]);

  // Optimized scoring and fuzzy-substring matching
  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    // Filter by category tab first
    let pool = allItems;
    if (selectedCategory !== 'All') {
      pool = pool.filter((item) => {
        if (selectedCategory === 'Tools' || selectedCategory === 'Games') {
          return item.category === selectedCategory;
        }
        return item.category === selectedCategory;
      });
    }

    if (!cleanQuery) {
      return pool;
    }

    // Rank by match quality
    return pool
      .map((item) => {
        const labelLower = item.label.toLowerCase();
        const subLower = item.subtitle.toLowerCase();
        const catLower = item.category.toLowerCase();
        const keywords = item.keywords || [];

        let score = 0;
        if (labelLower === cleanQuery) score += 100;
        else if (labelLower.startsWith(cleanQuery)) score += 60;
        else if (labelLower.includes(cleanQuery)) score += 40;

        if (keywords.some((k) => k === cleanQuery)) score += 50;
        else if (keywords.some((k) => k.startsWith(cleanQuery))) score += 30;
        else if (keywords.some((k) => k.includes(cleanQuery))) score += 20;

        if (subLower.includes(cleanQuery)) score += 15;
        if (catLower.includes(cleanQuery)) score += 10;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [allItems, query, selectedCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  const handleSelect = (item: PaletteItem) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search & Command Navigation"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-left flex flex-col max-h-[82vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Optimized Search Input Bar (No Kbd) */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10 shrink-0 bg-white dark:bg-[#18181b]">
          <Search className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, projects, arcade games, tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-medium"
            autoComplete="off"
            spellCheck="false"
          />
          <div className="flex items-center gap-1.5 ml-2">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer text-xs"
                title="Clear query"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Close search"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="px-3.5 py-2 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
          {(['All', 'Pages', 'Projects', 'Tools', 'Games'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-slate-400 font-mono hidden sm:inline">
            {filteredItems.length} result{filteredItems.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No matching results found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Try searching for &ldquo;branding&rdquo;, &ldquo;nepal&rdquo;, &ldquo;tictactoe&rdquo;, or &ldquo;resume&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{item.label}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider uppercase ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 ml-2 transition-transform ${
                      isSelected ? 'text-white translate-x-0.5' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info (Clean, no raw keyboard keys) */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">↑↓</span>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">↵</span>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Esc</span>
              <span>Close</span>
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">anilshrestha11.com.np</span>
        </div>
      </div>
    </div>
  );
};
