import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import portraitImg from '../../assets/images/anil_portrait_1791182391937.jpg';
import { Download, ArrowLeft, Printer, Mail, MapPin, Globe } from 'lucide-react';

export const ResumePage: React.FC = () => {
  const { profile, skills, experience } = useData();

  useEffect(() => {
    updateSEO({
      title: `${profile.name || 'Anil Shrestha'} — Graphic Designer Resume / CV (PDF View)`,
      description: 'Official Graphic Designer & UI/UX Specialist resume of Anil Shrestha.',
      noindex: true,
    });
  }, [profile]);

  const handlePrint = () => {
    window.print();
  };

  const resumeUrl = profile.resume_url || '';
  const hasUploadedPdf =
    Boolean(resumeUrl) &&
    resumeUrl !== '/resume' &&
    (resumeUrl.endsWith('.pdf') ||
      resumeUrl.startsWith('data:application/pdf') ||
      resumeUrl.includes('drive.google') ||
      resumeUrl.includes('dropbox'));

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#11141e] py-6 sm:py-10 px-4 sm:px-6 print:p-0 print:bg-white text-slate-800 dark:text-slate-200">
      
      {/* Top Action Bar (Completely Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#171b28] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-xs hover:bg-slate-50 dark:hover:bg-[#1f2334] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {hasUploadedPdf && (
            <a
              href={profile.resume_url}
              download="Anil_Shrestha_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Uploaded PDF</span>
            </a>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Main Resume Sheet Document (No site footer or navbar) */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#171b28] border border-slate-200 dark:border-white/10 p-8 sm:p-12 shadow-xl rounded-2xl print:rounded-none print:shadow-none print:border-none print:p-6 print:text-black">
        
        {/* Header with Portrait & Identity */}
        <header className="border-b border-slate-200 dark:border-white/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 print:border-slate-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#11141e] border-2 border-blue-500/20 shrink-0 print:w-16 print:h-16">
              <img
                src={portraitImg}
                alt={profile.name || 'Anil Shrestha'}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white print:text-black">
                {profile.name || 'Anil Shrestha'}
              </h1>
              <p className="text-sm font-semibold text-blue-600 dark:text-sky-400 mt-0.5 font-mono uppercase tracking-wider print:text-blue-900">
                {profile.profession || 'Graphic Designer & Visual Creative'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visual Branding • Packaging & Dielines • UI/UX Design • Vibe Coding
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 print:text-slate-700 sm:text-right font-mono">
            <p className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{profile.location || 'Pokhara, Nepal'}</span>
            </p>
            <p className="flex items-center sm:justify-end gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>{profile.email || 'hello@anilshrestha.design'}</span>
            </p>
            <p className="flex items-center sm:justify-end gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>anilshrestha.design</span>
            </p>
          </div>
        </header>

        {/* Professional Summary / About Anil */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 font-mono mb-2.5 print:text-blue-900">
            About & Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 print:text-black">
            {profile.long_bio || profile.short_bio ||
              'Creative Graphic Designer with 3–5 years of specialized experience in visual communication, branding systems, and intuitive UI/UX design. Based in Pokhara, Nepal, I bridge human empathy with aesthetic precision across digital products, mobile interfaces, and high-impact print collateral.'}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 font-mono mb-4 print:text-blue-900">
            Work Experience & Client Roles
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-blue-500/40 pl-4 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white print:text-black">
                    {exp.position}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {exp.start_date} – {exp.end_date || 'Present'}
                  </span>
                </div>
                <p className="text-xs font-medium text-blue-600 dark:text-sky-400">
                  {exp.company} • {exp.location || 'Nepal'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 print:text-slate-800">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Skills & Disciplines */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400 font-mono mb-4 print:text-blue-900">
            Design Disciplines & Software Toolkit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1f2333] border border-slate-200 dark:border-white/10 print:border-slate-300 print:bg-white">
              <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-2">
                Graphic & Visual Disciplines
              </h4>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 print:text-black">
                <li>• Brand Identity Systems & Logo Suites</li>
                <li>• Packaging Design & Dieline Engineering</li>
                <li>• Cultural Posters, Banners & Signage</li>
                <li>• UI/UX Design, Mobile & Web App Interfaces</li>
                <li>• Pre-Press Color Separation & Spot UV Layout</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1f2333] border border-slate-200 dark:border-white/10 print:border-slate-300 print:bg-white">
              <h4 className="font-bold text-slate-900 dark:text-white print:text-black mb-2">
                Software & Tool Proficiencies
              </h4>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 print:text-black">
                <li>• Adobe Illustrator (Vector Branding, Print Dielines)</li>
                <li>• Adobe Photoshop (High-End Retouching, Key Visuals)</li>
                <li>• Figma (UI/UX, Prototypes, Design Tokens)</li>
                <li>• Adobe InDesign (Editorial Layout & Catalogues)</li>
                <li>• Tailwind CSS & Vibe Coding Systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Note of the Document */}
        <footer className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 print:border-slate-300">
          <span>Official Design Resume of Anil Shrestha • Pokhara, Nepal</span>
          <span className="font-mono">Updated 2026</span>
        </footer>

      </div>
    </div>
  );
};
