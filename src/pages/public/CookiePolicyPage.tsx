import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';

export const CookiePolicyPage: React.FC<{ onOpenCookieSettings?: () => void }> = ({
  onOpenCookieSettings,
}) => {
  const { profile } = useData();

  useEffect(() => {
    updateSEO({
      title: `Cookie Policy — ${profile.name || 'Anil Shrestha'}`,
      description: 'Comprehensive explanation of cookies and local storage mechanisms used on this website.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/cookies' : '',
    });
  }, [profile]);

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="pb-8 border-b border-[#DEDEDA] space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#6B6B6B] font-semibold block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Last Updated: October 2026
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#333333] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              What Are Cookies?
            </h2>
            <p>
              Cookies and local browser storage are small data files saved on your computer or mobile device when you access web services. They permit sites to remember actions and preferences over a period of time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              Inventory of Categories Used
            </h2>

            <div className="space-y-3">
              <div className="p-4 bg-white border border-[#DEDEDA]">
                <h3 className="font-semibold text-[#111111]">1. Strictly Necessary Storage</h3>
                <p className="text-xs text-[#555555] mt-1">
                  Required to operate the website safely, maintain administrative authentication sessions, and record your consent choices. These cannot be toggled off.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#DEDEDA]">
                <h3 className="font-semibold text-[#111111]">2. Analytics Cookies (Google Analytics 4)</h3>
                <p className="text-xs text-[#555555] mt-1">
                  When permitted, anonymous statistical tags (_ga, _ga_*) help us understand aggregate traffic volume and popular project case studies. Disabled by default until you click 'Accept All' or enable analytics in preferences.
                </p>
              </div>

              <div className="p-4 bg-white border border-[#DEDEDA]">
                <h3 className="font-semibold text-[#111111]">3. Preference Storage</h3>
                <p className="text-xs text-[#555555] mt-1">
                  Stores user interface preferences such as filter selections or accessibility adjustments.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              Managing Your Choices
            </h2>
            <p>
              You can adjust or revoke your cookie choices at any time by clicking the button below or via the link in the site footer:
            </p>
            {onOpenCookieSettings && (
              <button
                type="button"
                onClick={onOpenCookieSettings}
                className="mt-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors cursor-pointer"
              >
                Open Cookie Settings
              </button>
            )}
          </section>
        </div>

        <div className="pt-8 border-t border-[#DEDEDA]">
          <Link to="/" className="text-xs uppercase font-semibold text-[#111111] hover:underline">
            ← Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
