import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { Cookie, Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CookiePolicyPage: React.FC<{ onOpenCookieSettings?: () => void }> = ({
  onOpenCookieSettings,
}) => {
  const { profile, cookieConsent } = useData();

  useEffect(() => {
    updateSEO({
      title: `Cookie Policy — ${profile.name || 'Anil Shrestha'}`,
      description: 'Comprehensive explanation of cookies, local storage mechanisms, and privacy preferences on the portfolio of Anil Shrestha.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/cookies' : '',
    });
  }, [profile]);

  return (
    <div className="min-h-screen py-12 md:py-20 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-left">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie & Storage Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Last Updated: October 2026 · Compliant with EU ePrivacy Directive & Global Consent Standards
          </p>
        </div>

        {/* Live Status & Quick Actions Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Status On This Device
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Analytics Tracking:{' '}
                <span className={cookieConsent.analytics ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                  {cookieConsent.analytics ? 'Enabled (Opted In)' : 'Disabled (Protected)'}
                </span>
              </span>
            </div>
          </div>

          {onOpenCookieSettings && (
            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manage Cookie Settings</span>
            </button>
          )}
        </div>

        {/* Core Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. What Are Cookies and Local Browser Storage?
            </h2>
            <p>
              Cookies and local browser storage (such as HTML5 <code>localStorage</code>) are small text-based data containers stored directly on your computer or mobile device when you access web services. They permit applications to preserve your chosen settings (like your preferred Light or Dark theme) and session state between visits.
            </p>
          </section>

          <section className="space-y-4 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Detailed Inventory of Storage Categories We Use
            </h2>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Strictly Necessary Storage (Essential)</span>
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Required to operate the website safely. These keys store your color theme choice (<code>portfolio-theme</code>), your cookie consent decision (<code>as_portfolio_cookie_consent</code>), and secure administrative authentication tokens if logging into the CMS. Because the site cannot function securely without these, they cannot be turned off.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-500" />
                    <span>Analytics Storage (Google Analytics 4)</span>
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-sky-300 font-bold">
                    Requires Opt-in Consent
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When permitted by you, Google Analytics tags evaluate aggregate, non-identifiable usage statistics (such as which portfolio case studies are most visited and bounce rates). These cookies are <strong>completely blocked by default</strong> until you click "Accept All" or toggle them on in your preferences.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. How to Block or Clear Cookies Through Your Browser
            </h2>
            <p>
              In addition to our in-site preference center, all modern web browsers allow you to inspect, manage, or delete cookies directly:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies.</li>
              <li><strong>Apple Safari:</strong> Settings → Safari → Advanced → Privacy & Website Data.</li>
              <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data.</li>
              <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions.</li>
            </ul>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {profile.name || 'Anil Shrestha'}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline text-blue-600 dark:text-sky-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline text-blue-600 dark:text-sky-400">Terms of Use</Link>
            <Link to="/contact" className="hover:underline text-blue-600 dark:text-sky-400">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
