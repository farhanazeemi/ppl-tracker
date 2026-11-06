# Phased Implementation Roadmap: PPL Tracker SEO & Organic Scaling

**Execution Period:** Q4 2026 – Q4 2027  
**Guiding Framework:** FLOW (Find &rarr; Leverage &rarr; Optimize &rarr; Win)

---

## Phase 1: Technical & Foundation Excellence (Weeks 1–4) — [COMPLETED]

- [x] **Universal 1200x630 OpenGraph & Twitter Cards**:
  - Replaced SVG social preview defaults with high-contrast, branded raster assets (`/og-image.png` and `/og-image.webp`).
  - Added explicit social metadata across root layout, homepage, tools directory, individual tools, author pages, and compliance pages.
- [x] **Schema.org JSON-LD Infrastructure Overhaul**:
  - Validated all 10 active schema types across all site routes.
  - Replaced SVG logo with Google-compliant PNG logo (`/icon-512.png`).
  - Implemented self-contained `Organization` publisher within `BlogPosting` graph.
  - Injected `BreadcrumbList` schemas across all `/tools/*` routes.
  - Attached `FAQPage` structured data to BMI Calculator & Workout Substitution Finder.
- [x] **XML Sitemap & Lastmod Stability**:
  - Linked real Sanity CMS `_updatedAt` timestamps to `<lastmod>`.
  - Replaced volatile `new Date()` calls on static routes with stable platform release timestamps.
- [x] **Full Test Suite & Static Generation Validation**:
  - 18 Vitest test suites passing (42 tests).
  - 103/103 Next.js static pages generated with zero errors.

---

## Phase 2: Topical Expansion & Exercise Substitution Moat (Weeks 5–12)

- [ ] **Expand Exercise Substitution Engine**:
  - Add 25 new exercise substitution mappings for specialty gym equipment (e.g. Pendulum Squat, Belt Squat, Seal Row, Chest-Supported T-Bar).
- [ ] **Programmatic Internal Cross-Linking**:
  - Automatically surface relevant exercise substitution alternatives directly inside blog post exercise execution sections.
- [ ] **Author E-E-A-T Expansion**:
  - Add Google Scholar, ResearchGate, and LinkedIn profile links to verified author profile schemas (`sameAs`).

---

## Phase 3: Generative Engine Optimization (GEO) & Scale (Weeks 13–24)

- [ ] **AI Search Citation Tracking**:
  - Monitor brand and tool recommendation frequency across ChatGPT Search, Perplexity Pro, and Google AI Overviews.
- [ ] **Enhanced `llms-full.txt` Knowledge Base**:
  - Append full machine-readable exercise biomechanics matrix into `public/llms-full.txt`.
- [ ] **Olympic Barbell Plate Visualizer Embedding**:
  - Build an embeddable widget version of the barbell plate calculator for external fitness blogs.

---

## Phase 4: Domain Authority & High-Profile Endorsements (Months 7–12)

- [ ] **Strength Coach & University Outreach**:
  - Partner with collegiate exercise physiology labs for peer-review citations and digital references.
- [ ] **Community Program Templates**:
  - Launch verified routine imports (e.g., Reddit PPL, GZCLP, Metallicadpa PPL) into the PPL Tracker web app.
