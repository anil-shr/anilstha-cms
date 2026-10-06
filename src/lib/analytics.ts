// Google Analytics 4 tracking utility with Google Consent Mode support

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const initGA = (measurementId: string, allowed: boolean) => {
  if (typeof window === 'undefined' || !measurementId) return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('consent', 'default', {
    analytics_storage: allowed ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  if (!document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: false,
    });
  } else {
    gtag('consent', 'update', {
      analytics_storage: allowed ? 'granted' : 'denied',
    });
  }
};

export const updateGAConsent = (allowed: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: allowed ? 'granted' : 'denied',
    });
  }
};

export const trackEvent = (
  eventName: string,
  eventParams: Record<string, string | number | boolean> = {},
  allowed: boolean = true
) => {
  if (!allowed) return;
  if (typeof window !== 'undefined' && window.gtag) {
    // Sanitize parameters: strictly prevent PII
    const safeParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(eventParams)) {
      if (['email', 'name', 'message', 'phone'].includes(key.toLowerCase())) continue;
      safeParams[key] = value;
    }
    window.gtag('event', eventName, safeParams);
  }
};
