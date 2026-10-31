# 🏋️ PPL Hypertrophy Tracker (Push • Pull • Legs) — UI/UX v2

[![Live Web Application](https://img.shields.io/badge/Production-ppltracker.web.id-10141b?style=for-the-badge&logo=vercel&logoColor=B7FF4A)](https://ppltracker.web.id)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Design System](https://img.shields.io/badge/UI_Design-Athletic_Bento_v2-B7FF4A?style=for-the-badge&logoColor=black)](https://ppltracker.web.id)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_AA_Compliant-36D6B0?style=for-the-badge)](https://www.w3.org/WAI/WCAG2AA-Conformance)
[![Sanity Studio v3](https://img.shields.io/badge/Sanity_CMS-v3-f03e2f?style=for-the-badge&logo=sanity)](https://www.sanity.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **The Evidence-Based Progressive Overload Operating System & Biomechanical Exercise Substitution Engine for Serious Natural Athletes.**  
> Fusing Apple Fitness+ visual sophistication, Linear's clean ergonomics, and editorial sports-science precision. Built with Next.js 15 App Router, React 19, Tailwind CSS, self-hosted Geist typography, Sanity Studio v3, and Supabase.

---

## 🌟 Overview

**PPL Hypertrophy Tracker** is an evidence-based resistance training web application, biomechanical exercise substitution engine, and sports science research journal. It eliminates guesswork in the gym by automating rep-bracket ceilings (Double Progression), rest interval timing, barbell plate math, periodized training splits, and deterministic exercise substitutions when gym equipment or machines are occupied.

With the **v2 Athletic Redesign**, the entire interface has been upgraded to a dark-mode native, thumb-zone optimized mobile web application featuring an asymmetric Bento Grid architecture, strict WCAG AA contrast compliance, zero-FOUC theme persistence, and tactile micro-interactions.

- **Production Application**: [https://ppltracker.web.id](https://ppltracker.web.id)
- **PPL Workout Tracker**: [https://ppltracker.web.id/tools/ppl-tracker](https://ppltracker.web.id/tools/ppl-tracker)
- **Workout Substitution Finder**: [https://ppltracker.web.id/tools/workout-substitution-finder](https://ppltracker.web.id/tools/workout-substitution-finder)
- **Athlete BMI & Body Comp Calculator**: [https://ppltracker.web.id/tools/bmi-calculator](https://ppltracker.web.id/tools/bmi-calculator)
- **Athlete Tools Directory**: [https://ppltracker.web.id/tools](https://ppltracker.web.id/tools)
- **Scientific Research Journal**: [https://ppltracker.web.id/blog](https://ppltracker.web.id/blog)
- **Embedded Sanity Studio**: [https://ppltracker.web.id/studio](https://ppltracker.web.id/studio)

---

## 🎨 Design System & UX Architecture (v2)

### 1. Athletic Bento Grid Architecture
- **Asymmetric Visual Hierarchy**: Modern bento cards (`card-bento`) featuring 1px high-contrast structural borders, subtle radial gradient illumination, and smooth 220ms lift on interaction.
- **Glassmorphic HUD Elements**: Controlled backdrop blur (`backdrop-blur-md`) applied to top sticky workout summary bars, desktop navigation chrome, and floating mobile navigation.

### 2. High-Performance Typography
- **Geist & Geist Mono**: Self-hosted variable fonts loaded via `next/font/local` for zero external network roundtrips and zero layout shifts (CLS = 0).
- **Tabular Numerals**: Every workout statistic, timer countdown, rep count, barbell load, and 1RM calculation is styled with `tabular-nums` (`font-feature-settings: "tnum" 1`) to eliminate character jitter during live updates.

### 3. Thumb-Zone Mobile Navigation
- **Persistent Bottom Navigation**: Fixed, glassmorphic 5-destination bottom navigation bar (`Home`, `Tracker`, `Tools`, `Journal`, `Profile`) mapped to existing application routes and modals with active indicator pills and safe-area insets (`pb-safe`).
- **Tactile Touch Targets**: All primary interactive elements, steppers, and completion checkboxes feature minimum 44×44px hitboxes for effortless single-handed gym operation.

### 4. 100% WCAG AA Contrast Compliance
- **Dark Mode (Default)**: Deep layered surfaces (`#090B0F` base, `#10141B` secondary, `#151B24` card, `#1B2330` elevated) with high-contrast text (`#F5F7FA` primary, `#A0A9B8` secondary, `#8291A5` muted: 4.92:1 on elevated surfaces). Electric Volt (`#B7FF4A`) and Cyan-Teal (`#36D6B0`) sports accents.
- **Light Mode**: Crisp editorial surfaces (`#F5F7FA` base, `#FFFFFF` cards, `#EDF1F5` elevated) with recalibrated high-contrast text (`#10141B` primary, `#586273` secondary, `#5F6B7A` muted: 4.78:1) and darkened accent tokens (`#496E0F` text/border: 5.26:1; `#6B9F19` solid buttons).

### 5. Zero-FOUC Theme Persistence
- Blocking pre-paint `<script>` injected directly in `<head>` inspecting `localStorage` and `prefers-color-scheme`, ensuring zero white-flash on page load while defaulting new visitors to Dark Mode.

---

## 🚀 Core Application Features

### 1. 🔄 Workout Substitution Finder (`/tools/workout-substitution-finder`)
Never lose training momentum when machines, benches, or squat racks are occupied.
- **Deterministic Biomechanical Matching Engine**: Multi-tiered scoring algorithm weighting:
  - **Primary Muscle Overlap (30%)**: Target muscle recruitment match.
  - **Movement Pattern Similarity (25%)**: Horizontal press, vertical pull, hip hinge, knee flexion, etc.
  - **Equipment Availability (20%)**: Filter by open equipment (Dumbbells, Barbells, Cables, Machines, Bodyweight, Bands).
  - **Secondary Synergist Muscles (15%)**: Assisting stabilizer and mover recruitment.
  - **Exercise Category Match (10%)**: Compound vs. isolation alignment.
  - **Training Goal Adaptation (5%)**: Hypertrophy, Strength, General Fitness, or Home Workout prioritization.
- **Transparent Biomechanical Insights**: Clear "Why Recommended" explanations (joint kinematics, plane of motion) and "Key Differences" (stabilization demands, resistance curve variances).
- **Direct Tracker Integration**: One-click "Use in PPL Tracker" button automatically swaps the alternative directly into your active workout session with banner confirmation.
- **Single Source of Truth**: Evaluates real exercises directly from the canonical exercise catalog (74 unique exercises across all splits).

### 2. ⚡ Double Progression Protocol Engine (`/tools/ppl-tracker`)
- **Automated Rep Ceilings**: Working sets are tracked within structured rep brackets (e.g., $3 \times 8\text{--}12$ or $3 \times 10\text{--}15$).
- **Earned Progression Alert**: When all sets hit the prescribed rep ceiling with strict form, the engine triggers an **"Earned Double Progression"** indicator signaling to advance load ($+2.5\text{ kg} / +5\text{ lbs}$) while resetting to the lower rep floor.
- **Epley 1RM Formula**: Real-time Estimated 1-Rep Max computation on top working sets.

### 3. 📅 4 Periodized Split Programs & Weak-Point Tailoring
- **4 Complete Resistance Programs**:
  - **6-Day Push / Pull / Legs (PPL)**: Optimal hypertrophy frequency (2x per muscle group weekly).
  - **5-Day Classic Bro Split**: High-volume body part isolation (Chest, Back, Arms, Shoulders, Legs).
  - **4-Day Upper / Lower Split**: Balanced strength and recovery distribution.
  - **3-Day Full Body Routine**: Maximum frequency per session for busy athletes.
- **Lagging Muscle Specialization**: Dynamically tailors exercise selection and volume prioritization for Pecs, Lats/Upper Back, Delts, Quads/Hamstrings, or Arms.

### 4. ⏱️ Automated Rest Interval Timers & Web Audio API
- Automatic rest countdowns customized per movement category ($60\text{s}$, $90\text{s}$, $120\text{s}$, $180\text{s}$).
- Zero-dependency sound synthesizer using the browser's native **Web Audio API** for tactile button clicks, countdown chimes, and completion alerts.
- Dedicated sound effects toggle (mute / unmute) with persistent user preference.

### 5. 🏋️ Olympic Barbell Plate Calculator
- Real-time plate breakdown calculator for standard Olympic bars ($20\text{ kg} / 45\text{ lbs}$).
- Visually stacks calibrated bumper plates ($25\text{kg}$, $20\text{kg}$, $15\text{kg}$, $10\text{kg}$, $5\text{kg}$, $2.5\text{kg}$, $1.25\text{kg}$) per sleeve.

### 6. ⚖️ Athlete BMI & Body Composition Calculator (`/tools/bmi-calculator`)
- Dual-unit conversion supporting Metric ($cm / kg$) and Imperial ($ft + in / lbs$).
- Visual WHO classification spectrum gauge with animated needle and target healthy weight range estimates.
- Evidence-based clinical caveats addressing Fat-Free Mass Index (FFMI) and muscle mass vs. fat mass for resistance-trained athletes.

### 7. ☁️ Supabase Cloud Sync & Local-First Guest Athlete Mode
- **Dual Authentication Modes**:
  - **Cloud Athlete**: Email / Password & Google OAuth sign-in with cloud history synchronization.
  - **Guest Athlete**: Instant local offline access with zero signup friction.
- Cloud database on Supabase PostgreSQL with strict Row Level Security (RLS) policies.
- Athlete profile customization: Bodyweight, height, age, training split, unit preference ($kg / lbs$), and weak-point focus.

### 8. 📚 The Hypertrophy Science Journal & Embedded Sanity Studio (`/blog` & `/studio`)
- Integrated headless CMS powered by **Sanity Studio v3** directly embedded at `/studio`.
- 60+ peer-reviewed biomechanics, nutrition, and programming articles.
- Accessible interactive `<TableOfContents />` with active section highlighting via `IntersectionObserver`.
- Accessible `<FaqAccordion />` components and rich `<ArticlePortableText />` rendering.
- Real-time category filtering across 10 fitness pillars and integrated live search.

### 9. 🔍 Search & AI Engine Optimization (SEO, GEO & AEO)
- Comprehensive **Schema.org** structured data graphs:
  - `WebApplication` schema on Homepage and Tools.
  - `BlogPosting`, `BreadcrumbList`, and `FAQPage` schemas on Journal articles.
  - `Organization` and `WebSite` sitewide identity graphs.
- Generative Engine Optimization (**GEO**) with `public/llms.txt` for AI answer engines (ChatGPT, Perplexity, Claude, Google Gemini).
- Dynamic `robots.ts` and automated `sitemap.ts` indexing all 76+ static routes with crawl budget protection.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Core Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **Typography** | Geist Sans & Geist Mono via `next/font/local` |
| **Headless CMS** | [Sanity Studio v3](https://www.sanity.io/), [Next-Sanity](https://github.com/sanity-io/next-sanity), `@portabletext/react` |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + RLS + GoTrue Auth with Google OAuth) |
| **Audio Synthesizer** | Native Browser Web Audio API |
| **Icons & UI** | [Lucide React](https://lucide.dev/), `canvas-confetti`, `clsx`, `tailwind-merge` |
| **Deployment & Hosting** | [Vercel](https://vercel.com/) |

---

## 📁 Project Architecture

```text
ppl-tracker/
├── public/
│   ├── favicon.ico
│   ├── icon.svg                     # Electric volt & cyan SVG favicon
│   ├── llms.txt                     # GEO / AI search engine discovery manifest
│   ├── sw.js                        # Offline service worker
│   └── site.webmanifest
├── src/
│   ├── app/
│   │   ├── fonts/                   # Self-hosted Geist-Variable & GeistMono-Variable
│   │   ├── (auth)/auth/callback/    # Supabase auth token verification & password reset
│   │   ├── about/                   # Editorial and mission statement
│   │   ├── blog/                    # Scientific journal feed & [slug] dynamic articles
│   │   ├── contact/                 # Contact & feedback form
│   │   ├── privacy/ & terms/        # Legal, privacy & terms
│   │   ├── studio/[[...tool]]/      # Embedded Sanity Studio v3 interface
│   │   ├── tools/
│   │   │   ├── page.tsx             # Athlete Tools Hub bento directory
│   │   │   ├── bmi-calculator/      # Body Mass Index screening tool
│   │   │   ├── ppl-tracker/         # Core PPL workout tracker interface
│   │   │   └── workout-substitution-finder/ # Biomechanical exercise substitution engine
│   │   ├── layout.tsx               # Root layout with pre-paint theme script, mobile bottom nav
│   │   ├── page.tsx                 # Bento landing page with interactive sample tracker preview
│   │   ├── robots.ts                # Crawl rules & budget protection
│   │   └── sitemap.ts               # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BentoCard.tsx        # Polymorphic bento grid container with glow
│   │   │   ├── BottomSheet.tsx      # Accessible mobile bottom sheet drawer
│   │   │   └── Skeleton.tsx         # Accessible shimmer loading state
│   │   ├── AuthModal.tsx            # Supabase Email + Google OAuth modal
│   │   ├── CelebrationModal.tsx     # Session completion modal with confetti
│   │   ├── ExerciseCard.tsx         # Tracker set/rep logger with 44px hitboxes & plate math
│   │   ├── FaqAccordion.tsx         # Accessible interactive FAQ accordion
│   │   ├── Footer.tsx & Navbar.tsx  # Global navigational chrome with tools mega-menu
│   │   ├── HomeInteractiveDemo.tsx  # Clearly badged interactive preview with sample data
│   │   ├── MobileBottomNav.tsx      # Thumb-zone 5-destination persistent bottom bar
│   │   ├── OnboardingModal.tsx      # 4-step athlete setup wizard
│   │   ├── PlateCalculatorModal.tsx # Calibrated Olympic plate visualizer modal
│   │   ├── PplTrackerApp.tsx        # Workout state machine & substitution banner
│   │   ├── ProfileModal.tsx         # Athlete preferences and split manager
│   │   ├── RestTimer.tsx            # Digital countdown HUD with Web Audio alerts
│   │   ├── TableOfContents.tsx      # IntersectionObserver article table of contents
│   │   ├── WorkoutHistoryModal.tsx  # PRs and training session log history
│   │   └── tools/
│   │       └── WorkoutSubstitutionFinder.tsx # Full interactive substitution UI
│   ├── config/
│   │   └── tools.ts                 # Registry of athlete tools & metadata
│   ├── context/
│   │   └── ThemeContext.tsx         # Zero-FOUC theme state & colorScheme synchronization
│   ├── data/
│   │   └── workouts.ts              # Canonical workouts source of truth (4 programs, 107 instances)
│   ├── lib/
│   │   ├── audio.ts                 # Native Web Audio sound synthesizer
│   │   ├── sanity/                  # Sanity client, schemas, and GROQ queries
│   │   ├── supabase/                # Supabase browser/server client initialization
│   │   └── workout-substitution/
│   │       ├── engine.ts            # Deterministic scoring algorithm
│   │       └── exerciseRepository.ts# Canonical repository adapter & biomechanical inference
│   └── types/
│       ├── substitution.ts          # Types for exercises, filters, weights, and matches
│       └── workout.ts               # ExerciseDefinition, WorkoutDay, and AthleteProfile types
├── sanity.config.ts                 # Sanity Studio project configuration
├── tailwind.config.ts               # Design system tokens and color themes
└── package.json
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `18.17+` or `20+`
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/farhanazeemi/ppl-tracker.git
cd ppl-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Supabase Authentication & Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Sanity Studio & Headless Blog CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Verification & Production Build
```bash
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

---

## 🔒 Security & Data Integrity

- **Row Level Security (RLS)**: Athlete profiles and workout logs in Supabase are isolated by user UUID; athletes can strictly access only their own records.
- **Local-First Architecture**: Guest mode keeps workout data in browser `localStorage`, ensuring zero data loss during network disruptions.
- **Zero Hardcoded Secrets**: All authentication keys and environment configurations are strictly isolated in `.env.local` and excluded via `.gitignore`.
- **Crawl Budget Protection**: Non-indexable administrative routes (`/studio/`, `/api/`, `/auth/callback`) are disallowed in `robots.ts`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for personal and educational resistance training tracking.
