import { client, isSanityConfigured } from './client';
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, CATEGORIES_QUERY, RECENT_POSTS_QUERY } from './queries';
import { MOCK_BLOG_POSTS, BlogPost } from '../data/mockBlogPosts';

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (isSanityConfigured && client) {
    try {
      const posts = await client.fetch(ALL_POSTS_QUERY);
      if (Array.isArray(posts) && posts.length > 0) {
        return posts.map((p: any) => ({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          publishedAt: p.publishedAt,
          excerpt: p.excerpt,
          readTime: p.readTime || '5 min read',
          splitCategory: p.splitCategory || 'General',
          author: {
            name: p.author?.name || 'Science Contributor',
            role: p.author?.role || 'Fitness Specialist',
            avatar: p.author?.avatar,
          },
          categories: p.categories || [],
          content: {
            introduction: p.excerpt || '',
            sections: [
              {
                heading: 'Key Insights',
                body: typeof p.body === 'string' ? p.body : 'See full article content.',
              },
            ],
            conclusion: '',
          },
        }));
      }
    } catch (err) {
      console.warn('Sanity query error (falling back to curated posts):', err);
    }
  }

  // Graceful fallback to curated scientific articles
  return MOCK_BLOG_POSTS;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSanityConfigured && client) {
    try {
      const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
      if (post) {
        return {
          _id: post._id,
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt,
          excerpt: post.excerpt,
          readTime: post.readTime || '5 min read',
          splitCategory: post.splitCategory || 'General',
          author: {
            name: post.author?.name || 'Science Contributor',
            role: post.author?.role || 'Fitness Specialist',
            avatar: post.author?.avatar,
            bio: post.author?.bio,
          },
          categories: post.categories || [],
          content: {
            introduction: post.excerpt || '',
            sections: [
              {
                heading: 'Detailed Analysis',
                body: typeof post.body === 'string' ? post.body : 'Detailed biomechanics study.',
              },
            ],
            conclusion: '',
          },
        };
      }
    } catch (err) {
      console.warn('Sanity single post query error:', err);
    }
  }

  // Fallback to local post
  const found = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  return found || null;
}

export async function getRecentPosts(currentSlug: string): Promise<BlogPost[]> {
  return MOCK_BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);
}
