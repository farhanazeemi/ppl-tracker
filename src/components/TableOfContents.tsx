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
      className="my-8 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm transition-all"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-display font-black uppercase tracking-wider text-zinc-900 dark:text-white">
              Table of Contents
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {items.length} Sections in this Guide
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="article-toc-list"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
        >
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <ol
          id="article-toc-list"
          className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2 text-xs sm:text-sm font-sans"
        >
          {items.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li
                key={`${item.id}-${index}`}
                className={`${item.level === 3 ? 'ml-4 sm:ml-6 text-zinc-500 dark:text-zinc-400' : 'text-zinc-700 dark:text-zinc-300 font-medium'}`}
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
                  className={`group inline-flex items-center gap-2 py-1 px-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-amber-500 font-bold bg-amber-500/10'
                      : 'hover:text-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <ArrowRight
                    className={`w-3 h-3 transition-transform ${
                      isActive ? 'text-amber-500 translate-x-0.5' : 'text-zinc-400 opacity-0 group-hover:opacity-100'
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
