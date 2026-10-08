export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

export const SITE_DOMAIN = 'https://anilshrestha11.com.np';

export const updateSEO = (config: SEOConfig) => {
  if (typeof document === 'undefined') return;

  // Title
  document.title = config.title;

  // Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', config.description);

  // Robots (noindex / nofollow for admin)
  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (config.noindex) {
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');
  } else if (robotsMeta) {
    robotsMeta.setAttribute('content', 'index, follow');
  }

  // Canonical URL
  const currentUrl =
    config.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : SITE_DOMAIN);
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', currentUrl);

  // OpenGraph Tags
  setMetaTag('og:title', config.title, true);
  setMetaTag('og:description', config.description, true);
  setMetaTag('og:type', config.ogType || 'website', true);
  setMetaTag('og:url', currentUrl, true);
  if (config.ogImage) {
    setMetaTag('og:image', config.ogImage, true);
  }

  // Twitter Tags
  setMetaTag('twitter:card', 'summary_large_image', false);
  setMetaTag('twitter:title', config.title, false);
  setMetaTag('twitter:description', config.description, false);
  if (config.ogImage) {
    setMetaTag('twitter:image', config.ogImage, false);
  }

  // JSON-LD structured data
  let jsonLdScript = document.getElementById('seo-json-ld');
  if (config.jsonLd) {
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'seo-json-ld';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(config.jsonLd);
  } else if (jsonLdScript) {
    jsonLdScript.remove();
  }
};

function setMetaTag(name: string, content: string, isProperty: boolean) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Route-based SEO helper to dynamically update meta tags based on the current pathname
 */
export const updateSEOByRoute = (pathname: string, custom?: Partial<SEOConfig>) => {
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const canonicalUrl = `${SITE_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;

  const defaultRouteMeta: Record<string, { title: string; description: string; ogType?: 'website' | 'article' | 'profile'; noindex?: boolean }> = {
    '/': {
      title: 'Anil Shrestha — Graphic Designer & UI/UX Specialist | Pokhara, Nepal',
      description: 'Portfolio of Anil Shrestha, a multidisciplinary graphic designer and UI/UX specialist from Pokhara, Nepal crafting brand identities, mobile interfaces, and print collateral.',
      ogType: 'website',
    },
    '/work': {
      title: 'Selected Works & Case Studies — Anil Shrestha Design',
      description: 'Explore selected graphic design, branding systems, mobile apps, and packaging case studies by Anil Shrestha.',
      ogType: 'website',
    },
    '/about': {
      title: 'About Anil Shrestha — Creative Vision & Design Philosophy',
      description: 'Learn about Anil Shrestha, 3–5 years experienced graphic designer & UI/UX specialist based in Pokhara, Nepal.',
      ogType: 'profile',
    },
    '/services': {
      title: 'Design Capabilities & Creative Services — Anil Shrestha',
      description: 'Comprehensive design services including Brand Identity, UI/UX Mobile & Web, Print & Packaging, and Marketing Collateral.',
      ogType: 'website',
    },
    '/skills': {
      title: 'Technical Proficiencies & Design Tools — Anil Shrestha',
      description: 'Mastered design tools and disciplines: Figma, Adobe Illustrator, Photoshop, InDesign, typography, layout, and UI systems.',
      ogType: 'website',
    },
    '/arcade': {
      title: 'Interactive Designer Arcade & Tools — Anil Shrestha',
      description: 'Interactive designer arcade featuring Chrome Dino Runner with classic/minimal/retro/cyberpunk themes, Snake Game, Color Palette Generator, and Nepal BS Date Converter.',
      ogType: 'website',
    },
    '/contact': {
      title: 'Contact & Project Inquiries — Anil Shrestha Design Studio',
      description: 'Get in touch with Anil Shrestha for freelance projects, full-time opportunities, branding consultations, and creative collaborations.',
      ogType: 'website',
    },
    '/resume': {
      title: 'Professional Resume & Career Timeline — Anil Shrestha',
      description: 'View the complete professional curriculum vitae of Anil Shrestha, Lead Graphic Designer & UI/UX Specialist.',
      ogType: 'profile',
    },
    '/privacy': {
      title: 'Privacy Policy — Anil Shrestha Portfolio',
      description: 'Privacy policy and user data protection details for anilshrestha11.com.np.',
      ogType: 'website',
    },
    '/terms': {
      title: 'Terms of Service — Anil Shrestha Portfolio',
      description: 'Terms of service and intellectual property guidelines for anilshrestha11.com.np.',
      ogType: 'website',
    },
    '/cookies': {
      title: 'Cookie Policy — Anil Shrestha Portfolio',
      description: 'Cookie policy and consent settings for anilshrestha11.com.np.',
      ogType: 'website',
    },
  };

  if (cleanPath.startsWith('/admin')) {
    updateSEO({
      title: custom?.title || 'CMS Admin Dashboard — Anil Shrestha',
      description: 'Restricted administrative dashboard for portfolio content management.',
      canonicalUrl,
      noindex: true,
      ...custom,
    });
    return;
  }

  const meta = defaultRouteMeta[cleanPath] || {
    title: 'Anil Shrestha — Graphic Designer & UI/UX Specialist',
    description: 'Portfolio of Anil Shrestha, Graphic Designer & UI/UX Specialist from Pokhara, Nepal.',
    ogType: 'website',
  };

  updateSEO({
    title: custom?.title || meta.title,
    description: custom?.description || meta.description,
    canonicalUrl: custom?.canonicalUrl || canonicalUrl,
    ogType: custom?.ogType || meta.ogType,
    ogImage: custom?.ogImage || `${SITE_DOMAIN}/assets/anil_portrait_1791182391937.jpg`,
    noindex: custom?.noindex || meta.noindex,
    ...custom,
  });
};
