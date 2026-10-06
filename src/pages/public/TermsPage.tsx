import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';

export const TermsPage: React.FC = () => {
  const { profile } = useData();

  useEffect(() => {
    updateSEO({
      title: `Terms & Conditions — ${profile.name || 'Anil Shrestha'}`,
      description: 'Standard terms of use and intellectual property terms for the graphic design portfolio of Anil Shrestha.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/terms' : '',
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
            Terms & Conditions
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Effective Date: October 2026 · General Template
          </p>
        </div>

        <div className="p-4 bg-[#ECECE9] border border-[#DEDEDA] text-xs text-[#555555] leading-relaxed">
          <strong className="text-[#111111] block mb-1">Standard Legal Disclaimer</strong>
          This document represents standard operational terms for website visitors and prospective clients. Actual client design agreements are executed separately through individual binding proposals or service contracts.
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#333333] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              1. Intellectual Property & Portfolio Works
            </h2>
            <p>
              All graphic design work, logos, marks, editorial layouts, poster compositions, case study narratives, photography, and digital representations featured on this website are the intellectual property of Anil Shrestha and/or their respective accredited commissioning clients.
            </p>
            <p>
              Reproduction, redistribution, training of generative systems, or commercial re-use of these assets without express written consent is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              2. Website Use & Accuracy
            </h2>
            <p>
              While reasonable efforts are made to ensure portfolio case studies, service descriptions, and contact availability are accurate, all content is provided "as is" for informational and demonstration purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              3. External Links
            </h2>
            <p>
              This website may reference external platforms (such as Behance, Dribbble, LinkedIn, or client live websites). We do not control or assume responsibility for external content or practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
              4. Inquiries & Project Commissioning
            </h2>
            <p>
              Submitting an inquiry through the contact interface does not constitute an agreement or reservation of project dates until mutual project terms, deliverables, timeline, and deposit terms are formally confirmed in writing.
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
