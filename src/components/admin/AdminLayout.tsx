import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
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
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC<{
  title: string;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, actionButton, children }) => {
  const { path, navigate } = useRouter();
  const { user, isAdmin, logout, isCloudConnected } = useData();
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
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row selection:bg-indigo-600 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#0b0f19] text-slate-300 border-r border-white/10 shrink-0 sticky top-0 h-screen">
        <div>
          {/* Top Brand */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-600/30">
                AS
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                  CMS DASHBOARD
                </span>
                <span className="text-sm font-bold text-white tracking-tight block">
                  Anil Shrestha
                </span>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-md hover:bg-white/5"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                path === item.to ||
                (item.to === '/admin/projects' && path.startsWith('/admin/projects'));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              {isCloudConnected ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Cloud Sync</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-400">Local Active</span>
                </>
              )}
            </span>
            <span className="truncate max-w-[80px]" title={user?.email}>
              {user?.email?.split('@')[0]}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0b0f19] text-white p-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 text-white"
            aria-label="Toggle admin menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-xs uppercase font-bold tracking-tight">Anil Shrestha CMS</span>
        </div>

        <Link
          to="/"
          target="_blank"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-[#0b0f19] text-slate-200 z-50 p-6 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-1.5 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors text-white"
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                logout();
                setMobileDrawerOpen(false);
                navigate('/admin/login');
              }}
              className="flex items-center gap-2 w-full py-2.5 text-xs text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#07090e]">
        {/* Top bar inside dashboard */}
        <header className="bg-[#0b0f19]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30">
          <h1 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h1>

          <div className="flex items-center gap-3">
            {actionButton || (
              <Link
                to="/admin/projects/new"
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};
