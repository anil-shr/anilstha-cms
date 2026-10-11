/**
 * Utility functions for resolving WhatsApp targets into click-to-chat links.
 * Supports wa.me custom links (e.g. https://wa.me/anilstha.pkr), usernames, phone numbers.
 */
export function resolveWhatsAppUrl(target: string | undefined | null, messageText: string = ''): string {
  let clean = (target || '').trim();
  const encodedText = messageText ? encodeURIComponent(messageText) : '';

  if (!clean) {
    clean = 'https://wa.me/anilstha.pkr';
  }

  // If already an absolute http/https link (e.g. https://wa.me/anilstha.pkr)
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    if (!encodedText) return clean;
    const separator = clean.includes('?') ? '&' : '?';
    return `${clean}${separator}text=${encodedText}`;
  }

  // If starts with wa.me/ or api.whatsapp.com
  if (clean.startsWith('wa.me/') || clean.startsWith('api.whatsapp.com/')) {
    const full = `https://${clean}`;
    if (!encodedText) return full;
    const separator = full.includes('?') ? '&' : '?';
    return `${full}${separator}text=${encodedText}`;
  }

  // If starts with handle @
  if (clean.startsWith('@')) {
    const username = clean.slice(1).trim();
    const base = `https://wa.me/${username}`;
    return encodedText ? `${base}?text=${encodedText}` : base;
  }

  // If custom identifier or username containing letters (e.g. anilstha.pkr)
  if (/[a-zA-Z]/.test(clean) && !clean.includes('+')) {
    const base = `https://wa.me/${clean}`;
    return encodedText ? `${base}?text=${encodedText}` : base;
  }

  // Otherwise, extract digits for clean international phone number
  const digits = clean.replace(/[^0-9]/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/anilstha.pkr';
  return encodedText ? `${base}?text=${encodedText}` : base;
}
