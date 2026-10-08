import React from 'react';
import { SITE_DOMAIN } from '../../lib/seo';

export const RobotsPage: React.FC = () => {
  const robotsTxt = `# robots.txt for Anil Shrestha Portfolio (anilshrestha11.com.np)
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/private/*

# Reference XML Sitemap
Sitemap: ${SITE_DOMAIN}/sitemap.xml
`;

  return (
    <div className="min-h-screen p-8 bg-[#111111] text-[#E0E0E0] font-mono text-xs overflow-x-auto text-left">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="pb-4 border-b border-[#333333] flex items-center justify-between text-[#888888]">
          <span>Generated robots.txt — {SITE_DOMAIN}</span>
          <span>Admin indexed = blocked</span>
        </div>
        <pre className="whitespace-pre leading-relaxed select-all">{robotsTxt}</pre>
      </div>
    </div>
  );
};
