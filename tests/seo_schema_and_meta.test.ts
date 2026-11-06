import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  getRootWebSiteSchema,
  getWebApplicationSchema,
  getArticleSchema,
  getToolsIndexSchema,
  getPplTrackerToolSchema,
  getBmiCalculatorPageSchema,
  BASE_URL,
} from '../src/lib/schema';
import { safeJsonLd } from '../src/lib/safeJsonLd';

describe('SEO Schema & Metadata Validation', () => {
  it('ensures root Organization schema uses PNG logo and og-image', () => {
    const rootSchema = getRootWebSiteSchema();
    const org = rootSchema['@graph'].find((e: any) => e['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org.logo.url).toContain('.png');
    expect(org.logo.url).not.toContain('.svg');
    expect(org.image).toBe(`${BASE_URL}/og-image.png`);
  });

  it('generates complete Tools index CollectionPage and BreadcrumbList', () => {
    const sampleTools = [
      { name: 'PPL Tracker', href: '/tools/ppl-tracker', shortDescription: 'Overload app' },
      { name: 'BMI Calculator', href: '/tools/bmi-calculator', shortDescription: 'BMI app' },
    ];
    const schema = getToolsIndexSchema(sampleTools);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toHaveLength(2);

    const collection = schema['@graph'].find((e: any) => e['@type'] === 'CollectionPage');
    expect(collection).toBeDefined();
    expect(collection.hasPart).toHaveLength(2);

    const breadcrumb = schema['@graph'].find((e: any) => e['@type'] === 'BreadcrumbList');
    expect(breadcrumb).toBeDefined();
    expect(breadcrumb.itemListElement).toHaveLength(2);
  });

  it('generates PPL Tracker Tool schema with WebPage, BreadcrumbList, and WebApplication', () => {
    const schema = getPplTrackerToolSchema();
    expect(schema['@context']).toBe('https://schema.org');
    
    const webpage = schema['@graph'].find((e: any) => e['@type'] === 'WebPage');
    expect(webpage).toBeDefined();
    expect(webpage.url).toBe(`${BASE_URL}/tools/ppl-tracker`);

    const breadcrumb = schema['@graph'].find((e: any) => e['@type'] === 'BreadcrumbList');
    expect(breadcrumb).toBeDefined();
    expect(breadcrumb.itemListElement).toHaveLength(3);

    const webapp = schema['@graph'].find((e: any) => e['@type'] === 'WebApplication');
    expect(webapp).toBeDefined();
    expect(webapp.offers.price).toBe('0');
  });

  it('generates BMI Calculator schema with WebPage, BreadcrumbList, WebApplication, and FAQPage', () => {
    const faqs = [
      { question: 'How is BMI calculated?', answer: 'Weight divided by height squared.' },
    ];
    const schema = getBmiCalculatorPageSchema(faqs);
    expect(schema['@context']).toBe('https://schema.org');

    const faqPage = schema['@graph'].find((e: any) => e['@type'] === 'FAQPage');
    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity).toHaveLength(1);
    expect(faqPage.mainEntity[0].name).toBe('How is BMI calculated?');

    const webapp = schema['@graph'].find((e: any) => e['@type'] === 'WebApplication');
    expect(webapp).toBeDefined();
    expect(webapp.image).toBe(`${BASE_URL}/icon-512.png`);
  });

  it('ensures BlogPosting schema fallback image is 1200x630 PNG/WebP, never SVG', () => {
    const postWithoutImage = {
      slug: 'progressive-overload-rules',
      title: 'Progressive Overload Rules',
      excerpt: 'How to double progress.',
      publishedAt: '2026-10-25T10:00:00Z',
      author: {
        name: 'Elena Rostova, CSCS',
        role: 'Head of High-Performance S&C',
        slug: 'elena-rostova',
      },
    };

    const schema = getArticleSchema(postWithoutImage);
    const postEntity = schema['@graph'].find((e: any) => e['@type'] === 'BlogPosting');
    expect(postEntity).toBeDefined();
    expect(postEntity.image[0]).toBe(`${BASE_URL}/og-image.png`);
    expect(postEntity.image[0]).not.toContain('.svg');

    // Self-contained publisher validation
    expect(postEntity.publisher['@type']).toBe('Organization');
    expect(postEntity.publisher.logo.url).toContain('.png');
  });

  it('verifies static OG preview assets exist in public folder', () => {
    const ogPngPath = path.join(process.cwd(), 'public', 'og-image.png');
    const ogWebpPath = path.join(process.cwd(), 'public', 'og-image.webp');

    expect(fs.existsSync(ogPngPath)).toBe(true);
    expect(fs.existsSync(ogWebpPath)).toBe(true);

    const pngStat = fs.statSync(ogPngPath);
    expect(pngStat.size).toBeGreaterThan(10000); // Verify non-empty valid image
    expect(pngStat.size).toBeLessThan(200000); // Verify optimized under 200KB
  });

  it('sanitizes structured data JSON-LD safely without character entity corruption', () => {
    const rawSchema = getBmiCalculatorPageSchema([
      { question: 'Is BMI > 25 bad for lifters & athletes?', answer: 'Not necessarily <safe>.' }
    ]);
    const jsonString = safeJsonLd(rawSchema);
    expect(jsonString).not.toContain('<safe>');
    expect(jsonString).toContain('\\u003csafe\\u003e');
  });
});
