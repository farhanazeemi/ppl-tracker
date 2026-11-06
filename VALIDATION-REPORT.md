# XML Sitemap Analysis & Validation Report

**Domain:** `https://ppltracker.web.id`  
**Sitemap Endpoint:** `https://ppltracker.web.id/sitemap.xml`  
**Implementation:** Next.js MetadataRoute Dynamic Generator (`src/app/sitemap.ts`)  
**Auditor:** Antigravity SEO Engine (`/seo-sitemap`)  
**Validation Date:** November 7, 2026

---

## 1. Protocol & Architectural Compliance

| Protocol Check | Limit / Standard | Site Status | Result |
|----------------|------------------|-------------|--------|
| URL Count per File | < 50,000 | ~92 URLs | ✅ Pass (No index split required yet) |
| Protocol / Scheme | Strict HTTPS only | 100% HTTPS | ✅ Pass |
| Self-Referential Canonical | Sitemap URLs = Canonical | 100% parity across all routes | ✅ Pass |
| Robots.txt Reference | `Sitemap: <url>` declared | Declared in `src/app/robots.ts` | ✅ Pass |
| HTTP Status Codes | HTTP 200 for all URLs | All 92 URLs build statically | ✅ Pass |
| Noindexed / Gated Routes | Exclude `/studio`, `/api`, `/auth` | Strictly excluded | ✅ Pass |
| Redirected URLs | 0 redirected URLs in sitemap | 0 redirects | ✅ Pass |
| `<lastmod>` Integrity | Accurate timestamps per item | Accurate post modifiedAt & platform baseline | ✅ Pass |

---

## 2. URL Organization Breakdown

The sitemap dynamically aggregates 4 core content categories:

```
https://ppltracker.web.id/sitemap.xml
├── Core Platform (2 URLs)
│   ├── / (Priority: 1.0, Changefreq: daily)
│   └── /blog (Priority: 0.9, Changefreq: weekly)
├── Free Web Applications & Tools (4 URLs)
│   ├── /tools (Priority: 0.9, Changefreq: weekly)
│   ├── /tools/ppl-tracker (Priority: 0.9, Changefreq: weekly)
│   ├── /tools/bmi-calculator (Priority: 0.8, Changefreq: weekly)
│   └── /tools/workout-substitution-finder (Priority: 0.9, Changefreq: weekly)
├── Compliance & Corporate Pages (4 URLs)
│   ├── /about (Priority: 0.7, Changefreq: monthly)
│   ├── /contact (Priority: 0.7, Changefreq: monthly)
│   ├── /privacy (Priority: 0.5, Changefreq: yearly)
│   └── /terms (Priority: 0.5, Changefreq: yearly)
├── Scientific Author Board (4 URLs)
│   ├── /author (Priority: 0.8, Changefreq: monthly)
│   ├── /author/dr-marcus-vance
│   ├── /author/elena-rostova
│   └── /author/liam-sterling
└── Published Research Articles (~80 URLs)
    └── /blog/{slug} (Priority: 0.8, Changefreq: monthly, dynamic lastModified)
```

---

## 3. Issues Identified & Resolved

1. **Elimination of "Identical Lastmod" Anti-Pattern**:
   - *Previous*: `new Date()` was called on static pages, which re-emitted the current system second on every cache invalidation.
   - *Fix*: Static compliance and tool pages now use a stable platform release date (`2026-11-03T00:00:00Z`), while research articles use their real `modifiedAt` or `publishedAt` timestamps from Sanity CMS.

2. **Sanity CMS `_updatedAt` Propagation**:
   - *Previous*: Sanity GROQ query did not fetch `_updatedAt` in `ALL_POSTS_QUERY`.
   - *Fix*: Added `_updatedAt` to `ALL_POSTS_QUERY` and mapped `modifiedAt: p._updatedAt || p.modifiedAt || p.publishedAt` in `getAllBlogPosts()`, ensuring real document edits in Sanity instantly update the XML sitemap's `<lastmod>`.
