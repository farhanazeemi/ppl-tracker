'use client';

import React, { useState, useEffect } from 'react';
import { ListOrdered, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length < 3) {
    return null;
  }

  return (
    <nav
      aria-label="Table of contents"
      className="my-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-sm transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)]">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-display font-black uppercase tracking-wider text-[var(--text-primary)]">
              Table of Contents
            </h2>
            <p className="text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
              {items.length} Sections in this Guide
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="article-toc-list"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <ol
          id="article-toc-list"
          className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-1.5 text-xs sm:text-sm font-sans"
        >
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={`${item.id}-${index}`}
                className={`${item.level === 3 ? 'ml-4 sm:ml-6' : ''}`}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(item.id);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', `#${item.id}`);
                      setActiveId(item.id);
                    }
                  }}
                  className={`group inline-flex items-center gap-2 py-1.5 px-2.5 rounded-lg w-full transition-all ${
                    isActive
                      ? 'text-[var(--accent-primary)] font-bold bg-[var(--accent-primary)]/10 border-l-2 border-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <ArrowRight
                    className={`w-3 h-3 transition-transform shrink-0 ${
                      isActive
                        ? 'text-[var(--accent-primary)] translate-x-0.5'
                        : 'text-[var(--text-muted)] opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  <span className="line-clamp-1">{item.text}</span>
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
