import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { FileCheck, ShieldAlert, Award, Scale, Globe } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { profile } = useData();

  useEffect(() => {
    updateSEO({
      title: `Terms & Conditions — ${profile.name || 'Anil Shrestha'}`,
      description: 'Standard terms of use and intellectual property terms governing the design portfolio and services of Anil Shrestha in Nepal.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/terms' : '',
    });
  }, [profile]);

  return (
    <div className="min-h-screen py-12 md:py-20 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 text-left">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200 dark:border-white/10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Effective Date: October 2026 · Governed by the Laws of Nepal & International IP Conventions
          </p>
        </div>

        {/* Notice Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white block font-bold text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Scope of Terms</span>
          </strong>
          <p>
            These Terms of Service govern your access to and use of this website. By browsing this portfolio, previewing case studies, or transmitting inquiries, you agree to comply with these terms. Individual client design agreements, statements of work, and billing terms are executed separately through binding client contracts.
          </p>
        </div>

        {/* Core Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span>1. Intellectual Property & Copyright Protection</span>
            </h2>
            <p>
              All creative assets displayed on this site—including but not limited to brand identity systems, logo designs, typography pairings, packaging dielines, editorial book layouts, digital product interfaces, poster graphics, photography, and written case studies—are the intellectual property of <strong>{profile.name || 'Anil Shrestha'}</strong> and/or accredited client partners under the <strong>Nepalese Copyright Act, 2059 (2002)</strong> and the Berne Convention for the Protection of Literary and Artistic Works.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Authorized Evaluation:</strong> You are granted a limited, non-exclusive license to view and review these materials solely for evaluation, recruitment, hiring, and educational study.</li>
              <li><strong>Prohibited Actions:</strong> Downloading, republishing, selling, or duplicating any graphic marks, packaging dielines, or visual compositions without prior written authorization is strictly prohibited.</li>
              <li><strong>AI Training Prohibition:</strong> You may not scrape, harvest, or feed any visual designs or written case study content from this site into machine learning models, generative AI platforms, or automated datasets.</li>
            </ul>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-500" />
              <span>2. Transparent Business Standards & No Unsupported Claims</span>
            </h2>
            <p>
              We are committed to truthful, ethical design practice. All portfolio projects reflect genuine conceptual, client, or studio work led by {profile.name || 'Anil Shrestha'}.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>We do not publish fabricated client reviews, counterfeit awards, or misleading commercial guarantees.</li>
              <li>Project timelines and budget estimates presented in service overviews are indicative guidelines. Final commercial commitments are governed exclusively by executed master service agreements.</li>
            </ul>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              <span>3. Website Availability & Limitation of Liability</span>
            </h2>
            <p>
              This website is provided on an "as-is" and "as-available" basis for informational and portfolio review purposes. While we strive for uninterrupted, bug-free availability, we do not warrant that the website or interactive arcade tools will be error-free or uninterrupted at all times.
            </p>
            <p>
              To the maximum extent permitted by applicable law, {profile.name || 'Anil Shrestha'} Creative Studio shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of or inability to access this website.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. External Links & Third-Party Platforms
            </h2>
            <p>
              This site may include outbound links to third-party portfolio networks (such as Behance, Dribbble, GitHub, and LinkedIn). We do not control and are not responsible for the privacy practices, content, or terms of third-party external domains.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              5. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the substantive laws of <strong>Nepal</strong>, without regard to conflict of law principles. Any legal action or proceeding arising under these terms shall be subject to the exclusive jurisdiction of the competent courts in Pokhara or Kathmandu, Nepal.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {profile.name || 'Anil Shrestha'}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline text-blue-600 dark:text-sky-400">Privacy Policy</Link>
            <Link to="/cookies" className="hover:underline text-blue-600 dark:text-sky-400">Cookie Policy</Link>
            <Link to="/contact" className="hover:underline text-blue-600 dark:text-sky-400">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
