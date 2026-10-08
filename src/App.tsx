import React, { useState, useEffect } from 'react';
import { useRouter } from './lib/router';
import { useData } from './context/DataContext';
import { initGA } from './lib/analytics';
import { updateSEOByRoute } from './lib/seo';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { CookieBanner } from './components/public/CookieBanner';
import { MouseGlow } from './components/public/MouseGlow';
import { CommandPalette } from './components/public/CommandPalette';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { WorkPage } from './pages/public/WorkPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { SkillsPage } from './pages/public/SkillsPage';
import { ArcadePage } from './pages/public/ArcadePage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/public/CookiePolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { SitemapPage } from './pages/public/SitemapPage';
import { RobotsPage } from './pages/public/RobotsPage';
import { ResumePage } from './pages/public/ResumePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProfileEditorPage } from './pages/admin/ProfileEditorPage';
import { ProjectsListPage } from './pages/admin/ProjectsListPage';
import { ProjectFormPage } from './pages/admin/ProjectFormPage';
import { ServicesManagerPage } from './pages/admin/ServicesManagerPage';
import { SkillsManagerPage } from './pages/admin/SkillsManagerPage';
import { ExperienceManagerPage } from './pages/admin/ExperienceManagerPage';
import { SocialLinksPage } from './pages/admin/SocialLinksPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { AnalyticsDashboardPage } from './pages/admin/AnalyticsDashboardPage';
import { InquiriesPage } from './pages/admin/InquiriesPage';

export default function App() {
  const { path } = useRouter();
  const { siteSettings, cookieConsent } = useData();
  const [cookieSettingsModalOpen, setCookieSettingsModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Dynamically update SEO meta tags on every route transition
  useEffect(() => {
    updateSEOByRoute(path);
  }, [path]);

  // Global Keyboard Shortcut: Cmd/Ctrl + K opens Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize GA4 if measurement ID exists and user consented
  useEffect(() => {
    const gaId =
      siteSettings.ga_id ||
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GA_ID) ||
      import.meta.env.VITE_GA_ID;
    if (gaId) {
      initGA(gaId, cookieConsent.analytics);
    }
  }, [siteSettings.ga_id, cookieConsent.analytics]);

  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const isAdminRoute = normalizedPath.startsWith('/admin');

  // Render Admin application routes
  if (isAdminRoute) {
    if (normalizedPath === '/admin' || normalizedPath === '/admin/login') {
      return <AdminLoginPage />;
    }
    if (normalizedPath === '/admin/dashboard') {
      return <DashboardPage />;
    }
    if (normalizedPath === '/admin/profile') {
      return <ProfileEditorPage />;
    }
    if (normalizedPath === '/admin/projects') {
      return <ProjectsListPage />;
    }
    if (normalizedPath === '/admin/projects/new') {
      return <ProjectFormPage />;
    }
    if (normalizedPath.startsWith('/admin/projects/')) {
      return <ProjectFormPage />;
    }
    if (normalizedPath === '/admin/services') {
      return <ServicesManagerPage />;
    }
    if (normalizedPath === '/admin/skills') {
      return <SkillsManagerPage />;
    }
    if (normalizedPath === '/admin/experience') {
      return <ExperienceManagerPage />;
    }
    if (normalizedPath === '/admin/social-links') {
      return <SocialLinksPage />;
    }
    if (normalizedPath === '/admin/inquiries' || normalizedPath === '/admin/messages') {
      return <InquiriesPage />;
    }
    if (normalizedPath === '/admin/media') {
      return <MediaLibraryPage />;
    }
    if (normalizedPath === '/admin/settings') {
      return <SettingsPage />;
    }
    if (normalizedPath === '/admin/analytics') {
      return <AnalyticsDashboardPage />;
    }
    return <NotFoundPage />;
  }

  // Raw XML & text endpoints
  if (normalizedPath === '/sitemap.xml') {
    return <SitemapPage />;
  }
  if (normalizedPath === '/robots.txt') {
    return <RobotsPage />;
  }
  if (normalizedPath === '/resume') {
    return <ResumePage />;
  }

  // Render Public Website routes
  const renderPublicPage = () => {
    if (normalizedPath === '/') return <HomePage />;
    if (normalizedPath === '/about') return <AboutPage />;
    if (normalizedPath === '/work') return <WorkPage />;
    if (normalizedPath.startsWith('/work/')) return <ProjectDetailPage />;
    if (normalizedPath === '/services') return <ServicesPage />;
    if (normalizedPath === '/skills') return <SkillsPage />;
    if (normalizedPath === '/arcade') return <ArcadePage />;
    if (normalizedPath === '/contact') return <ContactPage />;
    if (normalizedPath === '/privacy') return <PrivacyPolicyPage />;
    if (normalizedPath === '/cookies') {
      return (
        <CookiePolicyPage
          onOpenCookieSettings={() => setCookieSettingsModalOpen(true)}
        />
      );
    }
    if (normalizedPath === '/terms') return <TermsPage />;
    return <NotFoundPage />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#121212] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white relative transition-colors duration-200">
      <MouseGlow />
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <main className="flex-1 relative z-10">{renderPublicPage()}</main>
      <Footer onOpenCookieSettings={() => setCookieSettingsModalOpen(true)} />
      <CookieBanner
        isOpenDirectly={cookieSettingsModalOpen}
        onCloseDirectly={() => setCookieSettingsModalOpen(false)}
      />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
