'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      style={style}
      className={`animate-pulse rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] ${className}`}
    />
  );
};

export const SkeletonCard: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3 rounded-lg" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-3.5 rounded-md ${
              i === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
