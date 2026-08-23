import React from 'react';

/**
 * Property Card Skeleton Loader
 */
export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="h-52 bg-slate-200 w-full relative">
        <div className="absolute top-3 left-3 h-5 w-20 bg-slate-300 rounded-full"></div>
        <div className="absolute top-3 right-3 h-8 w-8 bg-slate-300 rounded-full"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2.5"></div>
          <div className="h-5 bg-slate-200 rounded w-4/5 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        </div>

        {/* Specs grid */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-24"></div>
          <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Property Card Skeletons
 */
export function PropertyGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Property Detail Page Skeleton
 */
export function PropertyDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="h-8 bg-slate-200 rounded w-80 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-48"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded w-40"></div>
      </div>

      {/* Gallery Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[420px] mb-8">
        <div className="md:col-span-2 h-full bg-slate-200 rounded-2xl"></div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          <div className="bg-slate-200 rounded-2xl"></div>
          <div className="bg-slate-200 rounded-2xl"></div>
        </div>
      </div>

      {/* Content Columns Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-48 bg-slate-200 rounded-2xl"></div>
          <div className="h-36 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="h-80 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );
}

/**
 * Agent Card Skeleton
 */
export function AgentCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 animate-pulse flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full bg-slate-200 mb-4"></div>
      <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-24 mb-4"></div>
      <div className="h-8 bg-slate-200 rounded-xl w-full"></div>
    </div>
  );
}

export default {
  PropertyCardSkeleton,
  PropertyGridSkeleton,
  PropertyDetailSkeleton,
  AgentCardSkeleton,
};
