import { describe, it, expect } from 'vitest';
import {
  OLD_TO_NEW_ARTICLE_SLUGS,
  NEW_TO_OLD_ARTICLE_SLUGS,
  getRedirectedArticleSlug,
} from '../src/data/articleRedirects';
import { MOCK_BLOG_POSTS } from '../src/data/mockBlogPosts';

describe('Article Redirects & 50-60 Character Title Standards', () => {
  it('maps all 104 legacy long article slugs to shortened canonical slugs', () => {
    const entries = Object.entries(OLD_TO_NEW_ARTICLE_SLUGS);
    expect(entries.length).toBeGreaterThanOrEqual(104);

    const uniqueNewSlugs = new Set<string>();
    for (const [oldSlug, newSlug] of entries) {
      expect(oldSlug).not.toBe(newSlug);
      expect(newSlug.length).toBeLessThan(oldSlug.length);
      expect(getRedirectedArticleSlug(oldSlug)).toBe(newSlug);
      expect(NEW_TO_OLD_ARTICLE_SLUGS[newSlug]).toBe(oldSlug);
      uniqueNewSlugs.add(newSlug);
    }
    expect(uniqueNewSlugs.size).toBe(entries.length);
  });

  it('enforces 50 to 60 character titles across MOCK_BLOG_POSTS', () => {
    for (const post of MOCK_BLOG_POSTS) {
      expect(post.title.length).toBeGreaterThanOrEqual(50);
      expect(post.title.length).toBeLessThanOrEqual(60);
    }
  });
});
