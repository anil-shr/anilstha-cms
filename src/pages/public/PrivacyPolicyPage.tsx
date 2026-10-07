import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { Shield, Lock, FileText, CheckCircle2, Mail, Globe, MapPin } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { profile } = useData();

  useEffect(() => {
    updateSEO({
      title: `Privacy Policy — ${profile.name || 'Anil Shrestha'}`,
      description: 'Privacy policy outlining data minimization, inquiry handling, analytics consent, and visitor rights under global privacy regulations.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/privacy' : '',
    });
  }, [profile]);

  return (
    <div className="min-h-screen py-12 md:py-20 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-left">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal Compliance & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Effective Date: October 2026 · Compliant with Nepal Privacy Act (2075), GDPR & CCPA
          </p>
        </div>

        {/* Business & Controller Identification */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Data Controller & Studio Identification</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
              <span><strong>Studio:</strong> {profile.name || 'Anil Shrestha'} Creative Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span><strong>Location:</strong> {profile.location || 'Pokhara, Nepal'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span><strong>Email:</strong> {profile.email || 'hello@anilshrestha.design'}</span>
            </div>
          </div>
        </div>

        {/* Core Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>1. Data Minimization & Information We Collect</span>
            </h2>
            <p>
              We practice strict <strong>data minimization</strong>. We do not require account registration for general visitors, we do not employ fingerprinting, and we do not collect unnecessary background telemetry. We only receive personal information that you knowingly submit via our contact form:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Contact Identity:</strong> Your full name and email address.</li>
              <li><strong>Inquiry Content:</strong> Project service interests, budget/timeline selections, and message notes.</li>
              <li><strong>Submission Metadata:</strong> An automated timestamp used strictly to sequence correspondence.</li>
            </ul>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>We never sell, lease, rent, or trade your contact information to data brokers or advertising third parties.</span>
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Lawful Basis & How We Use Your Data
            </h2>
            <p>
              Your contact details are processed strictly for legitimate business correspondence:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Responding directly to freelance inquiries, job invitations, or design consultations.</li>
              <li>Drafting design project briefs, estimates, and formal client service agreements.</li>
              <li>Maintaining administrative records of completed and ongoing client correspondence.</li>
            </ul>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Analytics & Cookie Consent (Google Consent Mode v2)
            </h2>
            <p>
              This website employs <strong>Google Analytics 4 (GA4)</strong> strictly when prior explicit consent is granted via our Cookie Banner. Analytics tags are disabled by default until you click "Accept All" or opt-in through preferences.
            </p>
            <p>
              Under Google Consent Mode v2, analytics data is anonymized and aggregated (measuring page views, top design case studies, and device viewports) without transmitting personally identifiable information.
            </p>
            <div className="pt-2">
              <Link
                to="/cookies"
                className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
              >
                Read our full Cookie Inventory & Policy →
              </Link>
            </div>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Your Global Rights (GDPR, CCPA & Nepal Privacy Act 2075)
            </h2>
            <p>
              Regardless of your geographic location, you retain full sovereignty over your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Right of Access & Portability:</strong> You may request a copy of any communications we hold with you.</li>
              <li><strong>Right to Rectification:</strong> You may correct outdated or inaccurate contact details.</li>
              <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> You may request immediate deletion of your past inquiries from our database.</li>
              <li><strong>Right to Non-Discrimination:</strong> Exercising your privacy rights will never alter the portfolio services accessible to you.</li>
            </ul>
            <p className="text-xs pt-1">
              To exercise any privacy right, email us directly at{' '}
              <a href={`mailto:${profile.email || 'hello@anilshrestha.design'}`} className="text-blue-600 dark:text-sky-400 underline">
                {profile.email || 'hello@anilshrestha.design'}
              </a>
              . Requests are verified and honored within 30 days.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              5. Data Security & Retention Period
            </h2>
            <p>
              Inquiries are stored using secure SSL/TLS encrypted transport and protected databases with strict Row-Level Security (RLS). We retain contact messages only for as long as necessary to facilitate ongoing professional dialogue, typically up to 24 months, after which archived correspondence is permanently pruned.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {profile.name || 'Anil Shrestha'}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:underline text-blue-600 dark:text-sky-400">Terms of Use</Link>
            <Link to="/cookies" className="hover:underline text-blue-600 dark:text-sky-400">Cookie Policy</Link>
            <Link to="/contact" className="hover:underline text-blue-600 dark:text-sky-400">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
