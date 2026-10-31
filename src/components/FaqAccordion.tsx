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
      className="pt-8 border-t border-[var(--border-subtle)] space-y-6"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-semibold">
          <HelpCircle className="w-3.5 h-3.5" /> Biomechanics & Community Inquiries
        </div>
        <h2
          id="faq-heading"
          className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]"
        >
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans max-w-2xl leading-relaxed">
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
                  ? 'bg-[var(--bg-card)] border-[var(--accent-primary)]/40 shadow-sm'
                  : 'bg-[var(--bg-card)]/60 border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              <button
                type="button"
                id={questionId}
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggleIndex(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-display font-bold text-sm sm:text-base text-[var(--text-primary)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--bg-main)]"
              >
                <span className="leading-snug">{item.question}</span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-200 ${
                    isOpen
                      ? 'bg-[var(--accent-primary)] text-black rotate-180'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
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
                className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans border-t border-[var(--border-subtle)] ${
                  isOpen ? 'block' : 'hidden'
                }`}
              >
                <div className="whitespace-pre-line pt-2">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
