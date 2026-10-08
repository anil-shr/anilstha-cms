import React from 'react';
import { useData } from '../../context/DataContext';
import { SITE_DOMAIN } from '../../lib/seo';

export const SitemapPage: React.FC = () => {
  const { projects } = useData();
  const baseUrl = SITE_DOMAIN;

  const publishedProjects = projects.filter((p) => p.published);

  const staticRoutes = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${baseUrl}/work`, priority: '0.9', changefreq: 'weekly' },
    { url: `${baseUrl}/about`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/services`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/skills`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/resume`, priority: '0.8', changefreq: 'monthly' },
    { url: `${baseUrl}/arcade`, priority: '0.7', changefreq: 'weekly' },
    { url: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
    { url: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
    { url: `${baseUrl}/terms`, priority: '0.3', changefreq: 'yearly' },
    { url: `${baseUrl}/cookies`, priority: '0.3', changefreq: 'yearly' },
  ];

  const projectRoutes = publishedProjects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: p.updated_at ? p.updated_at.split('T')[0] : '2026-10-08',
  }));

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${r.url}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
${projectRoutes
  .map(
    (r) => `  <url>
    <loc>${r.url}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return (
    <div className="min-h-screen p-8 bg-[#111111] text-[#E0E0E0] font-mono text-xs overflow-x-auto text-left">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="pb-4 border-b border-[#333333] flex items-center justify-between text-[#888888]">
          <span>Generated sitemap.xml — {SITE_DOMAIN}</span>
          <span>Includes {staticRoutes.length + projectRoutes.length} published URLs</span>
        </div>
        <pre className="whitespace-pre leading-relaxed select-all">{xmlContent}</pre>
      </div>
    </div>
  );
};
