'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    playClickSound(true);
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer btn-tactile ${
        copied
          ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/30 font-bold'
          : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
      }`}
      aria-label="Share article link"
      type="button"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? 'Link Copied!' : 'Share Article'}
    </button>
  );
}
