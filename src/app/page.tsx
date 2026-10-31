import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Target,
  TrendingUp,
  Timer,
  Scale,
  BookOpen,
  Boxes,
  ChevronRight,
  Flame,
  Dumbbell,
  Layers,
  Activity,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HomeInteractiveDemo } from '../components/HomeInteractiveDemo';
import { BentoCard } from '../components/ui/BentoCard';
import { FITNESS_TOOLS, FitnessTool } from '../config/tools';
import { getAllBlogPosts } from '../sanity/getPosts';
import { formatPostDate } from '../data/mockBlogPosts';
import { getWebApplicationSchema } from '../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'PPL Tracker | Evidence-Based Hypertrophy & Workout Technology Platform',
  description:
    'Free evidence-based fitness technology platform: 4 periodized resistance training splits, automated double progression tracking, deterministic exercise substitution finder, Olympic barbell plate math, BMI calculator, and peer-reviewed biomechanics journal.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PPL Tracker | Evidence-Based Hypertrophy & Workout Technology Platform',
    description:
      'Free evidence-based fitness platform: 4 resistance splits, double progression tracking, workout substitution finder, barbell plate math, and biomechanics journal.',
    url: baseUrl,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Tracker Platform Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PPL Tracker | Evidence-Based Hypertrophy & Workout Technology Platform',
    description:
      'Free evidence-based fitness platform: 4 resistance splits, double progression tracking, workout substitution finder, and biomechanics journal.',
    images: ['/icon.svg'],
  },
};

export default async function HomePage() {
  const webAppSchema = getWebApplicationSchema();
  const allPosts = await getAllBlogPosts();
  const latestPosts = allPosts.slice(0, 3);

  const renderToolIcon = (iconName: FitnessTool['iconName']) => {
    switch (iconName) {
      case 'Dumbbell':
        return <Dumbbell className="w-5 h-5 text-[#B7FF4A]" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#36D6B0]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#B7FF4A]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Global Navigation Bar */}
      <Navbar />

      <main className="space-y-20 sm:space-y-28">
        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-20 border-b border-[var(--border-subtle)]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-[#B7FF4A]/10 via-[#36D6B0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B7FF4A]/10 border border-[#B7FF4A]/25 text-[#B7FF4A] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based Hypertrophy Operating System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] max-w-5xl mx-auto leading-none">
              Relentless Progressive Overload. <br />
              <span className="text-[#B7FF4A]">
                Engineered For Serious Muscle.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              PPL Tracker transforms your hypertrophy training into a precise science. Execute 4 periodized training splits, auto-detect double progression rep ceilings, find deterministic exercise substitutes when machines are taken, and master biomechanics.
            </p>

            {/* Prominent Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/tools/ppl-tracker"
                className="w-full sm:w-auto px-8 py-4 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-[#B7FF4A]/20 transition-all btn-tactile flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Start Today&apos;s Workout</span>
              </Link>

              <Link
                href="/tools"
                className="w-full sm:w-auto px-7 py-4 glass-panel hover:bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider rounded-2xl transition-all btn-tactile flex items-center justify-center gap-2 cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-[#B7FF4A]" />
                <span>Explore Athlete Tools ({FITNESS_TOOLS.length})</span>
              </Link>

              <a
                href="#demo"
                className="w-full sm:w-auto px-5 py-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Interactive Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 4 Architectural Pillar Stats */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { val: '4 Programs', label: 'PPL • Upper/Lower • Bro • Full Body' },
                { val: 'Double Progression', label: 'Rep Ceiling Auto-Detection' },
                { val: 'Deterministic Swaps', label: 'Biomechanical Exercise Substitutions' },
                { val: '100% Free & Local', label: 'Offline Ready + Supabase Sync' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
                >
                  <div className="text-lg sm:text-xl font-display font-black text-[#B7FF4A] tnum">
                    {stat.val}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase mt-0.5 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. ASYMMETRIC BENTO GRID: ATHLETE SUITE                   */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
                Platform Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
                The Athlete Performance Bento
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
                Integrated resistance utilities engineered to eliminate friction from workout logging, progressive overload, and machine congestion.
              </p>
            </div>

            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#B7FF4A] hover:underline"
            >
              <span>All Tools Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 12-Column Responsive Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tile 1: PPL Workout Tracker Flagship (Span 8) */}
            <BentoCard
              glowAccent="volt"
              className="md:col-span-8 flex flex-col justify-between"
              badge={
                <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
                  Core Engine
                </span>
              }
              title="PPL Workout Tracker"
              subtitle="6-Day Push • Pull • Legs Hypertrophy Engine with automated Double Progression & weak-point tailoring."
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Splits</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">4 Periodized Plans</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Overload Logic</div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">Double Progression</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Architecture</div>
                  <div className="text-sm font-bold text-[#36D6B0]">Local-First Offline</div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  74 Canonical Exercises Loaded
                </span>
                <Link
                  href="/tools/ppl-tracker"
                  className="px-5 py-2.5 rounded-2xl bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-black uppercase tracking-wider text-xs shadow-md transition-all btn-tactile inline-flex items-center gap-2"
                >
                  <span>Launch Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </BentoCard>

            {/* Tile 2: Workout Substitution Finder (Span 4) */}
            <BentoCard
              glowAccent="teal"
              className="md:col-span-4 flex flex-col justify-between"
              badge={
                <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#36D6B0]/10 text-[#36D6B0] border border-[#36D6B0]/25">
                  Biomechanical
                </span>
              }
              title="Substitution Finder"
              subtitle="Squat rack or cable station occupied? Get instant biomechanically matched exercise alternatives."
            >
              <div className="space-y-2.5 my-4">
                <div className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Example Swap:</div>
                  <div className="text-[var(--text-primary)] font-bold mt-0.5">
                    Lat Pulldown → Chest-Supported Row
                  </div>
                  <div className="text-[10px] text-[#36D6B0] mt-1">
                    94% Muscle & Kinematic Match
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <Link
                  href="/tools/workout-substitution-finder"
                  className="w-full py-2.5 px-3 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-between"
                >
                  <span>Find Substitutes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#36D6B0]" />
                </Link>
              </div>
            </BentoCard>

            {/* Tile 3: Rest Interval Timer (Span 4) */}
            <BentoCard
              className="md:col-span-4 flex flex-col justify-between"
              title="Automated Rest Timers"
              subtitle="Checking a set triggers an optimal rest interval (60s to 3 min) with Web Audio synthesized chimes."
            >
              <div className="flex items-center justify-center py-4">
                <div className="w-24 h-24 rounded-full border-4 border-[var(--border-subtle)] border-t-[#B7FF4A] flex items-center justify-center font-mono font-bold text-xl text-[var(--text-primary)] tnum">
                  90s
                </div>
              </div>
              <div className="text-[11px] font-mono text-center text-[var(--text-muted)]">
                Zero-dependency Web Audio countdown alerts
              </div>
            </BentoCard>

            {/* Tile 4: Olympic Barbell Plate Math (Span 4) */}
            <BentoCard
              className="md:col-span-4 flex flex-col justify-between"
              title="Olympic Barbell Plate Math"
              subtitle="Eliminate gym math errors. Enter target load and view exact bumper plates required per sleeve."
            >
              <div className="flex items-center gap-1.5 justify-center py-4">
                <div className="w-4 h-16 rounded-md bg-red-600 text-[9px] text-white font-mono flex items-center justify-center font-bold">25</div>
                <div className="w-4 h-14 rounded-md bg-blue-600 text-[9px] text-white font-mono flex items-center justify-center font-bold">20</div>
                <div className="w-3.5 h-12 rounded-md bg-yellow-500 text-[9px] text-black font-mono flex items-center justify-center font-bold">15</div>
                <div className="w-3 h-10 rounded-md bg-emerald-600 text-[9px] text-white font-mono flex items-center justify-center font-bold">10</div>
                <div className="w-2.5 h-8 rounded-md bg-zinc-300 dark:bg-zinc-700 text-[8px] text-[var(--text-primary)] font-mono flex items-center justify-center font-bold">5</div>
              </div>
              <div className="text-[11px] font-mono text-center text-[var(--text-muted)]">
                Olympic 20kg bar with collar breakdown
              </div>
            </BentoCard>

            {/* Tile 5: BMI & Athlete Body Comp (Span 4) */}
            <BentoCard
              className="md:col-span-4 flex flex-col justify-between"
              title="Athlete BMI & Body Comp"
              subtitle="Dual-unit screening tool with clinical FFMI caveats explaining fat mass vs muscle mass for lifters."
            >
              <div className="py-4 space-y-2">
                <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 w-full" />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                  <span>Underweight</span>
                  <span className="text-[#B7FF4A] font-bold">Normal</span>
                  <span>Athletic</span>
                </div>
              </div>
              <Link
                href="/tools/bmi-calculator"
                className="w-full py-2.5 px-3 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-between"
              >
                <span>Calculate BMI</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B7FF4A]" />
              </Link>
            </BentoCard>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. INTERACTIVE LIVE DEMO SECTION                          */}
        {/* ========================================================= */}
        <section id="demo" className="py-16 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center space-y-2.5 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
                Live Interactive Tracker Preview
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
                Test The Progression Engine
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Tap the set checkmarks below to simulate set completions, observe real-time volume calculations, and preview Olympic plate math.
              </p>
            </div>

            <HomeInteractiveDemo />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. GOLDEN HYPERTROPHY PRINCIPLES                          */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
              Evidence-Based Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              The Golden Hypertrophy Principles
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Validated protocols from peer-reviewed sports science encoded directly into our platform logic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                rule: '01',
                title: '15°–30° Incline Angle',
                badge: 'Clavicular Pec Bias',
                desc: 'Steeper angles transfer tension to front deltoids. Keeping the bench between 15° and 30° maximizes clavicular pectoral fiber recruitment.'
              },
              {
                rule: '02',
                title: 'Double Progression',
                badge: 'Rep Ceiling Rule',
                desc: 'Progress repetitions first across all target working sets. Only increase external load (+2.5kg / +5lbs) once every set clears the prescribed ceiling.'
              },
              {
                rule: '03',
                title: 'Loaded Stretch Cadence',
                badge: '2–3s Eccentric Negative',
                desc: 'Control the eccentric cadence and eliminate bouncing at the bottom of presses, squats, and lateral raises for peak muscle tension.'
              }
            ].map((r, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-black text-[#B7FF4A]">
                    {r.rule}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
                    {r.badge}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. LATEST ARTICLES FROM BIOMECHANICS JOURNAL (SANITY)     */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#B7FF4A] font-bold">
                Research Journal
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
                Latest Studies & Biomechanics
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Peer-reviewed research and resistance training kinematics from our Sanity Studio CMS.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#B7FF4A] hover:underline"
            >
              <span>Explore All {allPosts.length} Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#B7FF4A]/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Featured Image Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--bg-elevated)]">
                  {post.mainImage ? (
                    <Image
                      src={post.mainImage}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)]">
                      <BookOpen className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[#B7FF4A] border border-[#B7FF4A]/25">
                    {post.splitCategory}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 text-[var(--text-secondary)] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#B7FF4A]" />
                        {formatPostDate(post.publishedAt)}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase text-[var(--text-primary)] group-hover:text-[#B7FF4A] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)] truncate max-w-[140px]">
                      {post.author?.name || 'Science Contributor'}
                    </span>
                    <span className="text-[#B7FF4A] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Study</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. CONVERSION CALLOUT SECTION                              */}
        {/* ========================================================= */}
        <section className="pb-12 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[var(--bg-card)] border border-[#B7FF4A]/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#B7FF4A]/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-none">
              Start Tracking With Surgical Precision Today
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Launch the PPL Workout Tracker, select your training split, customize your lagging muscle targets, and let our engine orchestrate your progressive overload.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/tools/ppl-tracker"
                className="w-full sm:w-auto px-8 py-4 bg-[#B7FF4A] hover:bg-[#a8f23d] text-[#090B0F] font-display font-bold uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-[#B7FF4A]/20 transition-all btn-tactile inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Workout Tracker Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/workout-substitution-finder"
                className="w-full sm:w-auto px-6 py-4 bg-[var(--bg-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-mono text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#36D6B0]" />
                <span>Try Substitution Finder</span>
              </Link>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              No credit card required • 100% Free • Local-first storage
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
