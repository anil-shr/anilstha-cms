import React from 'react';
import {
  Facebook,
  Instagram,
  Dribbble,
  Linkedin,
  Github,
  Twitter,
  Youtube,
  Mail,
  Globe,
} from 'lucide-react';

// Custom crisp Behance icon
export const BehanceIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.8 7.3H1.8v9.4h6c2.7 0 4.4-1.5 4.4-3.8 0-1.6-.9-2.7-2.3-3.2 1.1-.4 1.8-1.4 1.8-2.8 0-2.2-1.6-3.6-3.9-3.6zm-3.8 2.2h3.5c1.1 0 1.9.6 1.9 1.6 0 1-.8 1.6-1.9 1.6H4V9.5zm3.8 7.2H4v-3.7h3.8c1.3 0 2.2.7 2.2 1.8 0 1.2-.9 1.9-2.2 1.9zm10.7-7.2c-3.1 0-5.3 2.1-5.3 5.1s2.2 5.2 5.4 5.2c2.4 0 4.2-1.3 4.9-3.3h-2.5c-.4.9-1.3 1.4-2.4 1.4-1.6 0-2.8-1-2.9-2.6h7.9c.1-.3.1-.6.1-.9 0-3-2.1-4.9-5.2-4.9zm-2.8 4.2c.2-1.3 1.2-2.3 2.7-2.3 1.4 0 2.4.9 2.6 2.3h-5.3zm.7-6.2h4.3v1.5h-4.3V7.5z" />
  </svg>
);

export const SocialIcon: React.FC<{
  platform: string;
  customIconUrl?: string;
  className?: string;
}> = ({ platform, customIconUrl, className = 'w-4 h-4' }) => {
  if (customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt={platform}
        className={`${className} object-contain`}
      />
    );
  }

  const norm = (platform || '').toLowerCase().trim();

  if (norm.includes('facebook') || norm === 'fb') {
    return <Facebook className={className} />;
  }
  if (norm.includes('insta') || norm.includes('instagram')) {
    return <Instagram className={className} />;
  }
  if (norm.includes('behance')) {
    return <BehanceIcon className={className} />;
  }
  if (norm.includes('dribbble') || norm.includes('dribble')) {
    return <Dribbble className={className} />;
  }
  if (norm.includes('linkedin') || norm.includes('linkdin')) {
    return <Linkedin className={className} />;
  }
  if (norm.includes('github') || norm.includes('git')) {
    return <Github className={className} />;
  }
  if (norm.includes('twitter') || norm === 'x') {
    return <Twitter className={className} />;
  }
  if (norm.includes('youtube')) {
    return <Youtube className={className} />;
  }
  if (norm.includes('email') || norm.includes('mail')) {
    return <Mail className={className} />;
  }
  return <Globe className={className} />;
};
