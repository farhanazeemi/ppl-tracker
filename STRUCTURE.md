# PPL Tracker — Information Architecture & Site Structure

**Canonical Origin:** `https://ppltracker.web.id`  
**Architecture Pattern:** Hub-and-Spoke with High-Utility SaaS Applications & Scientific Pillar Clusters

---

## 1. Global Hierarchy Diagram

```mermaid
flowchart TD
    Home["Home (/)<br/><i>Core Operating System & 3D Visualizer</i>"]
    
    subgraph ToolsHub ["Tools Hub (/tools)"]
        Tracker["PPL Workout Tracker<br/>(/tools/ppl-tracker)"]
        SubFinder["Workout Substitution Finder<br/>(/tools/workout-substitution-finder)"]
        BMICalc["BMI & Physique Calculator<br/>(/tools/bmi-calculator)"]
    end
    
    subgraph BlogHub ["Journal Hub (/blog)"]
        PushCluster["Push / Chest / Triceps Cluster<br/>(14 Articles)"]
        PullCluster["Pull / Lat Width / Upper Back Cluster<br/>(14 Articles)"]
        LegsCluster["Legs / Squat / Posterior Chain Cluster<br/>(16 Articles)"]
        NutritionCluster["Sports Nutrition & MPS Cluster<br/>(12 Articles)"]
        SpecialtyCluster["Prehab, Calisthenics & Cardio<br/>(24 Articles)"]
    end

    subgraph AuthorsHub ["Authors & E-E-A-T Hub (/author)"]
        Vance["Dr. Marcus Vance, Ph.D.<br/>(/author/dr-marcus-vance)"]
        Rostova["Elena Rostova, CSCS<br/>(/author/elena-rostova)"]
        Sterling["Liam Sterling<br/>(/author/liam-sterling)"]
    end

    subgraph TrustLegal ["Trust & Governance"]
        About["About Platform (/about)"]
        Contact["Contact & Support (/contact)"]
        Privacy["Privacy Policy (/privacy)"]
        Terms["Terms of Service (/terms)"]
    end

    Home --> ToolsHub
    Home --> BlogHub
    Home --> AuthorsHub
    Home --> TrustLegal

    ToolsHub --> Tracker
    ToolsHub --> SubFinder
    ToolsHub --> BMICalc

    BlogHub --> PushCluster
    BlogHub --> PullCluster
    BlogHub --> LegsCluster
    BlogHub --> NutritionCluster
    BlogHub --> SpecialtyCluster

    PushCluster -. Mandatory In-Article Links .-> Tracker
    PullCluster -. Mandatory In-Article Links .-> Tracker
    LegsCluster -. Mandatory In-Article Links .-> Tracker
    PushCluster -. Exercise Swap Links .-> SubFinder
    NutritionCluster -. Energy Balance Links .-> BMICalc
```

---

## 2. URL Directory Directory Map

### A. Root & Web Applications (High-Intent Conversion Pillar)
- `https://ppltracker.web.id/` — Flagship interactive application, demo visualizer, and feature breakdown.
- `https://ppltracker.web.id/tools` — Complete software directory indexing all utilities.
- `https://ppltracker.web.id/tools/ppl-tracker` — Focused 6-day workout logbook, rest timer engine, and Olympic barbell plate math.
- `https://ppltracker.web.id/tools/workout-substitution-finder` — Biomechanical alternative calculator for crowded gyms and home workouts.
- `https://ppltracker.web.id/tools/bmi-calculator` — Dual-unit BMI calculator tailored with muscle-mass contextual guidance for lifters.

### B. Scientific Editorial & Peer Review
- `https://ppltracker.web.id/blog` — Primary publication collection page with split category filters and reading time badges.
- `https://ppltracker.web.id/blog/{slug}` — 80 deep biomechanical research articles with table of contents, accessible accordions, and Google SwG integration.

### C. Verified Author Profiles (Google E-E-A-T Foundation)
- `https://ppltracker.web.id/author` — Editorial board overview and peer-review process documentation.
- `https://ppltracker.web.id/author/dr-marcus-vance` — Lead Biomechanics Researcher (Stanford Ph.D., CSCS).
- `https://ppltracker.web.id/author/elena-rostova` — Head of High-Performance S&C (Ohio State B.S., CSCS, USAW L2).
- `https://ppltracker.web.id/author/liam-sterling` — Natural Bodybuilding Coach (WNBF Pro, NASM CPT).

### D. Governance & Trust Pages
- `https://ppltracker.web.id/about` — Research methodology, software engineering principles, and core values.
- `https://ppltracker.web.id/contact` — Technical support and scientific editorial contact.
- `https://ppltracker.web.id/privacy` — Transparent data handling, local-first storage, and cookie consent disclosures.
- `https://ppltracker.web.id/terms` — Terms of use, exercise safety disclaimer, and limitation of liability.

---

## 3. Crawl Equity & Index Budget Safeguards

1. **Restricted Paths**:
   - `/studio/*` (Sanity CMS management interface) — strictly `Disallow: /studio/` in `robots.ts` and `noindex`.
   - `/api/*` (Backend route handlers) — `Disallow: /api/`.
   - `/auth/callback` (OAuth callback loop) — `Disallow: /auth/callback`.

2. **Crawl Efficiency**:
   - Total indexable HTML footprint is 92 pristine, statically pre-rendered (SSG) URLs.
   - Initial page loads hydrate in < 200 ms with zero client-side redirection chains.
