'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { slugifyHeading } from '../utils/text';

function extractPlainText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractPlainText).join('');
  if (node.children) return extractPlainText(node.children);
  if (node.text) return node.text;
  return '';
}

function renderCellContent(cellText: string) {
  if (!cellText) return null;
  const parts = cellText
    .split(/\s*•\s*|<br\s*\/?>/i)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return <span>{cellText}</span>;
  }
  return (
    <ul className="space-y-1">
      {parts.map((part, idx) => (
        <li key={idx} className="leading-snug block">
          {part}
        </li>
      ))}
    </ul>
  );
}

export const articlePortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => {
      // Prevent duplicate H1 inside the body content per AGENTS.md single H1 rule
      const text = extractPlainText(value || children);
      const id = slugifyHeading(text);
      return (
        <h2
          id={id}
          className="scroll-mt-24 text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] pt-8 pb-3 border-b border-[var(--border-subtle)] mb-4"
        >
          {children}
        </h2>
      );
    },
    h2: ({ children, value }) => {
      const text = extractPlainText(value || children);
      const id = slugifyHeading(text);
      return (
        <h2
          id={id}
          className="scroll-mt-24 text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)] pt-8 pb-2 border-b border-[var(--border-subtle)]/60"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const text = extractPlainText(value || children);
      const id = slugifyHeading(text);
      return (
        <h3
          id={id}
          className="scroll-mt-24 text-lg sm:text-xl font-display font-bold uppercase tracking-tight text-[var(--accent-primary)] pt-6 pb-2"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const text = extractPlainText(value || children);
      const id = slugifyHeading(text);
      return (
        <h4
          id={id}
          className="scroll-mt-24 text-base sm:text-lg font-display font-bold uppercase tracking-tight text-[var(--text-primary)] pt-4 pb-1"
        >
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="p-4 sm:p-5 my-6 rounded-2xl bg-[var(--bg-elevated)] border-l-4 border-[var(--accent-primary)] italic text-[var(--text-primary)] text-sm sm:text-base leading-relaxed">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="leading-relaxed text-[var(--text-secondary)] font-sans text-sm sm:text-base my-4">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2.5 my-4 pl-2 text-[var(--text-secondary)] text-sm sm:text-base font-sans leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2.5 my-4 pl-2 text-[var(--text-secondary)] text-sm sm:text-base font-sans leading-relaxed">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-[var(--text-primary)]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-mono text-xs border border-[var(--border-subtle)]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || '';
      const isInternal =
        href.startsWith('/') ||
        href.startsWith('#') ||
        href.includes('ppltracker.web.id');

      if (isInternal) {
        const cleanHref = href.replace('https://ppltracker.web.id', '') || '/';
        return (
          <Link
            href={cleanHref}
            className="text-[var(--accent-primary)] font-semibold underline underline-offset-4 decoration-[var(--accent-primary)]/40 hover:decoration-[var(--accent-primary)] hover:opacity-90 transition-all"
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-secondary)] font-medium underline underline-offset-4 decoration-[var(--border-strong)] hover:decoration-[var(--accent-secondary)] transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    structuredTable: ({ value }) => {
      const headers: string[] = Array.isArray(value?.headers) ? value.headers : [];
      const rows: string[][] = Array.isArray(value?.rows) ? value.rows : [];
      if (headers.length === 0 && rows.length === 0) return null;

      return (
        <div
          className="table-responsive-region my-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm bg-[var(--bg-card)]"
          tabIndex={0}
          role="region"
          aria-label="Training protocol and evidence comparison table"
        >
          <table className="w-full text-left text-xs sm:text-sm border-collapse tabular-nums">
            <caption className="visually-hidden">
              Structured training parameters and biomechanical reference table
            </caption>
            {headers.length > 0 && (
              <thead className="bg-[var(--bg-elevated)] text-[var(--text-primary)] font-display font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-4 py-3 border-b border-[var(--border-subtle)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-[var(--bg-elevated)]/50 transition-colors align-top"
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-4 py-3 leading-relaxed ${
                        cIdx === 0 ? 'font-semibold text-[var(--text-primary)]' : ''
                      }`}
                    >
                      {renderCellContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    diagramBlock: ({ value }) => {
      const lines: string[] = Array.isArray(value?.lines) ? value.lines : [];
      if (lines.length === 0) return null;
      return (
        <figure
          aria-label="Biomechanical diagram"
          className="my-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-4 sm:p-5 overflow-x-auto shadow-inner"
        >
          <pre className="font-mono text-xs sm:text-sm text-[var(--accent-primary)] leading-relaxed whitespace-pre">
            {lines.join('\n')}
          </pre>
        </figure>
      );
    },
    image: ({ value }) => {
      if (!value?.asset?.url && !value?.imageUrl) return null;
      const url = value.asset?.url || value.imageUrl;
      const alt = value.alt || 'PPL Hypertrophy Exercise Analysis';
      return (
        <figure className="my-8 overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            width={800}
            height={450}
            loading="lazy"
            className="w-full max-h-[460px] object-cover"
          />
          {value.caption && (
            <figcaption className="p-3.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)]">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface ArticlePortableTextProps {
  value: any;
}

export function ArticlePortableText({ value }: ArticlePortableTextProps) {
  if (!value) return null;
  return (
    <div className="article-body-content space-y-4">
      <PortableText value={value} components={articlePortableTextComponents} />
    </div>
  );
}
