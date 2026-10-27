export const BASE_URL = 'https://ppltracker.web.id';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Global WebSite and Publisher Organization schema.
 * Placed in RootLayout for sitewide domain identity.
 */
export function getRootWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'PPL Hypertrophy Tracker',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/icon.svg`,
          width: 512,
          height: 512,
          caption: 'PPL Hypertrophy Tracker Logo',
        },
        founder: {
          '@type': 'Person',
          name: 'Farhan Azeemi',
          url: 'https://github.com/farhanazeemi',
          jobTitle: 'Software Engineer & Resistance Training Researcher',
        },
        sameAs: [
          'https://github.com/farhanazeemi',
          'https://twitter.com/farhanazeemi',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'farhanazeemi.dev@gmail.com',
          url: `${BASE_URL}/contact`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'PPL Hypertrophy Tracker',
        description:
          'Science-backed progressive overload hypertrophy app, resistance training operating system, and peer-reviewed biomechanics journal.',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'en-US',
      },
    ],
  };
}

/**
 * WebApplication schema.
 * Strictly scoped to the Homepage (/) where the webapp runs.
 */
export function getWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${BASE_URL}/#webapp`,
    url: BASE_URL,
    name: 'PPL Hypertrophy Tracker',
    description:
      'Minimalist 6-day Push-Pull-Legs progressive overload hypertrophy app with automatic rest timers, barbell plate math, 3D visualizer, user profiles, and double progression tracking.',
    applicationCategory: 'HealthAndFitnessApplication',
    operatingSystem: 'All (iOS, Android, Windows, macOS, Linux)',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.0.0',
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      '6-Day Push-Pull-Legs periodized hypertrophy routine',
      'Double progression rep-range overload engine',
      'Automated rest interval timers with audio chimes',
      'Olympic barbell plate calculator (45lb / 20kg bar math)',
      'Interactive 3D muscle anatomy visualizer',
      'Supabase cloud profile persistence and workout history sync',
    ],
    author: {
      '@type': 'Person',
      name: 'Farhan Azeemi',
      url: 'https://github.com/farhanazeemi',
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

/**
 * BreadcrumbList schema helper for any route.
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  };
}

/**
 * Blog index CollectionPage schema with BreadcrumbList.
 */
export function getBlogCollectionSchema(postCount: number) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/blog#collection`,
        url: `${BASE_URL}/blog`,
        name: 'The Hypertrophy Science Journal',
        description:
          'Peer-reviewed resistance training insights, muscle hypertrophy mechanisms, exercise kinematics, and progressive overload protocols.',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@type': 'Thing',
          name: 'Muscle Hypertrophy and Progressive Overload Biomechanics',
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Hypertrophy Journal', url: '/blog' },
      ]),
    ],
  };
}

/**
 * BlogPosting schema with BreadcrumbList for article detail pages.
 */
export function getArticleSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: { name: string; role?: string };
  mainImage?: string;
  imageAlt?: string;
  splitCategory?: string;
  categories?: Array<{ title: string }>;
  readTime?: string;
}) {
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const imageUrl = post.mainImage || `${BASE_URL}/icon.svg`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#article`,
        isPartOf: {
          '@id': `${BASE_URL}/blog#collection`,
        },
        headline: post.title,
        description: post.excerpt,
        image: [imageUrl],
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': postUrl,
        },
        articleSection: post.splitCategory || 'Hypertrophy Science',
        isAccessibleForFree: true,
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role || 'Fitness Specialist',
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'en-US',
        keywords: [
          post.splitCategory || 'Hypertrophy',
          ...(post.categories || []).map((c) => c.title),
          'progressive overload',
          'resistance training',
          'muscle hypertrophy',
          'biomechanics',
          'evidence-based training',
        ].join(', '),
      },
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Journal', url: '/blog' },
        { name: post.title, url: `/blog/${post.slug}` },
      ]),
    ],
  };
}

/**
 * AboutPage schema with BreadcrumbList.
 */
export function getAboutPageSchema() {
  const pageUrl = `${BASE_URL}/about`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#about`,
        url: pageUrl,
        name: 'About PPL Hypertrophy Tracker',
        description:
          'The research-driven philosophy, biomechanical standards, and engineering behind PPL Hypertrophy Tracker.',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
      ]),
    ],
  };
}

/**
 * ContactPage schema with BreadcrumbList.
 */
export function getContactPageSchema() {
  const pageUrl = `${BASE_URL}/contact`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#contact`,
        url: pageUrl,
        name: 'Contact & Athlete Support',
        description:
          'Get in touch with the PPL Hypertrophy Tracker engineering and sports science team.',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Contact', url: '/contact' },
      ]),
    ],
  };
}

/**
 * Standard WebPage schema for Privacy Policy and Terms of Service.
 */
export function getLegalPageSchema(title: string, path: string, description: string) {
  const pageUrl = `${BASE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description: description,
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
      getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: title, url: path },
      ]),
    ],
  };
}
