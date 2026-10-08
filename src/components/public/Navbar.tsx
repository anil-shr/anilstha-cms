import React, { useState } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
  Search,
} from 'lucide-react';

export const Navbar: React.FC<{
  onOpenCommandPalette?: () => void;
}> = ({ onOpenCommandPalette }) => {
  const { path, navigate } = useRouter();
  const { profile } = useData();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Triple-click on monogram opens /admin securely
  const handleLogoClick = () => {
    navigate('/');
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        navigate('/admin');
        return 0;
      }
      return next;
    });
    setTimeout(() => setClickCount(0), 1500);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Skills', to: '/skills' },
    { label: 'Services', to: '/services' },
    { label: 'Work', to: '/work' },
    { label: 'Games & Tools', to: '/arcade' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <nav className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 rounded-full py-2 sm:py-2.5 px-3.5 sm:px-5 md:px-6 shadow-xs flex items-center justify-between transition-colors">
          {/* Left: Brand Monogram & Name */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none select-none cursor-pointer min-w-0"
            title="Anil Shrestha Portfolio (Triple-click for CMS)"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs transition-transform group-hover:scale-105 shrink-0">
              AS
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight block truncate">
                {profile.name || 'Anil Shrestha'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block tracking-wider uppercase truncate">
                {profile.profession || 'Graphic Designer & UI/UX'}
              </span>
            </div>
          </button>

          {/* Desktop Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = path === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-blue-600 dark:text-sky-400 bg-blue-50/80 dark:bg-sky-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Theme Toggle & Action CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer text-xs"
              title="Search & Quick Navigation (Cmd + K)"
              aria-label="Open command search"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono font-semibold px-1 rounded bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* Smooth Theme Switch (Sun & Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200/80 dark:border-white/10 cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Let's Work Together CTA */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex px-3.5 sm:px-4 md:px-5 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white bg-[#111111] dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs transition-all active:scale-95 items-center gap-1.5"
            >
              <span>LET'S WORK</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-all">
          <div className="bg-white dark:bg-[#18181b] border-t border-slate-200 dark:border-white/10 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#111111] dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {profile.name || 'Anil Shrestha'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Graphic Designer & UI/UX Specialist
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = path === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-sky-950/40 text-blue-600 dark:text-sky-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/10">
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-slate-900 font-bold text-center text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
              >
                <span>LET'S WORK TOGETHER</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
