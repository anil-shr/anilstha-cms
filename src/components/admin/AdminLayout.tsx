import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { updateSEO } from '../../lib/seo';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  Wrench,
  History,
  Share2,
  Image as ImageIcon,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Plus,
  Cloud,
  HardDrive,
  MessageSquare,
  Sun,
  Moon,
} from 'lucide-react';

export const AdminLayout: React.FC<{
  title: string;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, actionButton, children }) => {
  const { path, navigate } = useRouter();
  const { user, isAdmin, logout, isCloudConnected, contactMessages } = useData();
  const { theme, toggleTheme } = useTheme();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Strictly enforce noindex for all admin pages
  useEffect(() => {
    updateSEO({
      title: `${title} — CMS Dashboard | Anil Shrestha`,
      description: 'Admin Content Management System',
      noindex: true,
    });
  }, [title]);

  // Auth guard: redirect to /admin/login if not authenticated
  useEffect(() => {
    let hasStoredAdmin = false;
    try {
      const stored = localStorage.getItem('as_admin_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role === 'admin') hasStoredAdmin = true;
      }
    } catch {}

    if (!isAdmin && !hasStoredAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const hasStoredAdmin = Boolean(
    typeof window !== 'undefined' &&
    (() => {
      try {
        const stored = localStorage.getItem('as_admin_auth');
        return stored ? JSON.parse(stored)?.role === 'admin' : false;
      } catch {
        return false;
      }
    })()
  );

  const unreadMessagesCount = (contactMessages || []).filter((m) => m.status === 'unread').length;

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Inquiries', to: '/admin/inquiries', icon: MessageSquare, badge: unreadMessagesCount },
    { label: 'Profile & Bio', to: '/admin/profile', icon: User },
    { label: 'Projects Archive', to: '/admin/projects', icon: Briefcase },
    { label: 'Services', to: '/admin/services', icon: Layers },
    { label: 'Skills & Tools', to: '/admin/skills', icon: Wrench },
    { label: 'Experience', to: '/admin/experience', icon: History },
    { label: 'Social Links', to: '/admin/social-links', icon: Share2 },
    { label: 'Media Library', to: '/admin/media', icon: ImageIcon },
    { label: 'Site Settings', to: '/admin/settings', icon: Settings },
    { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  ];

  if (!isAdmin && !hasStoredAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#121212] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white dark:bg-[#18181b] text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-white/10 shrink-0 sticky top-0 h-screen transition-colors duration-200">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Top Brand */}
          <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-600/30">
                AS
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">
                  CMS DASHBOARD
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight block">
                  Anil Shrestha
                </span>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-white/5"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold flex-1" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                path === item.to ||
                (item.to === '/admin/projects' && path.startsWith('/admin/projects'));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive
                          ? 'bg-white text-blue-600'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Status & Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                {isCloudConnected ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Cloud Sync</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-blue-600 dark:text-sky-400 font-medium">Local Storage</span>
                  </>
                )}
              </span>
              <span className="truncate max-w-[80px]" title={user?.email}>
                {user?.email?.split('@')[0]}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Sign out from CMS"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white dark:bg-[#18181b] text-slate-900 dark:text-white p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10 sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 text-slate-700 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Toggle admin menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-xs uppercase font-bold tracking-tight">Anil Shrestha CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <Link
            to="/"
            target="_blank"
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-white/5"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-white dark:bg-[#18181b] text-slate-900 dark:text-slate-200 z-50 p-6 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-1.5 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                path === item.to ||
                (item.to === '/admin/projects' && path.startsWith('/admin/projects'));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                logout();
                setMobileDrawerOpen(false);
                navigate('/admin/login');
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs text-red-500 dark:text-red-400 font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#f8fafc] dark:bg-[#121212] transition-colors duration-200">
        {/* Top bar inside dashboard */}
        <header className="bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:inline-flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
              title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            {actionButton || (
              <Link
                to="/admin/projects/new"
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};
