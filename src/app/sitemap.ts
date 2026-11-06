import type { MetadataRoute } from 'next';
import { getAllBlogPosts, getAllAuthors } from '../sanity/getPosts';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ppltracker.web.id';

  const [posts, authors] = await Promise.all([getAllBlogPosts(), getAllAuthors()]);

  // Stable reference timestamp for non-blog static foundation and tools
  const platformStableDate = new Date('2026-11-03T00:00:00Z');

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedAt || post.publishedAt || platformStableDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const authorUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/author`,
      lastModified: platformStableDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...authors.map((author) => ({
      url: `${baseUrl}/author/${author.slug}`,
      lastModified: platformStableDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const toolsPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tools`,
      lastModified: platformStableDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/ppl-tracker`,
      lastModified: platformStableDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/bmi-calculator`,
      lastModified: platformStableDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/workout-substitution-finder`,
      lastModified: platformStableDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  const staticCompliancePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: platformStableDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: platformStableDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: platformStableDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: platformStableDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: platformStableDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: platformStableDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...toolsPages,
    ...staticCompliancePages,
    ...authorUrls,
    ...blogUrls,
  ];
}
