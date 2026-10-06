import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { BarChart3, ExternalLink, ShieldCheck, Activity, Eye, FileDown } from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  const { siteSettings, cookieConsent } = useData();

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
      <div className="space-y-8 max-w-5xl">
        {/* Status Banner */}
        <div className="bg-white border border-[#DEDEDA] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#111111]" />
              <h2 className="text-sm font-bold uppercase tracking-tight text-[#111111]">
                Google Analytics 4 Engine
              </h2>
            </div>
            <p className="text-xs text-[#555555] max-w-xl leading-relaxed">
              In accordance with engineering standards, this system will not display synthetic or fabricated traffic graphs. Direct operational analytics are routed securely to your Google Analytics 4 property under Google Consent Mode.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs">
              <span className="font-mono text-[#111111]">
                Measurement ID: {gaId ? gaId : 'Not configured yet'}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 border ${
                  gaId
                    ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                    : 'border-neutral-200 text-neutral-600 bg-neutral-50'
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
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors inline-flex items-center gap-2"
            >
              <span>Open GA4 Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Privacy & Consent Mode Verification */}
        <div className="bg-white border border-[#DEDEDA] p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-xs uppercase tracking-wider font-bold">
              Privacy Architecture & Consent Verification
            </h3>
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            Analytics scripts remain entirely inactive until a visitor explicitly selects "Accept All" or enables Analytics in the Cookie Settings banner. When permitted, cookies like <code>_ga</code> collect anonymous aggregate traffic patterns without logging IP addresses or inquiry contents.
          </p>
        </div>

        {/* Event Taxonomy Specification */}
        <div className="bg-white border border-[#DEDEDA] overflow-hidden">
          <div className="p-4 bg-[#F7F7F5] border-b border-[#DEDEDA] flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#111111]">
              Registered Telemetry Event Schema
            </span>
            <span className="text-[11px] font-mono text-[#888888]">
              {trackedEvents.length} Core Events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#DEDEDA] text-[#6B6B6B] uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Event Name</th>
                  <th className="py-3 px-4">Trigger Condition</th>
                  <th className="py-3 px-4">Parameters</th>
                  <th className="py-3 px-4">Privacy Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAE6]">
                {trackedEvents.map((evt) => (
                  <tr key={evt.name} className="hover:bg-[#FAFAFA]">
                    <td className="py-3 px-4 font-mono font-bold text-[#111111]">
                      {evt.name}
                    </td>
                    <td className="py-3 px-4 text-[#444444]">{evt.trigger}</td>
                    <td className="py-3 px-4 font-mono text-[#666666] text-[11px]">
                      {evt.parameters}
                    </td>
                    <td className="py-3 px-4 text-[#777777] text-[11px]">{evt.privacy}</td>
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
