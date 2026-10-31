'use client';

import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
  title?: string;
  subtitle?: string;
  glowAccent?: 'volt' | 'teal' | 'orange' | 'none';
  glass?: boolean;
  onClick?: () => void;
  id?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  badge,
  title,
  subtitle,
  glowAccent = 'none',
  glass = false,
  onClick,
  id,
}) => {
  const glowStyles = {
    volt: 'hover:border-[#B7FF4A]/40 dark:hover:border-[#B7FF4A]/50 hover:shadow-[0_0_30px_rgba(183,255,74,0.12)]',
    teal: 'hover:border-[#36D6B0]/40 dark:hover:border-[#36D6B0]/50 hover:shadow-[0_0_30px_rgba(54,214,176,0.12)]',
    orange: 'hover:border-orange-500/40 dark:hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)]',
    none: 'hover:border-[var(--border-strong)]',
  }[glowAccent];

  const baseBackground = glass
    ? 'glass-panel'
    : 'bg-[var(--bg-card)] border border-[var(--border-subtle)]';

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-200 ${baseBackground} ${glowStyles} ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      {(badge || title) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
