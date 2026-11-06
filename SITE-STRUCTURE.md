# PPL Tracker — Site Structure & URL Hierarchy Plan

**Canonical URL:** `https://ppltracker.web.id`  
**Root Framework:** Next.js 15 App Router

---

## 1. Information Architecture & URL Hierarchy

| Level | Route Pattern | Page Type | Primary Intent | SEO Schema | Canonical |
|-------|---------------|-----------|----------------|------------|-----------|
| **L0** | `/` | Web Application / Home | Commercial / Product Trial | `Organization`, `WebSite`, `WebApplication` | `https://ppltracker.web.id/` |
| **L1** | `/tools` | Collection / Directory | Commercial Navigation | `CollectionPage`, `BreadcrumbList` | `https://ppltracker.web.id/tools` |
| **L2** | `/tools/ppl-tracker` | High-Utility Web App | High-Intent Software Tool | `WebPage`, `BreadcrumbList`, `WebApplication` | `https://ppltracker.web.id/tools/ppl-tracker` |
| **L2** | `/tools/workout-substitution-finder` | High-Utility Web App | Problem Solving / Alternatives | `WebPage`, `BreadcrumbList`, `WebApplication`, `FAQPage` | `https://ppltracker.web.id/tools/workout-substitution-finder` |
| **L2** | `/tools/bmi-calculator` | Calculator / Health | Screening & Weight Target | `WebPage`, `BreadcrumbList`, `WebApplication`, `FAQPage` | `https://ppltracker.web.id/tools/bmi-calculator` |
| **L1** | `/blog` | Publication Index | Content Exploration | `CollectionPage`, `BreadcrumbList` | `https://ppltracker.web.id/blog` |
| **L2** | `/blog/[slug]` | Deep Scientific Article | Informational Hypertrophy | `BlogPosting`, `BreadcrumbList`, (optional `FAQPage`) | `https://ppltracker.web.id/blog/[slug]` |
| **L1** | `/author` | Authors Index | E-E-A-T Credibility | `CollectionPage`, `BreadcrumbList` | `https://ppltracker.web.id/author` |
| **L2** | `/author/[slug]` | Verified Author Profile | E-E-A-T & Author Verification | `ProfilePage`, `Person`, `BreadcrumbList` | `https://ppltracker.web.id/author/[slug]` |
| **L1** | `/about` | Institutional Trust | Brand Transparency & Mission | `AboutPage`, `BreadcrumbList` | `https://ppltracker.web.id/about` |
| **L1** | `/contact` | Customer Support | Inquiries & Feedback | `ContactPage`, `BreadcrumbList` | `https://ppltracker.web.id/contact` |
| **L1** | `/privacy` | Legal Compliance | Data Protection & Governance | `WebPage`, `BreadcrumbList` | `https://ppltracker.web.id/privacy` |
| **L1** | `/terms` | Legal Compliance | Athlete Safety Disclaimer | `WebPage`, `BreadcrumbList` | `https://ppltracker.web.id/terms` |

---

## 2. Robots.txt Disallowed Routes (No Crawl Budget Waste)

```typescript
disallow: [
  '/api/',          // Backend route handlers
  '/studio/',       // Sanity Studio CMS
  '/studio',        // Sanity Studio CMS root
  '/auth/callback'  // OAuth redirect endpoint
]
```

---

## 3. Machine Agent & Generative Search Discovery

```typescript
// Explicit discovery links for LLM agents & web crawlers
allow: [
  '/',
  '/llms.txt',
  '/llms-full.txt'
]
```
Supported Bots: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`, `CCBot`, `Bytespider`, `Diffbot`, `FacebookBot`.
