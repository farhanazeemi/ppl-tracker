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
}

function cleanQuestion(q: string): string {
  return q
    .replace(/^(?:\*\*Q\d*:\s*|\bQ\d*:\s*|\*\*Question\d*:\s*|\d+\.\s*)/i, '')
    .replace(/^["']|["']$/g, '')
    .replace(/\*\*$/g, '')
    .trim();
}

function cleanAnswer(a: string): string {
  return a
    .replace(/^(?:\*\*A\d*:\s*|\bA\d*:\s*|\*\*Answer\d*:\s*|The\s+Reality:\s*)/i, '')
    .replace(/\*\*$/g, '')
    .trim();
}

/**
 * Parses Portable Text blocks to cleanly extract:
 * 1. Semantic H2/H3 Table of Contents entries with stable IDs
 * 2. Real question/answer pairs for both the accessible FAQ accordion and FAQPage JSON-LD
 * 3. Main article blocks (excluding redundant title H1 blocks and raw FAQ streams to prevent duplicate rendering)
 */
export function processArticleBody(blocks: any, articleTitle?: string): ProcessedArticleContent {
  if (!Array.isArray(blocks)) {
    return { toc: [], faqs: [], mainBlocks: [] };
  }

  const toc: TocEntry[] = [];
  const faqs: FaqEntry[] = [];
  let inFaqSection = false;
  let currentQuestion = '';
  let currentAnswerParts: string[] = [];

  const mainBlocks: any[] = [];
  const normalizedTitle = articleTitle ? articleTitle.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block._type !== 'block') {
      mainBlocks.push(block);
      continue;
    }

    const text = (block.children || [])
      .map((c: any) => c.text || '')
      .join('')
      .trim();

    if (!text) continue;

    // Filter out redundant initial H1 blocks or blocks that repeat the article title verbatim
    if (i < 2 && block.style === 'h1') {
      continue;
    }
    if (i < 2 && normalizedTitle && text.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedTitle) {
      continue;
    }

    // Check if this heading initiates the FAQ section
    if (
      (block.style === 'h2' || block.style === 'h3') &&
      /(?:frequently\s+asked\s+questions|\bfaq\b)/i.test(text)
    ) {
      inFaqSection = true;
      continue;
    }

    // Check if a major non-FAQ H2 starts after FAQ section (e.g. 4-Week Blueprint or Summary)
    if (inFaqSection && block.style === 'h2' && !/faq/i.test(text)) {
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

    const isQuestionHeading = block.style === 'h4' && inFaqSection;
    const isQuestionText =
      inFaqSection &&
      /^(?:\*\*Q\d*:\s*|\bQ\d*:\s*|\*\*Question\d*:\s*|\d+\.\s*(?:"|'))/i.test(text);

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
      mainBlocks.push(block);
      if (block.style === 'h2' || block.style === 'h3') {
        if (!/frequently\s+asked|community\s+faq/i.test(text)) {
          toc.push({
            id: slugifyHeading(text),
            text,
            level: block.style === 'h2' ? 2 : 3,
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

  return { toc, faqs, mainBlocks };
}
