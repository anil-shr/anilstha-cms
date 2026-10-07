import React, { useEffect } from 'react';
import { updateSEO } from '../../lib/seo';
import { Link } from '../../lib/router';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: '404: Page Not Found — Anil Shrestha',
      description: 'The requested page could not be located in this portfolio archive.',
      noindex: true,
    });
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="space-y-2">
        <span className="text-xs font-mono text-blue-600 dark:text-sky-400 tracking-widest uppercase block font-semibold">
          HTTP 404
        </span>
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
          404
        </h1>
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-bold uppercase tracking-tight text-slate-900 dark:text-white">
          Page Not Located
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The link you followed may be expired or the route may have moved. Explore the design archive or return to the main index.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/work"
          className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 hover:border-blue-500 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Browse Selected Work</span>
        </Link>
      </div>
    </div>
  );
};
