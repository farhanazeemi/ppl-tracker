'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxHeight = 'max-h-[85vh]',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Dimmed Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        className={`relative w-full sm:max-w-xl bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 ${maxHeight} flex flex-col pb-safe animate-in slide-in-from-bottom duration-250`}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-[var(--border-strong)]" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] shrink-0">
          <div>
            {title && (
              <h2
                id="bottom-sheet-title"
                className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)] tracking-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 -mr-2 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
