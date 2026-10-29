'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  description?: string;
}

export function FaqAccordion({
  items,
  title = 'Frequently Asked Questions',
  description = 'Evidence-based answers to key training and biomechanical inquiries from community athletes.',
}: FaqAccordionProps) {
  // Support multi-accordion open state or single open
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  if (!items || items.length === 0) {
    return null;
  }

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section
      id="faq-section"
      aria-labelledby="faq-heading"
      className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-6"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-semibold">
          <HelpCircle className="w-3.5 h-3.5" /> Biomechanics & Community Inquiries
        </div>
        <h2
          id="faq-heading"
          className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white"
        >
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndices.includes(index);
          const questionId = `faq-q-${index}`;
          const answerId = `faq-a-${index}`;

          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white dark:bg-[#12141c] border-amber-500/40 shadow-sm'
                  : 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggleIndex(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-display font-bold text-sm sm:text-base text-zinc-900 dark:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
              >
                <span className="leading-snug">{item.question}</span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                    isOpen
                      ? 'bg-amber-500 text-black rotate-180'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {/* Always rendered in DOM for SEO crawlability; hidden via CSS/attributes */}
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans border-t border-zinc-100 dark:border-zinc-800/80 ${
                  isOpen ? 'block' : 'hidden'
                }`}
              >
                <p className="whitespace-pre-line">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
