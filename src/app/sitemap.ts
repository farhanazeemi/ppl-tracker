import type { MetadataRoute } from 'next';
import { MOCK_BLOG_POSTS } from '../data/mockBlogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ppltracker.web.id';

  const blogUrls: MetadataRoute.Sitemap = MOCK_BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...blogUrls,
  ];
}
