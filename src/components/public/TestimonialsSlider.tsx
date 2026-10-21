import React, { useState, useEffect, useRef } from 'react';
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = publishedItems.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused]);

  if (total === 0) return null;

  const current = publishedItems[currentIndex] || publishedItems[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      className={`relative py-16 sm:py-24 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-sky-400 text-xs font-mono font-semibold">
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
          <SpotlightCard className="p-8 sm:p-12 md:p-14 rounded-3xl bg-white/95 dark:bg-[#1a1a1a]/95 border border-slate-200/90 dark:border-white/10 shadow-xl overflow-hidden text-left min-h-[340px] flex flex-col justify-between">
            {/* Giant decorative quotation symbol in background */}
            <Quote className="absolute right-6 -bottom-6 w-44 h-44 text-slate-100 dark:text-white/[0.03] pointer-events-none -rotate-12 select-none" />

            {/* Top row: Rating stars & counter */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 sm:w-5 h-4 sm:h-5 ${
                      i < current.rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-slate-200 dark:text-slate-700'
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {current.rating}.0 Rating
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-white/5">
                {currentIndex + 1} / {total}
              </div>
            </div>

            {/* Middle: Testimonial Quote */}
            <div className="my-6 sm:my-8 relative">
              <blockquote className="text-lg sm:text-2xl md:text-3xl font-serif-italic font-normal italic text-slate-900 dark:text-white leading-[1.35] tracking-tight">
                "{current.quote}"
              </blockquote>
            </div>

            {/* Bottom: Client Profile + Navigation Controls */}
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 border-2 border-white dark:border-slate-800 shadow-sm shrink-0 flex items-center justify-center">
                  {current.avatar_url ? (
                    <img
                      src={current.avatar_url}
                      alt={current.client_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-sm font-black text-blue-600 dark:text-sky-400 font-mono">
                      {current.client_name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {current.client_name}
                    </h4>
                    <span title="Verified Client">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {current.client_role} • <span className="text-slate-800 dark:text-slate-200 font-semibold">{current.company}</span>
                  </p>
                </div>
              </div>

              {/* Case study link if available, plus Prev/Next controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {current.project_url && (
                  <Link
                    to={current.project_url}
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
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
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Testimonial"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
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
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    currentIndex === index
                      ? 'w-7 bg-blue-600 dark:bg-sky-400 shadow-xs'
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
