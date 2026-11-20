import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Trophy } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { StrengthScoreCalculator } from '../../../components/tools/StrengthScoreCalculator';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Powerlifting Strength Score Calculator (DOTS, Wilks, IPF GL Points)',
  description:
    'Compare pound-for-pound strength across bodyweights using official DOTS, Wilks, and IPF GL Points powerlifting formulas from openGym and USAPL standards.',
  alternates: {
    canonical: '/tools/strength-score-calculator',
  },
  openGraph: {
    title: 'Strength Score & Powerlifting Calculator (DOTS / Wilks) | PPL Tracker',
    description:
      'Calculate your DOTS, Wilks, and IPF GL strength score across Squat, Bench, and Deadlift with visual classification tiers.',
    url: `${baseUrl}/tools/strength-score-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Strength Score Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strength Score & Powerlifting Calculator | PPL Tracker',
    description:
      'Calculate DOTS, Wilks, and IPF GL points with strength classification tiers and lift ratios.',
    images: ['/og-image.png'],
  },
};

const STRENGTH_FAQS = [
  {
    question: 'What is the difference between DOTS, Wilks, and IPF GL Points?',
    answer:
      'All three formulas normalize strength across different body weights to identify the best pound-for-pound lifter. The Wilks formula (1994) was historically used by the International Powerlifting Federation (IPF) but favored very light and very heavy lifters. In 2019, Tim Konertz formulated DOTS, which eliminated these polynomial distortions and is now the gold standard in USAPL, WRPF, and open-source lifting engines like openGym. In 2020, the IPF introduced IPF GL points, an exponential curve calibrated for classic raw and equipped divisions.',
  },
  {
    question: 'What DOTS score is considered strong for drug-free natural lifters?',
    answer:
      'A DOTS score of 300 represents a solid intermediate foundation. Reaching 375 to 400 points places a lifter in the advanced regional competitor tier (top 15%). Surpassing 450 DOTS represents elite national-level raw strength, and 500+ points represents world-class international competitor status.',
  },
  {
    question: 'How do I use this score to progress my training volume?',
    answer:
      'Track your strength score progression across training microcycles. When planning your weekly workout splits and sets, you can log your progressive overload with PPL Tracker to systematically increase barbell loads, track RPE, and ensure double progression milestones are met.',
  },
];

export default function StrengthScoreCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Powerlifting Strength Score Calculator (DOTS & Wilks)',
    slug: 'strength-score-calculator',
    description:
      'Compare pound-for-pound strength across body weights using official DOTS, Wilks, and IPF GL points.',
    faqItems: STRENGTH_FAQS,
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 outline-none">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[var(--text-primary)] font-semibold">Strength Score Calculator</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#B7FF4A]/10 text-[#B7FF4A] border border-[#B7FF4A]/25">
            <Trophy className="w-3.5 h-3.5" />
            <span>Powerlifting & Strength Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Powerlifting Strength Score Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Calculate your official <strong>DOTS</strong>, <strong>Wilks</strong>, and <strong>IPF GL Points</strong> based on your body weight and 3-lift competition total. Benchmark your pound-for-pound strength standards against regional, national, and world-class powerlifters.
          </p>
        </header>

        {/* Interactive Tool Component */}
        <StrengthScoreCalculator />
      </main>

      <Footer />
    </div>
  );
}
