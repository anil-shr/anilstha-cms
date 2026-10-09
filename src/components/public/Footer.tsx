import React from 'react';
import { Link } from '../../lib/router';
import { useData } from '../../context/DataContext';
import { SocialIcon } from './SocialIcon';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC<{ onOpenCookieSettings?: () => void }> = ({
  onOpenCookieSettings,
}) => {
  const { profile, socialLinks, siteSettings } = useData();
  const currentYear = new Date().getFullYear();

  const activeSocials = socialLinks.filter((s) => s.active);
  const brandName = siteSettings?.fav_name || profile.name || 'Anil Shrestha';

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200 dark:border-white/5">
          {/* Brand & Designer Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              {siteSettings?.logo_url ? (
                <img
                  src={siteSettings.logo_url}
                  alt={brandName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0a0c10] dark:bg-white text-white dark:text-[#0a0c10] flex items-center justify-center font-bold text-xs tracking-tight shrink-0">
                  {siteSettings?.logo_text || 'AS'}
                </div>
              )}
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {brandName}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {profile.headline ||
                'Creative designer turning ideas into visual experiences. Branding, UI/UX, and print solutions based in Pokhara, Nepal.'}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                <span>{profile.location || 'Pokhara, Nepal'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  {profile.email || 'hello@anilshrestha.design'}
                </a>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">About Anil</Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Skills & Software</Link>
              </li>
              <li>
                <Link to="/work" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Design Work</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/arcade" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Games & Tools</Link>
              </li>
              <li>
                <Link to="/resume" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors font-medium">Resume PDF View</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social Profiles with Dynamic Icons */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Profiles & Portfolios
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeSocials.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all inline-flex items-center gap-1.5 shadow-2xs group"
                >
                  <SocialIcon platform={link.platform} customIconUrl={link.custom_icon_url} className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                  <span>{link.platform}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row (Zero admin links as requested) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {brandName}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Cookies</Link>
            {onOpenCookieSettings && (
              <button
                type="button"
                onClick={onOpenCookieSettings}
                className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Preferences
              </button>
            )}
            <Link to="/sitemap.xml" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
