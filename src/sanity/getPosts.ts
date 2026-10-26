import { client, isSanityConfigured } from './client';
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, CATEGORIES_QUERY, RECENT_POSTS_QUERY } from './queries';
import { MOCK_BLOG_POSTS, BlogPost } from '../data/mockBlogPosts';

function parseSanityBodyToSections(body: any, excerpt: string) {
  if (!body) {
    return {
      introduction: excerpt || '',
      sections: [{ heading: 'Key Insights', body: excerpt || 'Detailed biomechanics study.' }],
      conclusion: '',
    };
  }

  if (typeof body === 'string') {
    const rawSections = body.split(/\n(?=## )/g);
    const sections: Array<{ heading: string; body: string; keyTakeaway?: string }> = [];
    let intro = excerpt || '';

    rawSections.forEach((sec, idx) => {
      const trimmed = sec.trim();
      if (trimmed.startsWith('## ')) {
        const lines = trimmed.split('\n');
        const heading = lines[0].replace('## ', '').trim();
        const content = lines.slice(1).join('\n').trim();
        sections.push({ heading, body: content });
      } else if (idx === 0 && !intro) {
        intro = trimmed;
      } else {
        sections.push({ heading: 'Analysis', body: trimmed });
      }
    });

    return {
      introduction: intro,
      sections: sections.length > 0 ? sections : [{ heading: 'Detailed Breakdown', body: body }],
      conclusion: '',
    };
  }

  if (Array.isArray(body)) {
    const sections: Array<{ heading: string; body: string; keyTakeaway?: string }> = [];
    let currentHeading = 'Overview';
    let currentParagraphs: string[] = [];

    body.forEach((block: any) => {
      if (block._type === 'block') {
        const blockText = (block.children || []).map((c: any) => c.text || '').join('');
        if (block.style === 'h2' || block.style === 'h3') {
          if (currentParagraphs.length > 0) {
            sections.push({
              heading: currentHeading,
              body: currentParagraphs.join('\n\n'),
            });
            currentParagraphs = [];
          }
          currentHeading = blockText;
        } else {
          if (blockText.trim()) {
            currentParagraphs.push(blockText.trim());
          }
        }
      }
    });

    if (currentParagraphs.length > 0) {
      sections.push({
        heading: currentHeading,
        body: currentParagraphs.join('\n\n'),
      });
    }

    return {
      introduction: excerpt || '',
      sections: sections.length > 0 ? sections : [{ heading: 'Key Takeaways', body: excerpt }],
      conclusion: '',
    };
  }

  return {
    introduction: excerpt || '',
    sections: [{ heading: 'Summary', body: excerpt }],
    conclusion: '',
  };
}

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
          mainImage: p.mainImage?.asset?.url || (typeof p.mainImage === 'string' ? p.mainImage : undefined),
          imageAlt: p.mainImage?.alt || p.title,
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
          mainImage: post.mainImage?.asset?.url || (typeof post.mainImage === 'string' ? post.mainImage : undefined),
          imageAlt: post.mainImage?.alt || post.title,
          author: {
            name: post.author?.name || 'Science Contributor',
            role: post.author?.role || 'Fitness Specialist',
            avatar: post.author?.avatar,
            bio: post.author?.bio,
          },
          categories: post.categories || [],
          content: parseSanityBodyToSections(post.body, post.excerpt),
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
  try {
    const all = await getAllBlogPosts();
    return all.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return MOCK_BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);
  }
}
