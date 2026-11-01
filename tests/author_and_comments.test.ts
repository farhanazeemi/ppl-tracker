import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getArticleSchema, getAuthorProfileSchema, BASE_URL } from '../src/lib/schema';
import { getAuthorBySlug, getAllAuthors } from '../src/sanity/getPosts';
import { SubscribeWithGoogle } from '../src/components/SubscribeWithGoogle';

describe('Author and Schema E-E-A-T Architecture', () => {
  it('generates rich ProfilePage and Person Schema.org markup for authors', () => {
    const author = {
      name: 'Dr. Marcus Vance, Ph.D.',
      role: 'Lead Biomechanics Researcher',
      slug: 'dr-marcus-vance',
      bio: 'Exercise physiologist specializing in resistance kinetics.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      credentials: ['Ph.D. Exercise Physiology', 'CSCS'],
      education: ['Stanford University'],
    };

    const schema = getAuthorProfileSchema(author);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toBeDefined();

    const personEntity = schema['@graph'].find((e: any) => e['@type'] === 'Person');
    expect(personEntity).toBeDefined();
    expect(personEntity.name).toBe('Dr. Marcus Vance, Ph.D.');
    expect(personEntity.url).toBe(`${BASE_URL}/author/dr-marcus-vance`);
    expect(personEntity.hasCredential).toHaveLength(2);

    const profileEntity = schema['@graph'].find((e: any) => e['@type'] === 'ProfilePage');
    expect(profileEntity).toBeDefined();
    expect(profileEntity.url).toBe(`${BASE_URL}/author/dr-marcus-vance`);
  });

  it('generates BlogPosting schema with dynamic author link and no hardcoded author identity', () => {
    const post = {
      slug: 'test-article-slug',
      title: 'Upper Chest Hypertrophy',
      excerpt: 'Investigating clavicular head biomechanics.',
      publishedAt: '2026-10-20T10:00:00Z',
      author: {
        name: 'Dr. Marcus Vance, Ph.D.',
        role: 'Lead Biomechanics Researcher',
        slug: 'dr-marcus-vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      },
      splitCategory: 'Push (Chest)',
      categories: [{ title: 'Biomechanics', slug: 'biomechanics' }],
    };

    const schema = getArticleSchema(post);
    const blogPosting = schema['@graph'].find((e: any) => e['@type'] === 'BlogPosting');

    expect(blogPosting).toBeDefined();
    expect(blogPosting.author.name).toBe('Dr. Marcus Vance, Ph.D.');
    expect(blogPosting.author.url).toBe(`${BASE_URL}/author/dr-marcus-vance`);
    expect(blogPosting.author['@id']).toBe(`${BASE_URL}/author/dr-marcus-vance#author`);

    // Verify Farhan Azeemi is completely removed as author from article schema
    expect(JSON.stringify(schema)).not.toContain('author-farhan-azeemi');

    // Verify Subscribe with Google (SwG Basic) Schema Product & isAccessibleForFree mapping
    expect(blogPosting.isAccessibleForFree).toBe(true);
    expect(blogPosting.isPartOf).toBeDefined();
    expect(blogPosting.isPartOf.productID).toBe('CAowpcXODA:openaccess');
    expect(blogPosting.isPartOf['@type']).toContain('Product');
  });

  it('retrieves authors correctly by slug with fallback handling', async () => {
    const author = await getAuthorBySlug('dr-marcus-vance');
    expect(author).toBeDefined();
    expect(author?.name).toBe('Dr. Marcus Vance, Ph.D.');

    const authorAlternate = await getAuthorBySlug('marcus-vance');
    expect(authorAlternate).toBeDefined();
    expect(authorAlternate?.name).toBe('Dr. Marcus Vance, Ph.D.');
  });

  it('renders Subscribe with Google (SwG Basic) script tags with exact publication ID', () => {
    const html = renderToStaticMarkup(React.createElement(SubscribeWithGoogle));
    expect(html).toContain('https://news.google.com/swg/js/v1/swg-basic.js');
    expect(html).toContain('CAowpcXODA:openaccess');
    expect(html).toContain('SWG_BASIC');
    expect(html).toContain('NewsArticle');
  });
});
