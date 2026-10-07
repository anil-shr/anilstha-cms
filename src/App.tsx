import React, { useState, useEffect } from 'react';
import { useRouter } from './lib/router';
import { useData } from './context/DataContext';
import { initGA } from './lib/analytics';

// Public Components
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { CookieBanner } from './components/public/CookieBanner';
import { MouseGlow } from './components/public/MouseGlow';

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

  const isAdminRoute = path.startsWith('/admin');

  // Render Admin application routes
  if (isAdminRoute) {
    if (path === '/admin' || path === '/admin/login') {
      return <AdminLoginPage />;
    }
    if (path === '/admin/dashboard') {
      return <DashboardPage />;
    }
    if (path === '/admin/profile') {
      return <ProfileEditorPage />;
    }
    if (path === '/admin/projects') {
      return <ProjectsListPage />;
    }
    if (path === '/admin/projects/new') {
      return <ProjectFormPage />;
    }
    if (path.startsWith('/admin/projects/')) {
      return <ProjectFormPage />;
    }
    if (path === '/admin/services') {
      return <ServicesManagerPage />;
    }
    if (path === '/admin/skills') {
      return <SkillsManagerPage />;
    }
    if (path === '/admin/experience') {
      return <ExperienceManagerPage />;
    }
    if (path === '/admin/social-links') {
      return <SocialLinksPage />;
    }
    if (path === '/admin/inquiries' || path === '/admin/messages') {
      return <InquiriesPage />;
    }
    if (path === '/admin/media') {
      return <MediaLibraryPage />;
    }
    if (path === '/admin/settings') {
      return <SettingsPage />;
    }
    if (path === '/admin/analytics') {
      return <AnalyticsDashboardPage />;
    }
    return <NotFoundPage />;
  }

  // Raw XML & text endpoints
  if (path === '/sitemap.xml') {
    return <SitemapPage />;
  }
  if (path === '/robots.txt') {
    return <RobotsPage />;
  }
  if (path === '/resume') {
    return <ResumePage />;
  }

  // Render Public Website routes
  const renderPublicPage = () => {
    if (path === '/') return <HomePage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/work') return <WorkPage />;
    if (path.startsWith('/work/')) return <ProjectDetailPage />;
    if (path === '/services') return <ServicesPage />;
    if (path === '/skills') return <SkillsPage />;
    if (path === '/arcade') return <ArcadePage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/privacy') return <PrivacyPolicyPage />;
    if (path === '/cookies') {
      return (
        <CookiePolicyPage
          onOpenCookieSettings={() => setCookieSettingsModalOpen(true)}
        />
      );
    }
    if (path === '/terms') return <TermsPage />;
    return <NotFoundPage />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#121212] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white relative transition-colors duration-200">
      <MouseGlow />
      <Navbar />
      <main className="flex-1 relative z-10">{renderPublicPage()}</main>
      <Footer onOpenCookieSettings={() => setCookieSettingsModalOpen(true)} />
      <CookieBanner
        isOpenDirectly={cookieSettingsModalOpen}
        onCloseDirectly={() => setCookieSettingsModalOpen(false)}
      />
    </div>
  );
}
