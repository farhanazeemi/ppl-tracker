import { client, isSanityConfigured } from './client';
import { ALL_POSTS_QUERY, POST_BY_SLUG_QUERY, CATEGORIES_QUERY, RECENT_POSTS_QUERY } from './queries';
import { MOCK_BLOG_POSTS, BlogPost } from '../data/mockBlogPosts';

// Curated pool of high-resolution fitness photography to ensure every article gets a distinct image
const DIVERSE_FITNESS_GALLERY: Array<{ url: string; alt: string }> = [
  { url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&auto=format&fit=crop&q=80', alt: 'Incline dumbbell press targeting clavicular pectoralis fibers' },
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80', alt: 'Athlete performing barbell bench press with strict leg drive' },
  { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&auto=format&fit=crop&q=80', alt: 'Cable crossover flyes emphasizing lengthened pectoral stretch' },
  { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&auto=format&fit=crop&q=80', alt: 'Incline dumbbell flyes with deep humeral adduction' },
  { url: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=1200&auto=format&fit=crop&q=80', alt: 'Bodyweight chest dips on heavy parallel dip station' },
  { url: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=1200&auto=format&fit=crop&q=80', alt: 'Close-grip pressing for triceps and upper chest fiber recruitment' },
  { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&auto=format&fit=crop&q=80', alt: 'Heavy low-bar back squat in power rack with chalked grip' },
  { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80', alt: 'High-bar Olympic back squat with deep knee flexion' },
  { url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&auto=format&fit=crop&q=80', alt: 'Conventional barbell deadlift pull from the floor with neutral spine' },
  { url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=80', alt: 'Sumo deadlift lockout with heavy chalked hands' },
  { url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&auto=format&fit=crop&q=80', alt: 'Barbell pin squat training in power rack for sticking point mastery' },
  { url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200&auto=format&fit=crop&q=80', alt: 'Safety squat bar good morning execution for posterior chain' },
  { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&auto=format&fit=crop&q=80', alt: 'Balanced macronutrient meal prep with high-protein sources' },
  { url: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=1200&auto=format&fit=crop&q=80', alt: 'Athlete tracking daily calories and body composition progress' },
  { url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=1200&auto=format&fit=crop&q=80', alt: 'Nutritious lean protein, vegetables and complex carbohydrates' },
  { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80', alt: 'Healthy salmon and dark leafy greens for metabolic recovery' },
  { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80', alt: 'Fresh high-protein grilled chicken salad with avocado' },
  { url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80', alt: 'Energy-dense pre-workout breakfast with oats, berries, and eggs' },
  { url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1200&auto=format&fit=crop&q=80', alt: 'Whey protein shaker bottle on weightlifting bench' },
  { url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1200&auto=format&fit=crop&q=80', alt: 'Athlete pre-workout hydration drink and sports nutrition' },
  { url: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=1200&auto=format&fit=crop&q=80', alt: 'Post-workout recovery smoothie bowl with chia seeds and fruit' },
  { url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80', alt: 'Clinical sports nutrition vitamins, minerals, and omega-3s' },
  { url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80', alt: 'Endurance runner pacing low heart rate zone 2 aerobic session' },
  { url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&auto=format&fit=crop&q=80', alt: 'Runner checking heart rate monitor smartwatch during tempo run' },
  { url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&auto=format&fit=crop&q=80', alt: 'Trail runner climbing alpine ridge at sunrise for aerobic conditioning' },
  { url: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=1200&auto=format&fit=crop&q=80', alt: 'Distance runner lacing performance running shoes on road' },
  { url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&auto=format&fit=crop&q=80', alt: 'Lactate threshold tempo interval training on athletic running track' },
  { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80', alt: 'Track sprints and explosive conditioning workout' },
  { url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=1200&auto=format&fit=crop&q=80', alt: 'Calisthenics athlete executing strict muscle-up on gymnastic rings' },
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop&q=80', alt: 'Strict wide-grip pull-ups on outdoor calisthenics bar station' },
  { url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&auto=format&fit=crop&q=80', alt: 'Parallel bar tricep dips in outdoor street workout gym park' },
  { url: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1200&auto=format&fit=crop&q=80', alt: 'Gymnast holding isometric L-sit hold on wooden parallettes' },
  { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80', alt: 'Resistance band rotator cuff external rotation prehab drill' },
  { url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80', alt: 'Loaded joint mobility stretch and hip 90/90 drill on mat' },
  { url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&auto=format&fit=crop&q=80', alt: 'Thoracic spine extension and mobility roll on dense foam roller' },
  { url: 'https://images.unsplash.com/photo-1508215885820-4523e431397b?w=1200&auto=format&fit=crop&q=80', alt: 'Ankle dorsiflexion knee-to-wall test and mobility exercise' },
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80', alt: 'Strong woman over 40 deadlifting heavy barbell with locked lats' },
  { url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&auto=format&fit=crop&q=80', alt: 'Athletic female lifter executing barbell hip thrusts on bench' },
  { url: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1200&auto=format&fit=crop&q=80', alt: 'Kettlebell Romanian deadlifts targeting posterior chain and glutes' },
  { url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1200&auto=format&fit=crop&q=80', alt: 'Female runner performing post-workout mobility and hamstring recovery' },
  { url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80', alt: 'Sleep and recovery optimization metrics on bedside smartwatch' },
  { url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200&auto=format&fit=crop&q=80', alt: 'Athlete performing VO2 max interval training on concept 2 rowing machine' },
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80', alt: 'High-intensity cardiovascular testing on air assault bike' },
  { url: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=1200&auto=format&fit=crop&q=80', alt: 'Grip strength and forearm flexor testing with heavy iron carry' },
  { url: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&auto=format&fit=crop&q=80', alt: 'Beginner lifter walking onto gym floor with gym bag and workout plan' },
  { url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&auto=format&fit=crop&q=80', alt: 'Olympic barbell loaded with calibrated iron plates in private gym' },
  { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&auto=format&fit=crop&q=80', alt: 'Two training partners encouraging each other during heavy resistance set' },
  { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80', alt: 'Progressive overload tracking logbook next to dumbbells' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function cleanPromptFromExcerpt(excerpt?: string, title?: string): string {
  if (!excerpt) return `Evidence-based investigation into ${title || 'resistance training and hypertrophy science'}.`;
  let cleaned = excerpt.trim();
  // Strip any accidental LLM generation prompt prefixes
  cleaned = cleaned.replace(/^(write\s+an?\s+(actionable\s+|empathetic,?\s+|evidence-based\s+|technical\s+)?(hypertrophy\s+|fat loss\s+|strength\s+)?(guide|article|deep dive)\s+(on|focused on)\s+)/i, '');
  cleaned = cleaned.replace(/^(develop\s+a\s+(technical\s+)?(strength\s+)?training\s+article\s+on\s+)/i, '');
  cleaned = cleaned.replace(/^(synthesize\s+(the\s+)?(core\s+)?)/i, '');
  cleaned = cleaned.replace(/^(create\s+a\s+detailed\s+breakdown\s+of\s+)/i, '');
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

export function resolvePostImage(p: any): { url: string; alt: string } {
  if (p.imageUrl && typeof p.imageUrl === 'string' && p.imageUrl.startsWith('http')) {
    return {
      url: p.imageUrl,
      alt: p.imageAlt || p.title || 'PPL Hypertrophy Science Journal',
    };
  }

  const directUrl = p.mainImage?.asset?.url || (typeof p.mainImage === 'string' && p.mainImage.startsWith('http') ? p.mainImage : null);
  if (directUrl) {
    return {
      url: directUrl,
      alt: p.mainImage?.alt || p.imageAlt || p.title || 'PPL Hypertrophy Science Journal',
    };
  }

  const slug = (p.slug || p._id || p.title || '').toLowerCase();
  const index = hashString(slug) % DIVERSE_FITNESS_GALLERY.length;
  const picked = DIVERSE_FITNESS_GALLERY[index];

  return {
    url: picked.url,
    alt: p.imageAlt || p.title || picked.alt,
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
          modifiedAt: post._updatedAt || post.publishedAt,
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
          rawBody: post.body,
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
