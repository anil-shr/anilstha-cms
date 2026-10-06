import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { updateSEO } from '../../lib/seo';
import { trackEvent } from '../../lib/analytics';
import { SpotlightCard } from '../../components/public/SpotlightCard';
import {
  Palette,
  ArrowRight,
  CheckCircle2,
  Layers,
  Layout,
  Sparkles,
  Mail,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { profile, services, cookieConsent } = useData();

  useEffect(() => {
    updateSEO({
      title: `Services & Visual Solutions — ${profile.name || 'Anil Shrestha'}`,
      description:
        'Professional graphic design, brand identity systems, packaging dielines, and UI/UX design services by Anil Shrestha in Nepal.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/services' : '',
    });
    trackEvent('page_view', { page_path: '/services' }, cookieConsent.analytics);
  }, [profile, cookieConsent.analytics]);

  const activeServices = services.filter((s) => s.active);

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Services & Solutions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Graphic Design & Creative Services
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          From full brand identity systems and custom packaging to intuitive web & mobile interfaces, delivering tactile quality and visual distinction.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeServices.map((srv) => (
          <SpotlightCard key={srv.id} className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{srv.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{srv.description}</p>
            </div>

            {srv.deliverables && srv.deliverables.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Deliverables & Outputs:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                  {srv.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Custom Quote & Timeline</span>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline"
              >
                <span>Request Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
