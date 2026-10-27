import { client, isSanityConfigured } from './client';
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, CATEGORIES_QUERY, RECENT_POSTS_QUERY } from './queries';
import { MOCK_BLOG_POSTS, BlogPost } from '../data/mockBlogPosts';

const CATEGORY_IMAGE_FALLBACKS: Record<string, { url: string; alt: string }> = {
  push: {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80',
    alt: 'Athlete performing incline dumbbell press targeting the clavicular head of the pectoralis major',
  },
  chest: {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80',
    alt: 'Athlete training upper chest and clavicular pectoralis fibers',
  },
  pec: {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80',
    alt: 'Clavicular pectoral hypertrophy training execution',
  },
  legs: {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&auto=format&fit=crop&q=80',
    alt: 'Powerlifter executing low-bar back squat with optimal hip drive and bracing',
  },
  squat: {
    url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&auto=format&fit=crop&q=80',
    alt: 'Heavy barbell back squat in power rack with chalked grip',
  },
  recomp: {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    alt: 'Body recomposition athlete tracking physique progress and resistance training volume',
  },
  fat: {
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80',
    alt: 'Body recomposition and metabolic fat loss resistance protocol',
  },
  nutrition: {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&auto=format&fit=crop&q=80',
    alt: 'Optimal daily dietary protein intake and micronutrient timing for resistance athletes',
  },
  protein: {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&auto=format&fit=crop&q=80',
    alt: 'High-protein nutritional timing and evidence-based macro distribution',
  },
  endurance: {
    url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80',
    alt: 'Zone 2 low-intensity aerobic base building for mitochondrial density and recovery',
  },
  aerobic: {
    url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80',
    alt: 'Aerobic base conditioning and low-intensity heart rate zone training',
  },
  running: {
    url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80',
    alt: 'Endurance runner pacing low heart rate training',
  },
  calisthenics: {
    url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=1200&auto=format&fit=crop&q=80',
    alt: 'Calisthenics athlete executing compound bodyweight progressions on gymnastic rings',
  },
  bodyweight: {
    url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=1200&auto=format&fit=crop&q=80',
    alt: 'Recommended routine bodyweight leverage ladder progression',
  },
  rotator: {
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    alt: 'Shoulder prehab and scapular upward rotation protocol with resistance bands',
  },
  shoulder: {
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    alt: 'Shoulder joint health, scapular control, and prehab drills',
  },
  mobility: {
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    alt: 'Loaded joint mobility and impingement prevention drills',
  },
  women: {
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80',
    alt: 'Evidence-based barbell resistance training protocol for women over 40',
  },
  vo2: {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    alt: 'Cardiovascular VO2 max conditioning protocol for all-cause mortality reduction',
  },
  longevity: {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    alt: 'Evidence-based longevity and conditioning protocols',
  },
  mindset: {
    url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&auto=format&fit=crop&q=80',
    alt: 'Overcoming commercial gym anxiety with structured beginner workout protocols',
  },
  gym: {
    url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&auto=format&fit=crop&q=80',
    alt: 'Commercial gym equipment and structured progressive overload workouts',
  },
  delt: {
    url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&auto=format&fit=crop&q=80',
    alt: 'Strict lateral raise execution for lateral deltoid isolation',
  },
  pull: {
    url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&auto=format&fit=crop&q=80',
    alt: 'Pull day hypertrophy training targeting lats and rhomboids',
  },
};

export function cleanPromptFromExcerpt(excerpt?: string, title?: string): string {
  if (!excerpt) return `Evidence-based investigation into ${title || 'resistance training and hypertrophy science'}.`;
  let cleaned = excerpt.trim();
  // Strip any accidental LLM generation prompt prefixes
  cleaned = cleaned.replace(/^(write\s+an?\s+(actionable\s+)?(hypertrophy\s+|technical\s+)?(guide|article|deep dive)\s+on\s+)/i, 'Comprehensive guide on ');
  cleaned = cleaned.replace(/^(develop\s+a\s+(technical\s+)?(strength\s+)?training\s+article\s+on\s+)/i, 'Technical breakdown of ');
  cleaned = cleaned.replace(/^(synthesize\s+(the\s+)?)/i, 'Evidence synthesis of ');
  cleaned = cleaned.replace(/^(create\s+a\s+detailed\s+breakdown\s+of\s+)/i, 'Detailed breakdown of ');
  return cleaned;
}

export function resolvePostImage(p: any): { url: string; alt: string } {
  const directUrl = p.mainImage?.asset?.url || (typeof p.mainImage === 'string' && p.mainImage.startsWith('http') ? p.mainImage : null);
  if (directUrl) {
    return {
      url: directUrl,
      alt: p.mainImage?.alt || p.imageAlt || p.title || 'PPL Hypertrophy Science Journal',
    };
  }

  const slug = (p.slug || '').toLowerCase();
  const cat = (p.splitCategory || '').toLowerCase();

  for (const [key, val] of Object.entries(CATEGORY_IMAGE_FALLBACKS)) {
    if (slug.includes(key) || cat.includes(key)) {
      return {
        url: val.url,
        alt: p.imageAlt || val.alt,
      };
    }
  }

  return {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80',
    alt: p.title || 'PPL Hypertrophy Science Journal',
  };
}

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
        return posts.map((p: any) => {
          const img = resolvePostImage(p);
          const cleanExcerpt = cleanPromptFromExcerpt(p.excerpt, p.title);
          return {
            _id: p._id,
            title: p.title,
            slug: p.slug,
            publishedAt: p.publishedAt,
            excerpt: cleanExcerpt,
            readTime: p.readTime || '5 min read',
            splitCategory: p.splitCategory || 'General',
            mainImage: img.url,
            imageAlt: img.alt,
            author: {
              name: p.author?.name || 'Science Contributor',
              role: p.author?.role || 'Fitness Specialist',
              avatar: p.author?.avatar,
            },
            categories: p.categories || [],
            content: {
              introduction: cleanExcerpt,
              sections: [
                {
                  heading: 'Key Insights',
                  body: typeof p.body === 'string' ? p.body : 'See full article content.',
                },
              ],
              conclusion: '',
            },
          };
        });
      }
    } catch (err) {
      console.warn('Sanity query error (falling back to curated posts):', err);
    }
  }

  // Graceful fallback to curated scientific articles with guaranteed images
  return MOCK_BLOG_POSTS.map(p => {
    const img = resolvePostImage(p);
    return {
      ...p,
      excerpt: cleanPromptFromExcerpt(p.excerpt, p.title),
      mainImage: p.mainImage || img.url,
      imageAlt: p.imageAlt || img.alt,
    };
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSanityConfigured && client) {
    try {
      const post = await client.fetch(POST_BY_SLUG_QUERY, { slug });
      if (post) {
        const img = resolvePostImage(post);
        const cleanExcerpt = cleanPromptFromExcerpt(post.excerpt, post.title);
        return {
          _id: post._id,
          title: post.title,
          slug: post.slug,
          publishedAt: post.publishedAt,
          excerpt: cleanExcerpt,
          readTime: post.readTime || '5 min read',
          splitCategory: post.splitCategory || 'General',
          mainImage: img.url,
          imageAlt: img.alt,
          author: {
            name: post.author?.name || 'Science Contributor',
            role: post.author?.role || 'Fitness Specialist',
            avatar: post.author?.avatar,
            bio: post.author?.bio,
          },
          categories: post.categories || [],
          content: parseSanityBodyToSections(post.body, cleanExcerpt),
        };
      }
    } catch (err) {
      console.warn('Sanity single post query error:', err);
    }
  }

  // Fallback to local post with guaranteed images
  const found = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  if (found) {
    const img = resolvePostImage(found);
    return {
      ...found,
      excerpt: cleanPromptFromExcerpt(found.excerpt, found.title),
      mainImage: found.mainImage || img.url,
      imageAlt: found.imageAlt || img.alt,
    };
  }
  return null;
}

export async function getRecentPosts(currentSlug: string): Promise<BlogPost[]> {
  try {
    const all = await getAllBlogPosts();
    return all.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return MOCK_BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);
  }
}
