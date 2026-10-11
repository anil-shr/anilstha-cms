/**
 * Utility functions for resolving WhatsApp targets into click-to-chat links.
 * Supports phone numbers (with or without '+'), wa.me short links, full URLs, and usernames.
 */
export function resolveWhatsAppUrl(target: string | undefined | null, messageText: string = ''): string {
  const clean = (target || '').trim();
  const encodedText = messageText ? encodeURIComponent(messageText) : '';

  if (!clean) {
    // Default fallback to artist's Nepal number
    const base = 'https://wa.me/9779841234567';
    return encodedText ? `${base}?text=${encodedText}` : base;
  }

  // If already an absolute http/https link
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

  // If alphanumeric username without digits only
  const hasLetters = /[a-zA-Z]/.test(clean);
  if (hasLetters && !clean.includes('+')) {
    const base = `https://wa.me/${clean}`;
    return encodedText ? `${base}?text=${encodedText}` : base;
  }

  // Otherwise, extract digits for clean international phone number
  const digits = clean.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${digits || '9779841234567'}`;
  return encodedText ? `${base}?text=${encodedText}` : base;
}
