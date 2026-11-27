import { slugifyHeading } from './text';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ProcessedArticleContent {
  toc: TocEntry[];
  faqs: FaqEntry[];
  mainBlocks: any[];
  keyTakeaways: string[];
}

export function sanitizeInlineText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^(?:sure,\s+here\s+is\s+[^:]+:\s*)/i, '')
    .replace(/<br\s*\/?>/gi, ' • ')
    .replace(/<\/?(?:h[1-6]|p|div|span|strong|em|b|i)[^>]*>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\bDelload\b/g, 'Deload')
    .replace(/\bdelload\b/g, 'deload')
    .replace(
      /\*\*\[log your sets, reps, and RPE with the PPL Tracker tool\]\(https:\/\/ppltracker\.web\.id\/tools[^\s)]*/g,
      'log your sets, reps, and RPE with the PPL Tracker tool'
    )
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1');
}

function cleanQuestion(q: string): string {
  return sanitizeInlineText(q)
    .replace(/^(?:\*\*Q\d*:\s*|\bQ\d*:\s*|\*\*Question\d*:\s*|\d+\.\s*)/i, '')
    .replace(/^["']|["']$/g, '')
    .replace(/\*\*$/g, '')
    .trim();
}

function cleanAnswer(a: string): string {
  return sanitizeInlineText(a)
    .replace(/^(?:\*\*A\d*:\s*|\bA\d*:\s*|\*\*Answer\d*:\s*|The\s+Reality:\s*)/i, '')
    .replace(/\*\*$/g, '')
    .trim();
}

function isPipeTableRow(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed.includes('|')) return false;
  const cells = trimmed
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
  return cells.length >= 2 && cells.some((c) => c.length > 0);
}

function isSeparatorTableRow(cells: string[]): boolean {
  return cells.every((c) => /^:?-{2,}:?$/.test(c));
}

function parsePipeCells(text: string): string[] {
  return sanitizeInlineText(text.trim())
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

/**
 * Parses Portable Text blocks to cleanly extract:
 * 1. Semantic H2/H3 Table of Contents entries with stable IDs
 * 2. Real question/answer pairs for both the accessible FAQ accordion and FAQPage JSON-LD
 * 3. Coalesced semantic tables (`structuredTable`) and biomechanical diagrams (`diagramBlock`)
 * 4. Concise Key Takeaways for human readers & AI/AEO parsers
 */
export function processArticleBody(blocks: any, articleTitle?: string): ProcessedArticleContent {
  if (!Array.isArray(blocks)) {
    return { toc: [], faqs: [], mainBlocks: [], keyTakeaways: [] };
  }

  const toc: TocEntry[] = [];
  const faqs: FaqEntry[] = [];
  const rawMainBlocks: any[] = [];
  const keyTakeaways: string[] = [];

  let inFaqSection = false;
  let currentQuestion = '';
  let currentAnswerParts: string[] = [];
  let inCodeFence = false;
  let currentDiagramLines: string[] = [];

  const normalizedTitle = articleTitle ? articleTitle.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block._type !== 'block') {
      rawMainBlocks.push(block);
      continue;
    }

    const rawText = (block.children || [])
      .map((c: any) => c.text || '')
      .join('')
      .trim();

    if (!rawText) continue;

    // Handle multi-block or single-block ``` diagram fences
    if (rawText.startsWith('```')) {
      if (!inCodeFence) {
        inCodeFence = true;
        const remainder = rawText.replace(/^```[a-z]*\s*/i, '').replace(/```$/, '').trim();
        if (remainder) {
          currentDiagramLines.push(remainder);
        }
        // Check if fence opened and closed in same block
        if (rawText.length > 3 && rawText.endsWith('```')) {
          inCodeFence = false;
          if (currentDiagramLines.length > 0) {
            rawMainBlocks.push({
              _key: `diagram_${i}`,
              _type: 'diagramBlock',
              lines: [...currentDiagramLines],
            });
            currentDiagramLines = [];
          }
        }
      } else {
        inCodeFence = false;
        if (currentDiagramLines.length > 0) {
          rawMainBlocks.push({
            _key: `diagram_${i}`,
            _type: 'diagramBlock',
            lines: [...currentDiagramLines],
          });
          currentDiagramLines = [];
        }
      }
      continue;
    }

    if (inCodeFence) {
      currentDiagramLines.push(rawText);
      continue;
    }

    // Skip standalone horizontal rule blocks "---"
    if (/^---+$/.test(rawText)) {
      continue;
    }

    // Convert raw <h2>...</h2> inside normal block into h2 style
    let effectiveStyle = block.style || 'normal';
    let cleanedBlockText = rawText;
    const h2TagMatch = rawText.match(/^<h2>\s*(.*?)\s*<\/h2>$/i);
    if (h2TagMatch) {
      effectiveStyle = 'h2';
      cleanedBlockText = h2TagMatch[1];
    }

    const text = sanitizeInlineText(cleanedBlockText);
    if (!text) continue;

    // Filter out redundant initial H1 blocks or blocks that repeat the article title verbatim
    if (i < 2 && effectiveStyle === 'h1') {
      continue;
    }
    if (i < 2 && normalizedTitle && text.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTitle) {
      continue;
    }

    const isMistakesHeading = /\bmistakes?\b/i.test(text);
    const isNumberedFaqQuestion = /^faq\s*\d+\s*:/i.test(text);
    const isExplicitQuestionH3 =
      effectiveStyle === 'h3' && /^(?:\*\*)?Q\d+\s*:/i.test(text);
    const isDedicatedFaqHeading =
      (effectiveStyle === 'h2' || effectiveStyle === 'h3') &&
      !isMistakesHeading &&
      !isNumberedFaqQuestion &&
      !/\?$/.test(text) &&
      /(?:frequently\s+asked\s+questions|\bfaqs?\b)/i.test(text);

    // Only dedicated FAQ headings (not compound mistake headings or numbered FAQ items) initiate the FAQ section
    if (isDedicatedFaqHeading) {
      inFaqSection = true;
      continue;
    }

    // Handle direct Q1:/Q2: H3 question blocks placed under a compound heading without an intermediate FAQ H3
    if (!inFaqSection && isExplicitQuestionH3) {
      inFaqSection = true;
    }

    // Check if a major non-FAQ H2 (or non-question mistake H3) starts after FAQ section
    if (
      inFaqSection &&
      ((effectiveStyle === 'h2' && !isDedicatedFaqHeading) ||
        (effectiveStyle === 'h3' && isMistakesHeading && !/\?$/.test(text)))
    ) {
      if (currentQuestion && currentAnswerParts.length > 0) {
        faqs.push({
          question: cleanQuestion(currentQuestion),
          answer: cleanAnswer(currentAnswerParts.join('\n\n')),
        });
        currentQuestion = '';
        currentAnswerParts = [];
      }
      inFaqSection = false;
    }

    const isQuestionHeading = (effectiveStyle === 'h4' || effectiveStyle === 'h3') && inFaqSection;
    const isQuestionText =
      inFaqSection &&
      /^(?:\*\*Q\d*:\s*|\bQ\d*:\s*|\*\*Question\d*:\s*|\d+\.\s*(?:"|'))/i.test(rawText);

    if (inFaqSection && (isQuestionHeading || isQuestionText)) {
      if (currentQuestion && currentAnswerParts.length > 0) {
        faqs.push({
          question: cleanQuestion(currentQuestion),
          answer: cleanAnswer(currentAnswerParts.join('\n\n')),
        });
        currentAnswerParts = [];
      }
      currentQuestion = text;
    } else if (inFaqSection && currentQuestion) {
      currentAnswerParts.push(text);
    } else {
      const sanitizedBlock = {
        ...block,
        style: effectiveStyle === 'h1' ? 'h2' : effectiveStyle,
        children: (block.children || []).map((c: any) => ({
          ...c,
          text: typeof c.text === 'string' ? sanitizeInlineText(c.text) : c.text,
        })),
      };

      rawMainBlocks.push(sanitizedBlock);

      if (effectiveStyle === 'h2' || effectiveStyle === 'h3') {
        if (isMistakesHeading || !/frequently\s+asked|community\s+faq/i.test(text)) {
          toc.push({
            id: slugifyHeading(text),
            text,
            level: effectiveStyle === 'h2' ? 2 : 3,
          });
        }
      }
    }
  }

  // Push final FAQ if remaining
  if (currentQuestion && currentAnswerParts.length > 0) {
    faqs.push({
      question: cleanQuestion(currentQuestion),
      answer: cleanAnswer(currentAnswerParts.join('\n\n')),
    });
  }

  // Coalesce consecutive pipe-delimited normal blocks into structuredTable blocks
  const mainBlocks: any[] = [];
  let pendingTableRows: string[][] = [];

  const flushPendingTable = (keyIdx: number) => {
    if (pendingTableRows.length >= 2) {
      const headers = pendingTableRows[0];
      const dataRows = pendingTableRows
        .slice(1)
        .filter((row) => !isSeparatorTableRow(row));
      if (dataRows.length >= 1) {
        mainBlocks.push({
          _key: `table_${keyIdx}`,
          _type: 'structuredTable',
          headers,
          rows: dataRows,
        });
        pendingTableRows = [];
        return;
      }
    }
    pendingTableRows = [];
  };

  for (let i = 0; i < rawMainBlocks.length; i++) {
    const b = rawMainBlocks[i];
    if (b._type === 'block' && b.style === 'normal' && !b.listItem) {
      const blockText = (b.children || []).map((c: any) => c.text || '').join('').trim();
      // Multi-line markdown table inside a single block
      if (blockText.includes('\n') && blockText.includes('|')) {
        const lines = blockText.split('\n').filter((l: string) => isPipeTableRow(l));
        if (lines.length >= 2) {
          flushPendingTable(i);
          const parsedLines = lines.map(parsePipeCells);
          const headers = parsedLines[0];
          const rows = parsedLines.slice(1).filter((r: string[]) => !isSeparatorTableRow(r));
          mainBlocks.push({
            _key: `table_inline_${i}`,
            _type: 'structuredTable',
            headers,
            rows,
          });
          continue;
        }
      }

      if (isPipeTableRow(blockText)) {
        pendingTableRows.push(parsePipeCells(blockText));
        continue;
      }
    }

    if (pendingTableRows.length > 0) {
      flushPendingTable(i);
    }
    mainBlocks.push(b);
  }
  if (pendingTableRows.length > 0) {
    flushPendingTable(rawMainBlocks.length);
  }

  // Extract 3 concise Key Takeaways for the Executive Summary box
  for (let i = 0; i < mainBlocks.length && keyTakeaways.length < 3; i++) {
    const b = mainBlocks[i];
    if (b._type === 'block' && b.style === 'h2') {
      const headingText = (b.children || []).map((c: any) => c.text || '').join('').trim();
      // Find the next normal paragraph after this H2
      for (let j = i + 1; j < Math.min(i + 4, mainBlocks.length); j++) {
        const nextB = mainBlocks[j];
        if (nextB._type === 'block' && nextB.style === 'normal') {
          const para = (nextB.children || []).map((c: any) => c.text || '').join('').trim();
          const firstSentence = para.split(/(?<=[.!?])\s+/)[0];
          if (firstSentence && firstSentence.length > 35 && firstSentence.length < 240) {
            keyTakeaways.push(firstSentence);
            break;
          }
        }
      }
      void headingText;
    }
  }

  return { toc, faqs, mainBlocks, keyTakeaways };
}
