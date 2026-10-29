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

function parseMarkdownTable(text: string) {
  const lines = text.trim().split('\n').filter((l) => l.trim().startsWith('|'));
  if (lines.length < 2) return null;

  const headers = lines[0]
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());

  // Line 1 is the separator: | :--- | :--- |
  const rowLines = lines.slice(2);
  const rows = rowLines.map((row) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim())
  );

  return { headers, rows };
}

export const articlePortableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => {
      // Avoid duplicate H1 inside the body content
      const text = extractPlainText(value || children);
      const id = slugifyHeading(text);
      return (
        <h2
          id={id}
          className="scroll-mt-24 text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white pt-8 pb-3 border-b border-zinc-200 dark:border-zinc-800 mb-4"
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
          className="scroll-mt-24 text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white pt-8 pb-2"
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
          className="scroll-mt-24 text-lg sm:text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white pt-6 pb-2 text-amber-500/90 dark:text-amber-400"
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
          className="scroll-mt-24 text-base sm:text-lg font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white pt-4 pb-1"
        >
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="p-4 sm:p-5 my-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border-l-4 border-amber-500 italic text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed">
        {children}
      </blockquote>
    ),
    normal: ({ children, value }) => {
      const rawText = extractPlainText(value || children);
      // Check if this block contains a markdown-formatted table
      if (rawText.includes('|') && rawText.trim().startsWith('|')) {
        const tableData = parseMarkdownTable(rawText);
        if (tableData) {
          return (
            <div className="my-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-[#12141c]">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-display font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    {tableData.headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-sans">
                  {tableData.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 leading-relaxed">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      return (
        <p className="leading-relaxed text-zinc-800 dark:text-zinc-300 font-sans text-sm sm:text-base my-4">
          {children}
        </p>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 my-4 pl-2 text-zinc-800 dark:text-zinc-300 text-sm sm:text-base font-sans leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 my-4 pl-2 text-zinc-800 dark:text-zinc-300 text-sm sm:text-base font-sans leading-relaxed">
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
      <strong className="font-bold text-zinc-950 dark:text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-amber-500 font-mono text-xs border border-zinc-200 dark:border-zinc-700">
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
        // Strip origin if full internal URL
        const cleanHref = href.replace('https://ppltracker.web.id', '') || '/';
        return (
          <Link
            href={cleanHref}
            className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-semibold underline underline-offset-4 decoration-amber-500/40 hover:decoration-amber-500 transition-colors"
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
          className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 font-medium underline underline-offset-4 decoration-zinc-400 hover:decoration-amber-500 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url && !value?.imageUrl) return null;
      const url = value.asset?.url || value.imageUrl;
      const alt = value.alt || 'PPL Hypertrophy Exercise Analysis';
      return (
        <figure className="my-8 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} className="w-full max-h-[460px] object-cover" />
          {value.caption && (
            <figcaption className="p-3.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-[#12141c] border-t border-zinc-200 dark:border-zinc-800">
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
