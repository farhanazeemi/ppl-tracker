import type { Metadata } from 'next';
import Link from 'next/link';
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
  LayoutGrid,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Dumbbell
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HomeInteractiveDemo } from '../components/HomeInteractiveDemo';
import { FITNESS_TOOLS, FitnessTool } from '../config/tools';
import { getAllBlogPosts } from '../sanity/getPosts';
import { formatPostDate } from '../data/mockBlogPosts';
import { getWebApplicationSchema } from '../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'PPL Tracker | Modern Fitness Platform & Workout Progression Tools',
  description:
    'Free evidence-based fitness platform: 6-day Push-Pull-Legs progressive overload tracker, BMI calculator with metric/imperial units, barbell plate math, and peer-reviewed biomechanics journal.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PPL Tracker | Modern Fitness Platform & Workout Progression Tools',
    description:
      'Free evidence-based fitness platform: 6-day Push-Pull-Legs progressive overload tracker, BMI calculator, barbell plate math, and biomechanics journal.',
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
    title: 'PPL Tracker | Modern Fitness Platform & Workout Progression Tools',
    description:
      'Free evidence-based fitness platform: 6-day PPL workout tracker, BMI calculator, and biomechanics journal.',
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
        return <Dumbbell className="w-6 h-6 text-amber-500" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-emerald-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Global Navigation Bar */}
      <Navbar />

      <main className="space-y-24 sm:space-y-32">
        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Modern Resistance Training & Fitness Platform
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-none">
              Relentless Progressive Overload. <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Engineered For Maximum Muscle.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto font-sans leading-relaxed">
              PPL Tracker transforms your hypertrophy journey into a precise, science-backed discipline. Execute structured 6-day splits, auto-detect double progression rep ceilings, compute barbell sleeve math, screen body mass metrics, and read peer-reviewed biomechanics research.
            </p>

            {/* Prominent Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/tools/ppl-tracker"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-display font-black uppercase tracking-wider text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all btn-tactile flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Launch PPL Tracker</span>
              </Link>

              <Link
                href="/tools"
                className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs uppercase tracking-wider rounded-2xl transition-all btn-tactile flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 text-amber-500" />
                <span>Explore All Tools ({FITNESS_TOOLS.length})</span>
              </Link>

              <a
                href="#demo"
                className="w-full sm:w-auto px-5 py-4 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Interactive Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 4 Architectural Pillar Stats */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { val: '6-Day Split', label: 'Push · Pull · Legs Periodization' },
                { val: 'Double Progression', label: 'Rep Ceiling Auto-Detection' },
                { val: 'Web Audio Pacing', label: 'Automatic Interval Rest Timers' },
                { val: '100% Free & Local', label: 'Offline Ready + Supabase Sync' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm"
                >
                  <div className="text-lg sm:text-xl font-display font-black text-amber-500">
                    {stat.val}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase mt-0.5 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. FEATURED FITNESS TOOLS SECTION                         */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                // Platform Utilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Featured Fitness Tools
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl">
                Purpose-built applications designed to streamline workout execution, body composition screening, and barbell loading.
              </p>
            </div>

            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-amber-500 hover:text-amber-400 transition"
            >
              <span>View All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {FITNESS_TOOLS.map((tool) => (
              <div
                key={tool.id}
                className="rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 p-7 sm:p-9 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-850 group-hover:scale-105 transition-transform">
                      {renderToolIcon(tool.iconName)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        {tool.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {tool.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed mt-2">
                      {tool.fullDescription}
                    </p>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 font-sans pt-2">
                    {tool.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Free Online Access
                  </div>
                  <Link
                    href={tool.href}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-display font-black uppercase tracking-wider text-xs shadow-md transition-all btn-tactile inline-flex items-center gap-2"
                  >
                    <span>{tool.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. PLATFORM CORE ARCHITECTURE & BENEFITS                  */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              // Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Built Specifically For Hypertrophy Athletes
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans">
              Every screen, timer, algorithm, and modal is calibrated to keep you locked into high-intensity training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Day-Specific Smart Scheduling',
                desc: 'Detects today’s exact day of the week and automatically loads the scheduled workout for your active split.',
                badge: 'Calendar Detection',
                color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
              },
              {
                icon: Target,
                title: 'Target Weak-Point Tailoring',
                desc: 'Select lagging muscle groups (e.g. Upper Chest, Lateral Delts, Hamstrings). The engine reorganizes exercises to prioritize them first.',
                badge: 'Weak-Point Engine',
                color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
              },
              {
                icon: TrendingUp,
                title: 'Double Progression Tracking',
                desc: 'Lock in fixed weight. Once you hit the top rep ceiling across every set, the app triggers your next load jump.',
                badge: 'Scientific Overload',
                color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
              },
              {
                icon: Timer,
                title: 'Automated Rest Timers',
                desc: 'Checking a set triggers an optimal rest countdown (60s to 3 min) with audio beeps and progress rings.',
                badge: 'Interval Countdown',
                color: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
              },
              {
                icon: Scale,
                title: 'Olympic Barbell Plate Math',
                desc: 'Enter any target weight and view the exact 20kg, 15kg, 10kg, 5kg, and fractional plates needed per sleeve.',
                badge: 'Zero Mental Math',
                color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
              },
              {
                icon: BookOpen,
                title: 'Biomechanics Science Journal',
                desc: 'Integrated fitness journal with peer-reviewed articles on clavicular chest angles, scapular scaption, and muscle protein synthesis.',
                badge: 'Sanity Studio Powered',
                color: 'text-pink-500 bg-pink-500/10 border-pink-500/20'
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-all space-y-4 shadow-sm hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-850 text-amber-500">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-full border ${f.color}`}>
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                      {f.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500">
                    <CheckCircle2 className="w-4 h-4" /> Included Free
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. INTERACTIVE LIVE DEMO SECTION                          */}
        {/* ========================================================= */}
        <section id="demo" className="py-20 bg-zinc-100/60 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                // Hands-On Simulation
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Test The Engine Right Here
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Click the checkmarks below to simulate set completions, observe real-time volume calculations, and preview Olympic plate math.
              </p>
            </div>

            <HomeInteractiveDemo />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. GOLDEN HYPERTROPHY PRINCIPLES                          */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              // Scientific Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              The Golden Hypertrophy Rules
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Validated protocols from the Journal of Strength and Conditioning Research encoded directly into our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                rule: '01',
                title: '15°–30° Incline Angle',
                badge: 'Clavicular Pec Bias',
                desc: 'Steeper angles transfer tension to front deltoids. Keeping the bench between 15° and 30° isolates upper chest fibers.'
              },
              {
                rule: '02',
                title: 'Double Progression',
                badge: 'Rep Ceiling Rule',
                desc: 'Progress reps first across all target working sets. Only increase external load once every set hits the prescribed rep ceiling.'
              },
              {
                rule: '03',
                title: 'Loaded Stretch Under Control',
                badge: '2–3s Eccentric Negative',
                desc: 'Control the descent and eliminate bouncing at the bottom of incline presses, lateral raises, and RDLs for peak tension.'
              }
            ].map((r, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display font-black text-amber-500">
                    {r.rule}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {r.badge}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. LATEST ARTICLES FROM BIOMECHANICS JOURNAL (SANITY)     */}
        {/* ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
                // Biomechanics Journal
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                Latest Research & Breakdowns
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans">
                Real-time peer-reviewed fitness articles and exercise kinematics from our Sanity CMS.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-amber-500 hover:text-amber-400 transition"
            >
              <span>Explore All {allPosts.length} Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="rounded-3xl overflow-hidden bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Featured Image Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {post.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.mainImage}
                      alt={post.imageAlt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                      <BookOpen className="w-8 h-8 text-zinc-400" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/20">
                    {post.splitCategory}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        {formatPostDate(post.publishedAt)}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">
                      {post.author?.name || 'Science Contributor'}
                    </span>
                    <span className="text-amber-500 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
        {/* 7. HIGH-CONVERTING BOTTOM CTA                             */}
        {/* ========================================================= */}
        <section className="pb-12 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-14 text-black text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight leading-none">
              Start Tracking With Surgical Precision Today
            </h2>
            <p className="text-sm sm:text-base font-medium max-w-2xl mx-auto text-black/85 leading-relaxed">
              Open the PPL Workout Tracker, select your training split, pick your lagging muscle groups, and let our engine orchestrate your progressive overload.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/tools/ppl-tracker"
                className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-zinc-900 text-white font-display font-bold uppercase tracking-wider text-sm rounded-2xl shadow-2xl transition-transform active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Workout Tracker Now</span>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </Link>
              <Link
                href="/tools/bmi-calculator"
                className="w-full sm:w-auto px-6 py-4 bg-black/15 hover:bg-black/25 text-black border border-black/20 font-mono text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4" />
                <span>Calculate Your BMI</span>
              </Link>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-black/70">
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
