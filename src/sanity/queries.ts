// GROQ queries for Sanity CMS

export const ALL_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": coalesce(excerpt, seo.metaDescription, ""),
    "readTime": coalesce(readTime, string(readingTimeMinutes) + " min read", "5 min read"),
    splitCategory,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name,
      role,
      "avatar": avatar.asset->url
    },
    categories[]-> {
      title,
      "slug": slug.current
    }
  }
`;

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": coalesce(excerpt, seo.metaDescription, ""),
    "readTime": coalesce(readTime, string(readingTimeMinutes) + " min read", "5 min read"),
    splitCategory,
    body,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      name,
      role,
      bio,
      "avatar": avatar.asset->url
    },
    categories[]-> {
      title,
      "slug": slug.current
    }
  }
`;

export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

export const RECENT_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current) && slug.current != $currentSlug] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    readTime,
    splitCategory,
    excerpt
  }
`;
