import React, { useState, useEffect } from 'react';
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
  Home,
  User,
  Wrench,
  Layers,
  Briefcase,
  Gamepad2,
  Mail,
  FileText,
} from 'lucide-react';

export const Navbar: React.FC<{
  onOpenCommandPalette?: () => void;
}> = ({ onOpenCommandPalette }) => {
  const { path, navigate } = useRouter();
  const { profile, siteSettings } = useData();
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
    { label: 'Home', to: '/', icon: Home },
    { label: 'About', to: '/about', icon: User },
    { label: 'Skills', to: '/skills', icon: Wrench },
    { label: 'Services', to: '/services', icon: Layers },
    { label: 'Work', to: '/work', icon: Briefcase },
    { label: 'Games & Tools', to: '/arcade', icon: Gamepad2 },
    { label: 'Resume', to: '/resume', icon: FileText },
    { label: 'Contact', to: '/contact', icon: Mail },
  ];

  // Lock body scroll and close on Escape when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const brandTitle = siteSettings?.fav_name || profile?.name || 'Anil Shrestha';

  return (
    <>
      <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <nav className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 rounded-full py-2 sm:py-2.5 px-3.5 sm:px-5 md:px-6 shadow-xs flex items-center justify-between transition-colors">
          {/* Left: Brand Monogram & Name */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="group flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none select-none cursor-pointer min-w-0"
            title={`${brandTitle} Portfolio (Triple-click for CMS)`}
          >
            {siteSettings?.logo_url ? (
              <img
                src={siteSettings.logo_url}
                alt={brandTitle}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 dark:border-white/10 shadow-xs transition-transform group-hover:scale-105 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs transition-transform group-hover:scale-105 shrink-0">
                {siteSettings?.logo_text || 'AS'}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight block truncate">
                {brandTitle}
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100/90 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer text-xs font-medium"
              title="Search Portfolio & Tools"
              aria-label="Open command search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Search</span>
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

      {/* Mobile Slide-in Drawer Menu (Right-side slide-in) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Semi-transparent Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        {/* Slide-in Right Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className={`absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#18181b] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between p-5 sm:p-6 overflow-y-auto transform transition-transform duration-300 ease-out z-10 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                {siteSettings?.logo_url ? (
                  <img
                    src={siteSettings.logo_url}
                    alt={brandTitle}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#111111] dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                    {siteSettings?.logo_text || 'AS'}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {brandTitle}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                    {profile.profession || 'Graphic Designer & UI/UX'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                aria-label="Close menu drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions (Theme Switch & Search) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {onOpenCommandPalette && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCommandPalette();
                  }}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
                  title="Search site"
                  aria-label="Open search palette"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Nav Links List */}
            <nav className="py-2 space-y-1 text-xs font-semibold" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = path === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.label}</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Drawer Footer CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center text-xs uppercase tracking-wider shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>LET'S WORK TOGETHER</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <p className="text-[10px] text-center text-slate-400 font-mono">
              Based in Pokhara, Nepal • Worldwide Delivery
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};
