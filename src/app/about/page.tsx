import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { getAboutPageSchema } from '../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'About PPL Hypertrophy Tracker | Sports Science & Architecture',
  description:
    'Discover the evidence-based biomechanics, progressive overload principles, and minimalist engineering powering PPL Hypertrophy Tracker. Created by Farhan Azeemi.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About PPL Hypertrophy Tracker | Sports Science & Architecture',
    description:
      'Discover the evidence-based biomechanics, progressive overload principles, and minimalist engineering powering PPL Hypertrophy Tracker.',
    url: `${baseUrl}/about`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
  },
};

export default function AboutPage() {
  const schema = getAboutPageSchema();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Editorial Hero */}
        <section className="relative overflow-hidden rounded-3xl card-bento p-8 sm:p-14 border border-[var(--border-subtle)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Applied Biomechanics & High-Performance Engineering
            </div>
            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
              Built for Lifters Who Care About the Science.
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-secondary)] leading-relaxed font-sans">
              PPL Hypertrophy Tracker eliminates bloated subscriptions, mid-set ads, and slow loading screens. We built a fast, distraction-free progressive overload engine grounded in peer-reviewed exercise physiology.
            </p>
          </div>
        </section>

        {/* The Problem & Our Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              The Problem with Modern Fitness Apps
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Most gym tracking apps have lost their original purpose. They bombard lifters with social feeds, mandatory $80/year paywalls, confusing AI chatbots, and animations that lag right when you are between heavy sets of squats or presses.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              When you are in the gym, every second counts. You need zero latency, automatic plate math on the barbell, instant rest interval timing, and a clear mathematical system for progressive overload.
            </p>
          </div>

          <div className="p-8 rounded-3xl card-bento space-y-4">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] font-bold uppercase text-sm font-mono">
              <Target className="w-5 h-5" /> The PPL Tracker Standard
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">Zero Loading Screens:</strong> Client-rendered instant UI cached on edge.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">Local-First Offline Ready:</strong> Works in gym basements without cellular signal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">No Subscription Paywalls:</strong> Core periodized hypertrophy features are 100% free.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text-primary)]">Evidence-Based Cues:</strong> Every movement links to real biomechanical studies.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 4 Pillars of Hypertrophy Science */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              The 4 Pillars of Our Methodology
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-mono">
              Every preset rep target, bench angle, and tempo in PPL Tracker is guided by these principles:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl card-bento space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold uppercase text-[var(--text-primary)]">
                15° – 30° Clavicular Angle Priority
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Standard 45° incline benches shift mechanical tension away from upper pecs onto the anterior deltoids. We calibrate all pressing recommendations to a low 15°–30° angle to align with the clavicular fiber line of pull.
              </p>
            </div>

            <div className="p-6 rounded-3xl card-bento space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold uppercase text-[var(--text-primary)]">
                Strict Double Progression Ceilings
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Instead of jumping weights prematurely and sacrificing form, lifters fix their load until they achieve the top of the rep ceiling (e.g., 3 sets of 12) before advancing barbell or dumbbell resistance.
              </p>
            </div>

            <div className="p-6 rounded-3xl card-bento space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold uppercase text-[var(--text-primary)]">
                Loaded Eccentric Stretch (2–3s)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Muscle hypertrophy research consistently demonstrates that loaded eccentric stretches at long muscle lengths drive superior sarcomerogenesis. We enforce controlled descents on RDLs, lateral raises, and presses.
              </p>
            </div>

            <div className="p-6 rounded-3xl card-bento space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="text-base font-bold uppercase text-[var(--text-primary)]">
                Scapular Plane Abduction (30° Forward)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Flaring arms in the pure frontal plane causes subacromial shoulder impingement. Performing lateral raises in the scapular plane maximizes lateral deltoid recruitment while keeping rotator cuff mechanics safe.
              </p>
            </div>
          </div>
        </section>

        {/* Creator & Engineering Section (E-E-A-T) */}
        <section className="p-8 sm:p-12 rounded-3xl card-bento flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-[var(--accent-primary)] text-black flex items-center justify-center font-black text-3xl shadow-xl shadow-[var(--accent-primary)]/20 shrink-0">
            FA
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-primary)] uppercase">
              <Award className="w-4 h-4" /> Creator & Lead Engineer
            </div>
            <h3 className="text-2xl font-black uppercase text-[var(--text-primary)]">
              Farhan Azeemi
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl font-sans">
              Software engineer, resistance training enthusiast, and sports science researcher. Farhan designed PPL Hypertrophy Tracker to combine modern web technologies (Next.js 15, Web Audio API, Three.js 3D rigs, and Supabase RLS) with rigorous natural bodybuilding overload protocols.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs font-mono">
              <a
                href="https://github.com/farhanazeemi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" /> GitHub Profile
              </a>
              <span className="text-[var(--border-subtle)]">•</span>
              <a
                href="https://twitter.com/farhanazeemi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" /> @farhanazeemi
              </a>
              <span className="text-[var(--border-subtle)]">•</span>
              <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">
                Direct Contact
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] p-8 sm:p-12 text-black flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Start Tracking With Science Today
            </h2>
            <p className="text-sm font-medium text-black/80 font-sans">
              Zero signup required to get started. Open the tracker, pick your workout split, and let our engine handle the overload pacing.
            </p>
          </div>
          <Link
            href="/tools/ppl-tracker"
            className="px-6 py-3.5 bg-black hover:bg-zinc-900 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-all btn-tactile shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            Launch Tracker App <ArrowRight className="w-4 h-4 text-[var(--accent-primary)]" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
