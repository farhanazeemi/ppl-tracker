import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, ShieldCheck } from 'lucide-react';

export interface CrossToolLink {
  href: string;
  title: string;
  anchorText: string;
  badge?: string;
  description: string;
}

export interface CrossArticleLink {
  href: string;
  title: string;
  anchorText: string;
  category: string;
  description: string;
}

export interface ToolReviewerBadge {
  name: string;
  role: string;
  href: string;
  note: string;
}

interface ToolCrossLinksSectionProps {
  heading?: string;
  subheading?: string;
  tools: CrossToolLink[];
  articles: CrossArticleLink[];
  reviewer?: ToolReviewerBadge;
}

/**
 * Server-rendered cross-linking hub connecting each tool page to complementary
 * calculators, cluster articles (including unindexed guides), and verified E-E-A-T reviewers.
 */
export function ToolCrossLinksSection({
  heading = 'Related Calculators & Evidence-Based Guides',
  subheading = 'Turn your calculation into structured training, nutrition targets, and progressive overload.',
  tools,
  articles,
  reviewer,
}: ToolCrossLinksSectionProps) {
  return (
    <section
      aria-label="Related calculators and science guides"
      className="space-y-8 pt-10 border-t border-[var(--border-subtle)]"
    >
      {reviewer && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] shrink-0">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-0.5 text-xs">
              <p className="font-mono font-bold text-[var(--text-primary)]">
                Scientific &amp; Biomechanical Review:{' '}
                <Link
                  href={reviewer.href}
                  className="text-[var(--accent-primary)] underline underline-offset-4 hover:opacity-90"
                >
                  {reviewer.name}
                </Link>{' '}
                <span className="font-normal text-[var(--text-muted)]">({reviewer.role})</span>
              </p>
              <p className="text-[var(--text-secondary)] font-sans leading-relaxed">{reviewer.note}</p>
            </div>
          </div>
          <Link
            href={reviewer.href}
            className="text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0 self-start sm:self-center"
          >
            View Reviewer Credentials →
          </Link>
        </div>
      )}

      <div className="space-y-2 max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold block">
          {'// Connected Athlete Stack'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
          {heading}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{subheading}</p>
      </div>

      {tools.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            Complementary Calculators &amp; Trackers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <article
                key={tool.href}
                className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-[var(--text-primary)]">
                      {tool.title}
                    </span>
                    {tool.badge && (
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shrink-0">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline underline-offset-4"
                >
                  <span>{tool.anchorText}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-secondary)]" aria-hidden="true" />
            Related Scientific Studies &amp; Training Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <article
                key={article.href}
                className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-secondary)]/40 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-secondary)] block">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-display font-bold text-[var(--text-primary)] leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <Link
                  href={article.href}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline underline-offset-4"
                >
                  <span>{article.anchorText}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
