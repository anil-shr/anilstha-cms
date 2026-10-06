import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { profile } = useData();

  useEffect(() => {
    updateSEO({
      title: `Privacy Policy — ${profile.name || 'Anil Shrestha'}`,
      description: 'Privacy policy template outlining data collection, processing, and storage practices.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/privacy' : '',
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
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Effective Date: October 2026 · Status: Editorial Reference Template
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-[#ECECE9] border border-[#DEDEDA] text-xs text-[#555555] leading-relaxed">
          <strong className="text-[#111111] block mb-1">Notice & Jurisdictional Disclaimer</strong>
          This document serves as an operational privacy template for Anil Shrestha's portfolio and CMS. It should be formally reviewed against applicable local data regulations (including prevailing laws of Nepal and international privacy standards such as GDPR/CCPA where services are offered cross-border).
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#333333] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              1. Information We Collect
            </h2>
            <p>
              We collect information that you knowingly provide directly to us through the website's contact form, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#555555]">
              <li>Name and contact details (email address)</li>
              <li>Subject line and message contents regarding project inquiries</li>
              <li>Timestamp of inquiry submission</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              2. Analytics & Performance Tracking
            </h2>
            <p>
              When consent is explicitly granted via our cookie consent banner, this website uses Google Analytics 4 (GA4) to evaluate general audience patterns (such as page views, referring channels, and interaction counts). Google Analytics operates under Google Consent Mode. We do not transmit personally identifiable information (PII) such as your name, email, or message contents to analytics endpoints.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              3. Cloud Infrastructure & Data Storage
            </h2>
            <p>
              Our database, content management systems, and media storage are hosted using Supabase and PostgreSQL. Inquiries submitted through the contact interface are securely transmitted to our backend database and handled strictly for communication regarding design commissions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              4. Cookies and Local Storage
            </h2>
            <p>
              This site utilizes strictly necessary cookies and local browser storage to retain user consent preferences and support session authorization. Optional analytical tracking cookies are disabled by default until user consent is registered.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              5. Data Retention & User Rights
            </h2>
            <p>
              Contact form entries are retained only as long as necessary to review and fulfill your inquiry. You retain the right to request access to, correction of, or deletion of any personal data you have submitted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              6. Contact Information
            </h2>
            <p>
              For privacy-related questions or data removal requests, please direct correspondence to{' '}
              <a href={`mailto:${profile.email}`} className="text-[#111111] underline">
                {profile.email}
              </a>
              .
            </p>
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
