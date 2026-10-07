import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { BarChart3, ExternalLink, ShieldCheck } from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const { siteSettings } = useData();

  const gaId =
    siteSettings.ga_id ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GA_ID) ||
    import.meta.env.VITE_GA_ID ||
    '';

  const trackedEvents = [
    {
      name: 'page_view',
      trigger: 'On each route transition (Home, About, Work, Services, Contact)',
      parameters: 'page_path',
      privacy: 'Aggregated URL paths only. No visitor identity.',
    },
    {
      name: 'project_view',
      trigger: 'When a visitor opens a specific project case study page',
      parameters: 'project_id, project_title',
      privacy: 'Categorical content metrics.',
    },
    {
      name: 'contact_form_start',
      trigger: 'When a visitor begins typing in the contact form',
      parameters: 'timestamp',
      privacy: 'Intent signal. No input contents recorded.',
    },
    {
      name: 'contact_form_submit',
      trigger: 'When an inquiry is successfully transmitted',
      parameters: 'subject_length',
      privacy: 'Strictly excludes user name, email, or message.',
    },
    {
      name: 'resume_click',
      trigger: 'When a visitor downloads or views the Curriculum Vitae',
      parameters: 'profile_name',
      privacy: 'Action trigger only.',
    },
    {
      name: 'CTA_click',
      trigger: 'When "View Selected Work" or "Let\'s Work Together" is clicked',
      parameters: 'cta_label, cta_destination',
      privacy: 'Interface interaction telemetry.',
    },
  ];

  return (
    <AdminLayout title="Analytics & Telemetry">
      <div className="space-y-8 max-w-5xl text-left">
        {/* Status Banner */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                Google Analytics 4 Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              In accordance with engineering standards, this system will not display synthetic or fabricated traffic graphs. Direct operational analytics are routed securely to your Google Analytics 4 property under Google Consent Mode.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs">
              <span className="font-mono text-slate-900 dark:text-white">
                Measurement ID: {gaId ? gaId : 'Not configured yet'}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                  gaId
                    ? 'border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'border-slate-200 dark:border-white/10 text-slate-500 bg-slate-50 dark:bg-white/5'
                }`}
              >
                {gaId ? 'Active & Ready' : 'Pending Key in Settings'}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Open GA4 Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Privacy & Consent Mode Verification */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs uppercase tracking-wider font-bold">
              Privacy Architecture & Consent Verification
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Analytics scripts remain entirely inactive until a visitor explicitly selects "Accept All" or enables Analytics in the Cookie Settings banner. When permitted, cookies like <code>_ga</code> collect anonymous aggregate traffic patterns without logging IP addresses or inquiry contents.
          </p>
        </div>

        {/* Event Taxonomy Specification */}
        <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-white">
              Registered Telemetry Event Schema
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {trackedEvents.length} Core Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Trigger Condition</th>
                  <th className="py-3 px-4">Parameters</th>
                  <th className="py-3 px-4">Privacy Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {trackedEvents.map((evt) => (
                  <tr key={evt.name} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-sky-400">
                      {evt.name}
                    </td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{evt.trigger}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {evt.parameters}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">{evt.privacy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
