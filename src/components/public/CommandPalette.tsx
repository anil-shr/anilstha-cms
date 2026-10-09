import React, { useState, useEffect, useRef } from 'react';
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
  Shield,
  Command,
  X,
  ExternalLink,
  Calendar,
} from 'lucide-react';

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const { projects } = useData();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const publishedProjects = (projects || []).filter((p) => p.published);

  const navigationItems = [
    { label: 'Home Page', subtitle: 'Overview, hero & featured works', path: '/', icon: User, category: 'Pages' },
    { label: 'Selected Works', subtitle: 'Browse case studies & client portfolio', path: '/work', icon: FolderKanban, category: 'Pages' },
    { label: 'Design Services', subtitle: 'Brand identity, UI/UX, packaging & print', path: '/services', icon: Layers, category: 'Pages' },
    { label: 'Technical Proficiencies', subtitle: 'Design tools, disciplines & software', path: '/skills', icon: Wrench, category: 'Pages' },
    { label: 'About Anil', subtitle: 'Creative director bio & background in Nepal', path: '/about', icon: User, category: 'Pages' },
    { label: 'Professional Resume', subtitle: 'Curriculum vitae & career timeline', path: '/resume', icon: FileText, category: 'Pages' },
    { label: 'Nepali Date Converter (B.S. ↔ A.D.)', subtitle: 'Live Nepal timezone, Bikram Sambat & Gregorian converter', path: '/arcade#date', icon: Calendar, category: 'Tools' },
    { label: 'Games & Creative Tools', subtitle: 'Chrome Dino, Snake, Palette Generator & BS Date', path: '/arcade', icon: Gamepad2, category: 'Pages' },
    { label: 'Contact Studio', subtitle: 'Inquire for freelance projects or employment', path: '/contact', icon: Mail, category: 'Pages' },
    { label: 'CMS Admin Dashboard', subtitle: 'Manage portfolio content remotely', path: '/admin', icon: Shield, category: 'Admin' },
  ];

  const projectItems = publishedProjects.map((p) => ({
    label: p.title,
    subtitle: `${p.category} (${p.year}) — ${p.client || 'Client Case Study'}`,
    path: `/work/${p.slug}`,
    icon: Sparkles,
    category: 'Projects',
  }));

  const allItems = [...navigationItems, ...projectItems];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: (typeof allItems)[0]) => {
    navigate(item.path);
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
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden text-left flex flex-col max-h-[80vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10 shrink-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a page, project, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 ml-2">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 rounded">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Quick Action</span>
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer font-medium"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No results found for &ldquo;<span className="text-slate-800 dark:text-slate-200 font-semibold">{query}</span>&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{item.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold tracking-wider uppercase ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] truncate ${
                          isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 ml-2 ${
                      isSelected ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-white/10 rounded font-mono">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-white/10 rounded font-mono">↓</kbd></span>
            <span>Select <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-white/10 rounded font-mono">↵</kbd></span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">anilshrestha11.com.np</span>
        </div>
      </div>
    </div>
  );
};
