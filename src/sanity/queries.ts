// GROQ queries for Sanity CMS

export const ALL_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    "excerpt": coalesce(excerpt, seo.metaDescription, ""),
    "readTime": coalesce(readTime, string(readingTimeMinutes) + " min read", "5 min read"),
    splitCategory,
    imageUrl,
    imageAlt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      _id,
      name,
      role,
      bio,
      "slug": slug.current,
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
    _updatedAt,
    "excerpt": coalesce(excerpt, seo.metaDescription, ""),
    "readTime": coalesce(readTime, string(readingTimeMinutes) + " min read", "5 min read"),
    splitCategory,
    body,
    imageUrl,
    imageAlt,
    mainImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author-> {
      _id,
      name,
      role,
      bio,
      "slug": slug.current,
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

export const ALL_AUTHORS_QUERY = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    role,
    bio,
    "slug": slug.current,
    "avatar": avatar.asset->url
  }
`;

export const AUTHOR_BY_SLUG_QUERY = `
  *[_type == "author" && (slug.current == $slug || _id == $slug || slug.current == "dr-" + $slug || "dr-" + slug.current == $slug)][0] {
    _id,
    name,
    role,
    bio,
    "slug": slug.current,
    "avatar": avatar.asset->url
  }
`;

export const POSTS_BY_AUTHOR_QUERY = `
  *[_type == "post" && defined(slug.current) && (author->slug.current == $slug || author._ref == $authorId || author->slug.current == "dr-" + $slug || "dr-" + author->slug.current == $slug)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": coalesce(excerpt, seo.metaDescription, ""),
    "readTime": coalesce(readTime, string(readingTimeMinutes) + " min read", "5 min read"),
    splitCategory,
    imageUrl,
    imageAlt,
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
      "slug": slug.current,
      "avatar": avatar.asset->url
    },
    categories[]-> {
      title,
      "slug": slug.current
    }
  }
`;
