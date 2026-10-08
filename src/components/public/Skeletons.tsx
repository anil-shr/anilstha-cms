import React from 'react';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs animate-pulse text-left">
      {/* Cover Image Placeholder */}
      <div className="aspect-[16/10] bg-slate-200 dark:bg-white/5 w-full" />

      {/* Content Area */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-full w-24" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-full w-12" />
        </div>

        <div className="space-y-2">
          <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-lg w-full" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-lg w-2/3" />
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-md w-16" />
          <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-md w-14" />
          <div className="h-5 bg-slate-200 dark:bg-white/10 rounded-md w-20" />
        </div>
      </div>
    </div>
  );
};

export const ProjectGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <ProjectCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-pulse text-left">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-full w-32" />
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-full w-20" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="aspect-[16/9] bg-slate-200 dark:bg-white/10 rounded-3xl w-full" />

      {/* Title & Metadata */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-white/10 rounded-xl w-2/3" />
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-lg w-full max-w-2xl" />
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-lg w-4/5 max-w-xl" />
      </div>

      {/* Stats/Details 4-Col Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-100 dark:bg-white/5 rounded-2xl">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-16" />
            <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Case Study Content Blocks */}
      <div className="space-y-8 max-w-3xl">
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg w-40" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-5/6" />
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg w-40" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full" />
          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
};

export const ContentBlockSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse text-left p-6 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-white/10">
      <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-1/3" />
      <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full" />
      <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-5/6" />
      <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-2/3" />
    </div>
  );
};
