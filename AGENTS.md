# PPL Tracker — Editorial, Technical SEO & Content Quality Standards

This document establishes the mandatory publishing, SEO, content architecture, and engineering standards for all content published on [ppltracker.web.id](https://ppltracker.web.id). Every human author, developer, and AI agent must adhere to these rules without exception.

---

## 1. Editorial Integrity & Anti-Slop Safeguards

### Strict Ban on Generation Prompts & Editorial Instructions
- **Zero Prompt Leakage**: Never publish articles, excerpts, meta descriptions, or headings containing AI prompts or instructions (e.g., *"Write an actionable hypertrophy guide..."*, *"Develop a technical breakdown..."*, *"Synthesize the evidence..."*, *"Here is a 4-week progression table..."*).
- **Sanitized Excerpts**: Every excerpt must be an original, human-readable summary (140–160 characters) written directly for the reader, clearly summarizing the article's core takeaway.
- **No Placeholder Text**: Placeholders such as `[Insert Study]`, `Lorem ipsum`, `TODO`, `Author Bio goes here`, or unfinished markdown tables are strictly prohibited.
- **Single H1 Rule**: The article title renders as the single `<h1>` on the page. Never include an `<h1>` or `# Heading` inside the portable text / markdown body. Body sections must begin with `<h2>` (`## Heading`) and nest under `<h3>` (`### Subheading`).

### Sports Science & Factual Accuracy
- **Credible Primary Sources**: Cite established biomechanical, nutritional, and exercise science research (e.g., Schoenfeld, Helms, Morton, Phillips, ACSM, ISSN).
- **No Fabricated Evidence**: Never invent studies, journal names, sample sizes, statistically significant p-values, quotes, or athlete testimonials.
- **Nuanced Prescriptions**: Distinguish between established empirical evidence (e.g., progressive overload, protein threshold of 1.6–2.2g/kg) and emerging hypothesis (e.g., long-length partials for all muscle groups). Always state practical limitations and individual variance.
- **Health & Injury Prehab**: Exercise rehabilitation, injury prevention, and medical conditions (e.g., rotator cuff impingement, perimenopause, cardiovascular risk) must be addressed with caution, accompanied by standard medical disclaimers. Never present speculative advice as medical prescription.

---

## 2. Mandatory Internal Linking Rules

### Mandatory Workout Tracker Destination
Whenever an article meaningfully discusses resistance training, exercise execution, workout routines, sets and reps, volume landmarks (MEV/MAV/MRV), periodization, or progressive overload, it **must** include a natural, contextual link to:
```
https://ppltracker.web.id/tools/ppl-tracker
```
- **Contextual Anchors**: Vary anchor text naturally based on the sentence flow. Examples:
  - `track your progressive overload with PPL Tracker`
  - `log your sets, reps, and RPE with the PPL Tracker tool`
  - `record your training volume in PPL Tracker`
  - `launch the PPL Tracker workout tool`
  - `use our free workout tracker`
- **Natural Placement**: Place the link organically in a workout routine section, progression guide, or practical application callout. Never force links into unrelated nutritional or biochemistry prose.

### Topic Cluster Internal Links
- Every article must contain at least **2–3 outgoing contextual links** to related articles within its topic cluster.
- Every article must maintain a **Related Scientific Studies / Related Reading** section directing users to complementary guides.
- Always use descriptive anchor text explaining the destination (e.g., `[low-incline dumbbell press technique guide](/blog/low-incline-dumbbell-press-upper-chest-hypertrophy)`), never generic labels like `click here`, `read more`, or `this study`.

---

## 3. SEO, GEO & AEO Architecture

### On-Page SEO Requirements
- **Title Tag**: Concise, high-intent title under 60 characters or optimized for SERP snippet display without truncation.
- **Meta Description**: 140–160 characters clearly answering search intent and encouraging click-through without clickbait.
- **Canonical URLs**: Self-referential canonical URL using absolute HTTPS format (`https://ppltracker.web.id/blog/{slug}`).
- **Open Graph & Twitter Cards**: Proper `og:title`, `og:description`, `og:image`, `og:url`, `og:type="article"`, and `twitter:card="summary_large_image"`.
- **Crawl Budget Protection**: Keep non-indexable routes disallowed in `src/app/robots.ts` (specifically `/studio/`, `/api/`, and `/auth/callback`).

### GEO & AEO (Generative & Answer Engine Optimization)
- **Direct Answer First**: Provide a direct, actionable answer or executive summary in the opening 150 words before deep technical breakdowns.
- **Structured Data Tables**: Format exercise progression routines, weekly volume allocations, and nutritional macros as accessible HTML/markdown tables rather than dense run-on paragraphs.
- **Descriptive Heading Queries**: Use natural, problem-focused H2s (e.g., `How Many Weekly Sets Are Optimal for Clavicular Chest Hypertrophy?`).

---

## 4. Components & Content Presentation

### Table of Contents (`TableOfContents.tsx`)
- Articles exceeding 1,200 words or containing 3+ H2/H3 headings must display the accessible `<TableOfContents />` component.
- Headings must generate stable, lowercase, hyphenated anchor IDs (`slugifyHeading`).
- Navigation must be accessible (`<nav aria-label="Table of contents">`), support keyboard navigation, active heading highlighting via `IntersectionObserver`, and responsive mobile collapse.

### Interactive FAQ Accordion (`FaqAccordion.tsx`)
- Every article should feature 3–5 targeted frequently asked questions addressing common reader objections, edge cases, and troubleshooting.
- FAQs must render as accessible interactive accordions (`<button aria-expanded aria-controls>`) with visible focus outlines and complete HTML in the DOM for search bot indexing.

### Schema.org Structured Data (`src/lib/schema.ts`)
Every article page must emit an integrated `@graph` array containing:
1. `BlogPosting`: Headline, description, author (`Person`), publisher (`Organization`), datePublished, dateModified, image, mainEntityOfPage.
2. `BreadcrumbList`: Home (`/`) → Blog (`/blog`) → Current Article (`/blog/{slug}`).
3. `FAQPage`: Dynamically extracted from visible FAQs, ensuring 100% parity between rendered DOM text and JSON-LD markup.

---

## 5. Sanity CMS Content Operations

- **Author Assignment**: All published articles must be explicitly linked to verified author documents (e.g., `author-farhan-azeemi`), never left as orphan strings.
- **Split Category Accuracy**: Ensure `splitCategory` is set to the specific fitness pillar (`Push (Chest)`, `Legs (Squat)`, `Fat Loss & Recomp`, `Sports Nutrition`, `Endurance & Cardio`, `Calisthenics`, `Prehab & Mobility`, `Women's Strength`, `Longevity & Health`, `Gym Mindset`), never generic placeholders.
- **Slug Stability**: Do not modify existing slugs or delete published articles without explicit redirection plans approved by engineering. All 60 live URLs must be preserved to maintain established crawl equity.
