'use client';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer"
      aria-label="Share article link"
      type="button"
    >
      <Share2 className="w-3.5 h-3.5" />
      {copied ? 'Link Copied!' : 'Share'}
    </button>
  );
}
