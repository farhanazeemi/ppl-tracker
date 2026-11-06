# Schema Markup Audit & Validation Report

**Domain:** `https://ppltracker.web.id`  
**Generated Date:** November 7, 2026  
**Standards Version:** Schema.org v26.0 / Google Search Central Guidelines (Feb 2026)  
**Auditor:** Antigravity SEO Engine (`/seo-schema`)

---

## 1. Executive Summary

A comprehensive Schema.org structured data audit was performed across all routes on [ppltracker.web.id](https://ppltracker.web.id). All structured data is delivered as server-rendered JSON-LD inside `<script type="application/ld+json">` tags, sanitized against script-breakout vulnerabilities via `safeJsonLd()`.

| Metric | Status |
|--------|--------|
| Primary Format | **JSON-LD** (Google Preferred) |
| Active Schemas Detected | **10** (Organization, WebSite, WebApplication, CollectionPage, ProfilePage, Person, BlogPosting, BreadcrumbList, AboutPage, ContactPage) |
| Deprecated Types | **0** (No HowTo, SpecialAnnouncement, CourseInfo, or ClaimReview) |
| Restricted FAQ Scope | **Validated** (FAQPage schema properly scoped to scientific calculation & biomechanical methodologies for GEO/AEO engines) |
| Validation Errors | **0** (All required fields present, absolute URLs enforced) |

---

## 2. Schema Inventory & Status by Route

| Route Pattern | Schema Type(s) | Status | Key Properties Verified |
|---------------|----------------|--------|--------------------------|
| `/` (Homepage) | `Organization`, `WebSite`, `WebApplication` | ✅ Valid | Name, URL, 512px PNG logo, founder, contactPoint, offers (free), featureList |
| `/tools` | `CollectionPage`, `BreadcrumbList` | ✅ Valid | `@id`, name, url, description, `hasPart` (WebApplication array), breadcrumbs |
| `/tools/ppl-tracker` | `WebPage`, `BreadcrumbList`, `WebApplication` | ✅ Valid | `@id`, applicationCategory, operatingSystem, featureList, 0 USD Offer, breadcrumb hierarchy |
| `/tools/bmi-calculator` | `WebPage`, `BreadcrumbList`, `WebApplication`, `FAQPage` | ✅ Valid | Mathematical formula question, tissue density question, breadcrumb hierarchy |
| `/tools/workout-substitution-finder` | `WebPage`, `BreadcrumbList`, `WebApplication`, `FAQPage` | ✅ Valid | Biomechanics FAQs, deterministic equipment substitution entity, breadcrumb hierarchy |
| `/blog` | `CollectionPage`, `BreadcrumbList` | ✅ Valid | Publication collection name, topic of interest, breadcrumbs |
| `/blog/[slug]` | `BlogPosting`, `BreadcrumbList`, (optional `FAQPage`) | ✅ Valid | 1200x630 OG image fallback, author `Person` (@id), publisher `Organization`, datePublished, dateModified, `isPartOf` (SwG Product ID `CAowpcXODA:openaccess`), isAccessibleForFree |
| `/author` | `CollectionPage`, `BreadcrumbList` | ✅ Valid | Editorial board collection, author directory |
| `/author/[slug]` | `ProfilePage`, `Person`, `BreadcrumbList` | ✅ Valid | Verified author bio, credentials (`hasCredential`), degrees (`alumniOf`), topics (`knowsAbout`), image |
| `/about` | `AboutPage`, `BreadcrumbList` | ✅ Valid | Mission, publisher reference, breadcrumb hierarchy |
| `/contact` | `ContactPage`, `BreadcrumbList` | ✅ Valid | Support channels, email, response expectations |
| `/privacy`, `/terms` | `WebPage`, `BreadcrumbList` | ✅ Valid | Legal document definitions, breadcrumbs |

---

## 3. Key Issues Resolved

1. **Logo Image Format Optimization**:
   - *Previous*: Organization logo referenced `/icon.svg`.
   - *Fix*: Google's Rich Results documentation specifies that Organization logos should be raster images (PNG, WebP, JPG). Updated logo to `${BASE_URL}/icon-512.png` and added Organization `image` pointing to `${BASE_URL}/og-image.png`.

2. **Self-Contained Article Publisher**:
   - *Previous*: `BlogPosting.publisher` used an external reference `{"@id": "https://ppltracker.web.id/#organization"}` without embedding the Organization in the single-page graph.
   - *Fix*: Expanded `publisher` to include the full `Organization` object with name, url, and 512px PNG logo, guaranteeing 100% self-contained validity in standalone schema validators.

3. **Article Image Fallback Quality**:
   - *Previous*: Fallback for article image was `/icon.svg`. Google Article guidelines require PNG/WebP/JPG of at least 1200px width.
   - *Fix*: Updated fallback to high-resolution 1200x630 `https://ppltracker.web.id/og-image.png`.

4. **Tools Directory & Calculators Breadcrumb Injection**:
   - *Previous*: `/tools`, `/tools/ppl-tracker`, and `/tools/bmi-calculator` displayed breadcrumb navigation in the DOM but lacked `BreadcrumbList` schema in their JSON-LD.
   - *Fix*: Added `BreadcrumbList` schemas across all tools routes for rich search snippet breadcrumb trails.

5. **BMI Calculator FAQPage Machine-Readability**:
   - *Previous*: Mathematical calculation & athletic misclassification FAQs were in HTML only.
   - *Fix*: Emitted `FAQPage` schema in the JSON-LD `@graph` for search engine snippet and answer engine optimization.
