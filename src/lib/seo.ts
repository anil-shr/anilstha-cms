export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

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
    config.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
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
