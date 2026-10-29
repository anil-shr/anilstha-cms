import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from '../../lib/router';
import { SpotlightCard } from './SpotlightCard';
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { playClick } from '../../lib/soundEffects';

const ClientAvatar: React.FC<{
  avatarUrl?: string | null;
  name: string;
}> = ({ avatarUrl, name }) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Reset failure state if URL changes
  useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  const initials = (name || 'CL')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (avatarUrl && !imgFailed) {
    return (
      <div className="w-13 h-13 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 border-2 border-slate-200 dark:border-white/20 ring-4 ring-slate-100 dark:ring-white/5 shadow-xs shrink-0">
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="w-13 h-13 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-2 border-slate-200 dark:border-white/20 ring-4 ring-slate-100 dark:ring-white/5 shadow-xs shrink-0 flex items-center justify-center font-bold text-sm tracking-wider font-mono select-none">
      {initials}
    </div>
  );
};

export const TestimonialsSlider: React.FC<{
  title?: string;
  subtitle?: string;
  className?: string;
}> = ({
  title = 'What Clients & Collaborators Say',
  subtitle = 'Real feedback from founders, product teams, and festival organizers who trusted my design expertise.',
  className = '',
}) => {
  const { testimonials } = useData();

  // Only display published testimonials in public slider
  const publishedItems = testimonials.filter((t) => t.published);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = publishedItems.length;

  const goToSlide = useCallback(
    (nextIdx: number) => {
      if (isTransitioning || nextIdx === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setIsTransitioning(false);
      }, 180);
    },
    [isTransitioning, currentIndex]
  );

  const handlePrev = useCallback(() => {
    playClick();
    goToSlide((currentIndex - 1 + total) % total);
  }, [currentIndex, total, goToSlide]);

  const handleNext = useCallback(() => {
    playClick();
    goToSlide((currentIndex + 1) % total);
  }, [currentIndex, total, goToSlide]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, handleNext]);

  if (total === 0) return null;

  const current = publishedItems[currentIndex] || publishedItems[0];

  return (
    <section
      className={`relative py-16 sm:py-24 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Soft Glows optimized for both light and dark backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-sky-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLIENT REPUTATION & PROOF</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Slider Card */}
        <div className="relative">
          <SpotlightCard className="p-8 sm:p-12 md:p-14 rounded-3xl bg-white dark:bg-[#1a1a1a]/95 border border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden text-left min-h-[360px] sm:min-h-[330px] flex flex-col justify-between transition-colors">
            {/* Giant decorative quotation watermark */}
            <Quote className="absolute right-6 -bottom-6 w-44 h-44 text-blue-500/10 dark:text-white/[0.03] pointer-events-none -rotate-12 select-none transition-colors" />

            {/* Top row: Rating stars & counter */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 shadow-xs">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${
                        i < current.rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold font-mono">
                  {current.rating}.0 Rating
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-xs">
                {currentIndex + 1} / {total}
              </div>
            </div>

            {/* Middle: Testimonial Quote with smooth crossfade */}
            <div className="my-6 sm:my-8 relative min-h-[110px] sm:min-h-[90px] flex items-center">
              <div
                className={`transition-all duration-200 ease-out w-full ${
                  isTransitioning
                    ? 'opacity-0 translate-y-1 scale-[0.99]'
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                <blockquote className="text-lg sm:text-2xl md:text-3xl font-serif italic font-normal text-slate-900 dark:text-slate-100 leading-relaxed sm:leading-snug tracking-tight">
                  "{current.quote}"
                </blockquote>
              </div>
            </div>

            {/* Bottom: Client Profile + Navigation Controls */}
            <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Client Info with smooth transition */}
              <div
                className={`flex items-center gap-4 transition-all duration-200 ease-out ${
                  isTransitioning
                    ? 'opacity-0 translate-y-1'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <ClientAvatar
                  avatarUrl={current.avatar_url}
                  name={current.client_name}
                />

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white truncate">
                      {current.client_name}
                    </h4>
                    <span title="Verified Client">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                    {current.client_role} •{' '}
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">
                      {current.company}
                    </span>
                  </p>
                </div>
              </div>

              {/* Case study link if available, plus Prev/Next controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                {current.project_url && (
                  <Link
                    to={current.project_url}
                    className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-700 dark:text-sky-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/50 transition-colors shadow-xs"
                  >
                    <span>{current.project_title || 'View Case Study'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Testimonial"
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 dark:bg-white/10 dark:hover:bg-blue-500 dark:text-white border border-slate-200 dark:border-white/10 transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Testimonial"
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 dark:bg-white/10 dark:hover:bg-blue-500 dark:text-white border border-slate-200 dark:border-white/10 transition-all duration-150 flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Interactive Dot Indicators */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {publishedItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === index
                      ? 'w-8 bg-blue-600 dark:bg-sky-400 shadow-xs'
                      : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
