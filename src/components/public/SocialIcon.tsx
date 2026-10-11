import React, { useState } from 'react';

export interface SocialIconProps {
  platform: string;
  customIconUrl?: string;
  className?: string;
  useBrandColor?: boolean;
}

/**
 * High-definition, pixel-aligned vector icons for all social networks and creative portfolios.
 * Features standard 24x24 viewBox, evenodd fill rules to eliminate black box glitching,
 * and support for custom upload URLs with error fallback.
 */
export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  customIconUrl,
  className = 'w-4 h-4',
  useBrandColor = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // If a valid custom icon URL is provided and has not errored, render it
  if (customIconUrl && !imgError && customIconUrl.trim() !== '') {
    return (
      <img
        src={customIconUrl}
        alt={platform}
        onError={() => setImgError(true)}
        className={`${className} object-contain shrink-0`}
      />
    );
  }

  const norm = (platform || '').toLowerCase().trim();

  // WhatsApp
  if (norm.includes('whatsapp') || norm === 'wa') {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#25D366]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.9C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.27 15.1 13.67 14.87 13.58C14.65 13.5 14.48 13.46 14.32 13.71C14.16 13.95 13.69 14.51 13.55 14.67C13.41 14.84 13.26 14.86 13.02 14.73C12.77 14.61 11.98 14.35 11.04 13.51C10.31 12.86 9.82 12.05 9.68 11.81C9.53 11.56 9.66 11.43 9.79 11.3C9.9 11.19 10.03 11.01 10.16 10.87C10.28 10.72 10.32 10.62 10.4 10.46C10.49 10.29 10.44 10.15 10.38 10.03C10.32 9.9 9.83 8.7 9.62 8.21C9.43 7.72 9.23 7.79 9.07 7.78C8.93 7.77 8.76 7.77 8.6 7.77C8.43 7.77 8.16 7.83 7.93 8.08C7.71 8.33 7.07 8.92 7.07 10.13C7.07 11.34 7.95 12.51 8.07 12.67C8.2 12.83 9.8 15.3 12.26 16.36C12.84 16.61 13.3 16.76 13.65 16.87C14.24 17.06 14.78 17.03 15.2 16.97C15.68 16.9 16.66 16.37 16.87 15.79C17.07 15.2 17.07 14.71 17.01 14.61C16.95 14.5 16.81 14.44 16.57 14.39Z"
        />
      </svg>
    );
  }

  // Facebook
  if (norm.includes('facebook') || norm === 'fb') {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#1877F2]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  // Instagram
  if (norm.includes('insta') || norm.includes('instagram')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#E4405F]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    );
  }

  // Behance
  if (norm.includes('behance')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#1769FF]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.79 7.3H1.8v9.4h6c2.7 0 4.4-1.5 4.4-3.8 0-1.6-.9-2.7-2.3-3.2 1.1-.4 1.8-1.4 1.8-2.8 0-2.2-1.6-3.6-3.9-3.6zm-3.8 2.2h3.5c1.1 0 1.9.6 1.9 1.6 0 1-.8 1.6-1.9 1.6H4V9.5zm3.8 7.2H4v-3.7h3.8c1.3 0 2.2.7 2.2 1.8 0 1.2-.9 1.9-2.2 1.9zm10.7-7.2c-3.1 0-5.3 2.1-5.3 5.1s2.2 5.2 5.4 5.2c2.4 0 4.2-1.3 4.9-3.3h-2.5c-.4.9-1.3 1.4-2.4 1.4-1.6 0-2.8-1-2.9-2.6h7.9c.1-.3.1-.6.1-.9 0-3-2.1-4.9-5.2-4.9zm-2.8 4.2c.2-1.3 1.2-2.3 2.7-2.3 1.4 0 2.4.9 2.6 2.3h-5.3zm.7-6.2h4.3v1.5h-4.3V7.5z"
        />
      </svg>
    );
  }

  // Dribbble
  if (norm.includes('dribbble') || norm.includes('dribble')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#EA4C89]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.897 10.978c-.287-.042-2.502-.349-4.93.639-.311-.692-.647-1.401-1.01-2.115 3.327-1.344 4.708-3.076 4.825-3.232a9.923 9.923 0 0 1 1.115 4.708zm-2.45-5.918c-.161.189-1.503 1.764-4.664 3.013-1.488-2.684-3.134-4.887-3.327-5.147A9.972 9.972 0 0 1 12 2c2.029 0 3.905.612 5.447 1.66zM8.948 3.513c.189.25 1.802 2.408 3.308 5.044-4.148 1.184-7.857 1.187-8.243 1.187a9.97 9.97 0 0 1 4.935-6.231zM2.083 12.06c.414 0 3.824-.035 7.857-1.127.35.7.674 1.393.974 2.068-5.398 1.637-7.234 4.89-7.355 5.111A9.957 9.957 0 0 1 2 12c0-.02 0-.04.083-.06zm3.504 7.039c.218-.344 2.215-3.313 7.275-4.845 1.34 3.535 1.884 6.55 1.933 6.843A9.932 9.932 0 0 1 12 22c-2.493 0-4.773-.915-6.413-2.401zm11.39 1.096c-.073-.4-.582-3.306-1.89-6.732 2.316-.99 4.34-.732 4.593-.695a9.96 9.96 0 0 1-2.703 7.427z"
        />
      </svg>
    );
  }

  // LinkedIn
  if (norm.includes('linkedin') || norm.includes('linkdin')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#0A66C2]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        />
      </svg>
    );
  }

  // GitHub
  if (norm.includes('github') || norm.includes('git')) {
    return (
      <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
        />
      </svg>
    );
  }

  // X (formerly Twitter)
  if (norm.includes('twitter') || norm === 'x') {
    return (
      <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  // YouTube
  if (norm.includes('youtube')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#FF0000]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        />
      </svg>
    );
  }

  // Pinterest
  if (norm.includes('pinterest')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#BD081C]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12S18.627 0 12 0z"
        />
      </svg>
    );
  }

  // TikTok
  if (norm.includes('tiktok')) {
    return (
      <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.891-2.891 2.896 2.896 0 0 1 2.891-2.891c.365 0 .71.071 1.025.2V9.43a6.34 6.34 0 0 0-1.025-.084 6.345 6.345 0 0 0-6.342 6.342 6.345 6.345 0 0 0 6.342 6.342 6.345 6.345 0 0 0 6.342-6.342V8.98a8.217 8.217 0 0 0 5.084 1.748V7.272a4.796 4.796 0 0 1-1.32-.586z"
        />
      </svg>
    );
  }

  // ArtStation
  if (norm.includes('artstation')) {
    return (
      <svg
        className={`${className} shrink-0 ${useBrandColor ? 'text-[#13AFF0]' : ''}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.332h13.757l-2.79-4.837H0zm24-.515a2.422 2.422 0 0 0-1.084-2.028L13.882 1.44a2.426 2.426 0 0 0-2.39-.144l-1.99 1.15 8.163 14.143H24v-.091zM9.544 5.922L4.08 15.394h10.93L9.544 5.922z"
        />
      </svg>
    );
  }

  // Email
  if (norm.includes('email') || norm.includes('mail')) {
    return (
      <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  // Default Globe / Web
  return (
    <svg
      className={`${className} shrink-0`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};
