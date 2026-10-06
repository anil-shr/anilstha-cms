import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { path, navigate } = useRouter();
  const { profile } = useData();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Keyboard shortcut Ctrl+Shift+A for admin CMS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Triple click on logo triggers secret admin navigation
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
      <header className="sticky top-4 z-40 px-4 md:px-8 max-w-7xl mx-auto">
        <nav className="bg-white/95 dark:bg-[#161a26]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 rounded-full py-2.5 px-4 md:px-6 shadow-sm flex items-center justify-between transition-colors">
          {/* Left: Brand Monogram & Name */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-3 text-left focus:outline-none select-none cursor-pointer"
            title="Anil Shrestha Portfolio (Triple-click for CMS)"
          >
            <div className="w-10 h-10 rounded-full bg-[#0a0c10] dark:bg-white text-white dark:text-[#0a0c10] flex items-center justify-center font-bold text-xs tracking-tight shadow-sm transition-transform group-hover:scale-105">
              AS
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                {profile.name || 'Anil Shrestha'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block tracking-wider uppercase">
                GRAPHIC DESIGNER & UI...
              </span>
            </div>
          </button>

          {/* Center: Desktop Nav Pills (Matches Screenshot) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-white/5 p-1 rounded-full border border-slate-200/60 dark:border-white/5">
            {navLinks.map((link) => {
              const isActive = path === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white dark:bg-[#1f2536] text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Theme Toggle & Action CTA */}
          <div className="flex items-center gap-2">
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

            {/* Let's Work Together CTA (Matches Screenshot) */}
            <Link
              to="/contact"
              className="px-4 md:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#0f1422] dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all active:scale-95 inline-flex items-center gap-1.5"
            >
              <span>LET'S WORK TOGETHER</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
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
          <div className="bg-white dark:bg-[#141824] border-t border-slate-200 dark:border-white/10 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0a0c10] dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs">
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
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
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
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 font-bold'
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
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-center text-sm shadow-sm flex items-center justify-center gap-2"
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
