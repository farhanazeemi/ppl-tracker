# 🏋️ PPL Hypertrophy Tracker (Push • Pull • Legs)

[![Live Web Application](https://img.shields.io/badge/Production-ppltracker.web.id-amber?style=for-the-badge&logo=vercel)](https://ppltracker.web.id)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Sanity Studio v3](https://img.shields.io/badge/Sanity_CMS-v3-f03e2f?style=for-the-badge&logo=sanity)](https://www.sanity.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **The Progressive Overload Operating System for Natural Lifters.**  
> Built with Next.js 15 App Router, React 19, Three.js, GSAP, Sanity CMS, and Supabase.

---

## 🌟 Overview

**PPL Hypertrophy Tracker** is an evidence-based progressive overload web application and resistance training research journal. It eliminates guesswork in the gym by automating rep-bracket ceilings (Double Progression), rest interval timing, barbell plate math, and periodized training splits — paired with peer-reviewed biomechanics studies.

- **Production Domain**: [https://ppltracker.web.id](https://ppltracker.web.id)
- **Scientific Journal**: [https://ppltracker.web.id/blog](https://ppltracker.web.id/blog)
- **Headless Content Studio**: [https://ppltracker.web.id/studio](https://ppltracker.web.id/studio)

---

## 🚀 Key Features

### 1. Double Progression Protocol Engine
- Working sets are tracked within structured rep brackets (e.g., $3 \times 8\text{--}12$ or $3 \times 10\text{--}15$).
- When all sets hit the prescribed rep ceiling at strict form, the engine triggers an **"Earned Double Progression"** badge signaling to advance weight by the smallest incremental load ($+2.5\text{ kg} / +5\text{ lbs}$) while resetting to the lower rep floor.
- Built-in Epley 1RM formula calculation for peak working sets.

### 2. Interactive 3D Anatomy & Rig Visualizer (Three.js & GSAP)
- Procedural 3D Olympic Barbell and calibrated bumper plates rendered in WebGL.
- **Dynamic Lighting & Ambient Atmosphere**: Shifts color states according to active split:
  - **Push**: Amber / Orange (`#f59e0b`)
  - **Pull**: Sky Blue (`#0ea5e9`)
  - **Legs**: Emerald Green (`#10b981`)
- Touch & mouse drag orbit rotation, wireframe hologram inspection, and GSAP confetti animations on workout completion.

### 3. Automated Rest Interval Timers & Web Audio API
- Automatic rest countdowns customized per movement ($60\text{s}$, $90\text{s}$, $120\text{s}$, $180\text{s}$).
- Zero-dependency synthesizer using the browser's native **Web Audio API** for tactile button clicks, countdown chimes, and completion alerts.
- Dedicated sound effects toggle (mute / unmute).

### 4. Olympic Barbell Plate Calculator
- Realtime plate breakdown calculator for standard Olympic bars ($20\text{ kg} / 45\text{ lbs}$).
- Visually stacks color-coded bumper plates ($25\text{kg}$, $20\text{kg}$, $15\text{kg}$, $10\text{kg}$, $5\text{kg}$, $2.5\text{kg}$, $1.25\text{kg}$) per sleeve.

### 5. Supabase Cloud Sync & Guest Athlete Mode
- **Dual Authentication Modes**:
  - **Cloud Athlete**: Email / Password & Google OAuth sign-in with cloud history synchronization.
  - **Guest Athlete**: Instant local offline access with zero signup friction.
- Cloud database on Supabase PostgreSQL with strict Row Level Security (RLS) policies.
- Athlete profile customization: Bodyweight, height, age, training split, and unit preference ($kg / lbs$).

### 6. The Hypertrophy Science Journal & Sanity Studio (/blog & /studio)
- Integrated headless CMS powered by **Sanity Studio v3** and **Next-Sanity**.
- High-resolution biomechanical featured photography and contextual diagrams.
- Instant search and category filter across 10 distinct fitness domains:
  - Clavicular Pec / Upper Chest Hypertrophy
  - Low-Bar Squat Mechanics & Overcoming Isometrics
  - Energy Balance & Evidence-Based Body Recomposition
  - Protein Timing & MPS Window Distribution
  - Zone 2 Low-Intensity Aerobic Base Conditioning
  - Gymnastic Rings & Calisthenics Leverage Progressions
  - Scapular Plane Abduction & Rotator Cuff Prehab
  - Perimenopause & Women's Strength Training
  - VO2 Max Protocols & Longevity Science
  - Overcoming Gym Anxiety & Habit Formation

### 7. Google Search & AI Engine Optimization (SEO & GEO)
- Comprehensive **Schema.org** structured data:
  - `WebApplication` schema on Homepage.
  - `BlogPosting` and `CollectionPage` schema with BreadcrumbList on the Journal.
  - `Organization` and `WebSite` sitewide identity graphs.
- Generative Engine Optimization (**GEO**) with `public/llms.txt` for AI crawlers (ChatGPT, Perplexity, Claude, Google Gemini).
- Dynamic `robots.ts` and automated `sitemap.ts` indexing all 48+ static routes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Animations**: [GSAP (GreenSock)](https://gsap.com/)
- **CMS / Headless Blog**: [Sanity v3](https://www.sanity.io/) & [Next-Sanity](https://github.com/sanity-io/next-sanity)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + GoTrue Auth)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment & Hosting**: [Vercel](https://vercel.com/)

---

## 💻 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+ installed
- npm or yarn

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
Create a `.env.local` file in the root directory:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Sanity Studio & Blog CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Security & Data Privacy

- **Zero Credentials in Git**: All API keys, tokens, and local configuration are strictly isolated in `.env.local` and ignored via `.gitignore`.
- **Row Level Security (RLS)**: User workout logs and profiles in Supabase are isolated by user UUID; athletes can only access their own logs.
- **Export / Import**: Full JSON export and import options ensure users own their data with zero platform lock-in.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for personal and educational resistance training tracking.
