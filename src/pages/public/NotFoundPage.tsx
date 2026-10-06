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
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-24 text-center space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono text-[#888888] tracking-widest uppercase block">
          HTTP 404
        </span>
        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter text-[#111111]">
          404
        </h1>
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-lg font-bold uppercase tracking-tight text-[#111111]">
          Page Not Located
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
          The link you followed may be expired or the route may have moved. Explore the design archive or return to the main index.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#333333] transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/work"
          className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#111111] border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
        >
          <span>Browse Selected Work</span>
        </Link>
      </div>
    </div>
  );
};
