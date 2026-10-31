import { describe, it, expect } from 'vitest';
import { MOCK_BLOG_POSTS } from '../src/data/mockBlogPosts';

describe('BUG-05: Footer Blog Internal Links Validation', () => {
  it('ensures all footer blog links resolve to actual valid blog slugs', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

    // Extract all /blog/... links in Footer.tsx
    const matches = Array.from(content.matchAll(/href="(\/blog\/[^"]+)"/g)).map((m) => m[1]);
    expect(matches.length).toBeGreaterThan(0);

    const validSlugs = new Set(MOCK_BLOG_POSTS.map((p) => `/blog/${p.slug}`));
    validSlugs.add('/blog');

    for (const link of matches) {
      expect(validSlugs.has(link)).toBe(true);
    }
  });
});
