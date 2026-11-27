import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LayoutGrid,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { FITNESS_TOOLS, UPCOMING_TOOLS } from '../../config/tools';
import { getToolsIndexSchema } from '../../lib/schema';
import { ToolsDirectoryList } from './ToolsDirectoryList';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Free Fitness & Strength Calculators Hub',
  description:
    'Free workout tracker, US Navy body fat calculator, FFMI calculator, BMI for lifters, TDEE macros, 1RM, RPE, DOTS strength score, and exercise swaps.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Fitness & Strength Calculators Hub | PPL Tracker',
    description:
      'Free workout tracker, US Navy body fat calculator, FFMI calculator, BMI for lifters, TDEE macros, 1RM, RPE, DOTS strength score, and exercise swaps.',
    url: `${baseUrl}/tools`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Tracker Free Fitness Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fitness & Strength Calculators Hub | PPL Tracker',
    description:
      'Free 6-day PPL workout tracker, US Navy body fat, FFMI, TDEE, 1RM, RPE, and DOTS calculators.',
    images: ['/og-image.png'],
  },
};

export default function ToolsDirectoryPage() {
  const directorySchema = getToolsIndexSchema(FITNESS_TOOLS);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(directorySchema) }}
      />

      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12 outline-none">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">Tools Directory</span>
        </nav>

        {/* Directory Editorial Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold tracking-wider uppercase">
            <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" /> Evidence-Based Athlete Utilities
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Fitness Tools &amp; Calculators
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            Eliminate guesswork from your resistance training and body composition management. Every tool in our suite—from the{' '}
            <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              US Navy Body Fat Calculator
            </Link>{' '}
            and{' '}
            <Link href="/tools/ffmi-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              FFMI Calculator
            </Link>{' '}
            to our{' '}
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              6-Day PPL Workout Tracker
            </Link>
            —is free, privacy-conscious, local-first, and built for lifters.
          </p>
        </div>

        {/* Interactive Tools Directory with Filter Tabs & Tool Cards */}
        <ToolsDirectoryList tools={FITNESS_TOOLS} upcoming={UPCOMING_TOOLS} />

        {/* SSR Recommended Calculator Workflows Hub */}
        <section aria-label="Recommended calculator workflows" className="space-y-6 pt-10 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              {'// Connected Workflows'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Recommended Calculator Workflows
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
              Follow these connected stacks so biometrics and working weights flow cleanly from one calculator to the next.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent-secondary)]">
                  Workflow 01 • Body Composition &amp; Macros
                </span>
                <h3 className="text-xl font-display font-black uppercase text-[var(--text-primary)]">
                  Body Composition Stack
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Screen baseline weight-for-height, estimate adipose fat percentage via tape landmarks, quantify lean muscle development, and set daily protein and energy targets.
                </p>
              </div>
              <ol className="space-y-2 text-xs sm:text-sm font-mono">
                <li>
                  1.{' '}
                  <Link href="/tools/bmi-calculator" className="text-[var(--accent-primary)] font-bold hover:underline">
                    BMI Calculator for Lifters (Screen Height-Weight Baseline)
                  </Link>
                </li>
                <li>
                  2.{' '}
                  <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold hover:underline">
                    US Navy Body Fat Calculator (Neck, Waist &amp; Hip Method)
                  </Link>
                </li>
                <li>
                  3.{' '}
                  <Link href="/tools/ffmi-calculator" className="text-[var(--accent-primary)] font-bold hover:underline">
                    FFMI Calculator (Male &amp; Female Lean Mass Limits)
                  </Link>
                </li>
                <li>
                  4.{' '}
                  <Link href="/tools/tdee-calculator" className="text-[var(--accent-primary)] font-bold hover:underline">
                    TDEE &amp; Macro Split Calculator (Katch-McArdle Nutrition)
                  </Link>
                </li>
              </ol>
            </article>

            <article className="p-6 sm:p-7 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                  Workflow 02 • Strength, Overload &amp; Programming
                </span>
                <h3 className="text-xl font-display font-black uppercase text-[var(--text-primary)]">
                  Powerlifting &amp; Hypertrophy Stack
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Calibrate working loads, generate non-fatiguing barbell warm-ups, swap busy gym equipment cleanly, and track double progression every week.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <Link href="/tools/ppl-tracker" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>PPL Workout Tracker</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/one-rep-max-calculator" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>1RM &amp; % Rep Chart</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/rpe-calculator" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>RPE / RIR Autoregulation</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/strength-score-calculator" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>DOTS &amp; IPF GL Score</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/workout-substitution-finder" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>Workout Substitution Finder</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/warmup-calculator" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>Barbell Warm-Up Planner</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/plate-calculator" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>Barbell Plate Loader</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
                <Link href="/tools/workout-importer" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] font-bold hover:underline">
                  <span>Workout CSV Importer</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <p className="text-[var(--text-secondary)]">
              All equations and training guides are reviewed by our{' '}
              <Link href="/author/dr-marcus-vance" className="text-[var(--accent-primary)] font-bold hover:underline">
                Dr. Marcus Vance, Ph.D.
              </Link>
              ,{' '}
              <Link href="/author/elena-rostova" className="text-[var(--accent-primary)] font-bold hover:underline">
                Elena Rostova, CSCS
              </Link>
              , and{' '}
              <Link href="/author/liam-sterling" className="text-[var(--accent-primary)] font-bold hover:underline">
                Liam Sterling
              </Link>{' '}
              editorial board.
            </p>
            <Link
              href="/blog"
              className="font-mono font-bold text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
            >
              Browse Hypertrophy Science Journal →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
