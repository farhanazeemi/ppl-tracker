import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Dumbbell } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { PlateLoaderCalculator } from '../../../components/tools/PlateLoaderCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Barbell Plate Calculator & Gym Plate Loader',
  description:
    'Visual barbell plate loader showing exact 45 lb / 20 kg plates per side for Olympic, Women’s, EZ-curl, and Trap bars with warmup ladder & reverse mode.',
  alternates: {
    canonical: '/tools/plate-calculator',
  },
  openGraph: {
    title: 'Barbell Plate Calculator & Gym Plate Loader | PPL Tracker',
    description:
      'Visual breakdown of exact plates needed per side of a standard barbell for any target weight in kilograms or pounds.',
    url: `${baseUrl}/tools/plate-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Barbell Plate Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barbell Plate Calculator & Gym Plate Loader | PPL Tracker',
    description:
      'Visual breakdown of exact plates needed per side of a standard barbell in KG and LBS.',
    images: ['/og-image.png'],
  },
};

const PLATE_FAQS: FaqItem[] = [
  {
    question: 'How much does a standard Olympic barbell weigh?',
    answer:
      'A standard men’s Olympic weightlifting or powerlifting barbell weighs 20 kilograms (44.09 lbs, universally rounded to 45 lbs in commercial Imperial gyms). A standard women’s Olympic barbell weighs 15 kilograms (33.07 lbs, or 35 lbs in Imperial gyms) with a slightly narrower 25mm grip shaft.',
  },
  {
    question: 'How do you calculate barbell weight per side?',
    answer:
      'Subtract the empty barbell weight (e.g., 20 kg or 45 lbs) and any competition collar weight from your target total load, then divide the remaining number by 2. For example, to load 100 kg on a 20 kg Olympic barbell: (100 − 20) ÷ 2 = 40 kg per side, which equals two 20 kg blue plates on each sleeve.',
  },
  {
    question: 'Do barbell collars count toward total lifted weight?',
    answer:
      'Standard plastic spring clips or nylon lock-jaw collars weigh less than 0.25 kg per pair and are ignored in training logs. However, calibrated IPF/IWF competition metal collars weigh exactly 2.5 kg each (5 kg / 11 lbs per pair) and must be included in your total barbell calculation.',
  },
];

export default function PlateCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Barbell Plate Calculator & Gym Plate Loader',
    pageName: 'Barbell Plate Calculator & Gym Plate Loader | PPL Tracker',
    breadcrumbName: 'Barbell Plate Calculator',
    slug: 'plate-calculator',
    description:
      'Visual breakdown of exact plates needed per side of a standard barbell for any target weight in kilograms or pounds, plus Reverse Counter mode.',
    faqItems: PLATE_FAQS,
    featureList: [
      'Visual calibrated plate sleeve graphic in KG and LBS',
      'Supports 20kg/45lb Olympic, 15kg/35lb Women’s, EZ-curl, and Trap bars',
      'Customizable plate inventory toggles and Reverse Plate Counter mode',
    ],
    reviewedBy: {
      name: 'Elena Rostova, CSCS',
      slug: 'elena-rostova',
      jobTitle: 'Head of High-Performance Strength & Conditioning',
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14 outline-none">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">Barbell Plate Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5" aria-hidden="true" /> Olympic Sleeve Loading &amp; Warmup Ladder
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Barbell Plate Calculator &amp; Gym Plate Loader
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> To calculate the exact plates needed per side of a barbell, subtract the bar weight (<strong>20 kg / 45 lbs</strong> for a standard Olympic bar) from your target total load and divide by <strong>2</strong>. Load the largest available plates nearest the inner collar first and finish with fractional micro-plates on the outer sleeve.
          </p>
        </header>

        <PlateLoaderCalculator />

        {/* Standard LB & KG Quick-Reference Chart */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Standard 45 lb &amp; 20 kg Barbell Loading Quick-Reference Chart
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Common commercial gym milestone weights for a standard 45 lb (20 kg) Olympic barbell without competition collars. Pair these loads with our{' '}
              <Link href="/tools/warmup-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                Barbell Warm-Up Calculator
              </Link>{' '}
              and{' '}
              <Link href="/tools/one-rep-max-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                1RM &amp; Training Percentage Calculator
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="Standard Imperial 45 lb barbell loading chart"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                <caption className="visually-hidden">Imperial 45 lb Barbell Plate Loading Milestones</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">Total (lbs)</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Weight / Side</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Plates Per Side</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">135 lbs</th><td className="py-2.5 px-4 font-mono">45 lbs</td><td className="py-2.5 px-4">1 × 45 lb</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">185 lbs</th><td className="py-2.5 px-4 font-mono">70 lbs</td><td className="py-2.5 px-4">1 × 45 lb + 1 × 25 lb</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">225 lbs</th><td className="py-2.5 px-4 font-mono">90 lbs</td><td className="py-2.5 px-4">2 × 45 lb</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">275 lbs</th><td className="py-2.5 px-4 font-mono">115 lbs</td><td className="py-2.5 px-4">2 × 45 lb + 1 × 25 lb</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">315 lbs</th><td className="py-2.5 px-4 font-mono">135 lbs</td><td className="py-2.5 px-4">3 × 45 lb</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">405 lbs</th><td className="py-2.5 px-4 font-mono">180 lbs</td><td className="py-2.5 px-4">4 × 45 lb</td></tr>
                </tbody>
              </table>
            </div>

            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="Standard Metric 20 kg barbell loading chart"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                <caption className="visually-hidden">Metric 20 kg Barbell Plate Loading Milestones</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-secondary)]">Total (kg)</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Weight / Side</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Plates Per Side (20 kg max)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">60 kg</th><td className="py-2.5 px-4 font-mono">20 kg</td><td className="py-2.5 px-4">1 × 20 kg</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">80 kg</th><td className="py-2.5 px-4 font-mono">30 kg</td><td className="py-2.5 px-4">1 × 20 kg + 1 × 10 kg</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">100 kg</th><td className="py-2.5 px-4 font-mono">40 kg</td><td className="py-2.5 px-4">2 × 20 kg</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">120 kg</th><td className="py-2.5 px-4 font-mono">50 kg</td><td className="py-2.5 px-4">2 × 20 kg + 1 × 10 kg</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">140 kg</th><td className="py-2.5 px-4 font-mono">60 kg</td><td className="py-2.5 px-4">3 × 20 kg</td></tr>
                  <tr><th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">180 kg</th><td className="py-2.5 px-4 font-mono">80 kg</td><td className="py-2.5 px-4">4 × 20 kg (or 3 × 25 kg + 5 kg)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Barbell Tools & Heavy Compound Technique Guides"
          subheading="Combine fast sleeve loading with ramp warm-ups, 1RM targets, and heavy squat execution guides."
          reviewer={{
            name: 'Elena Rostova, CSCS',
            role: 'Head of High-Performance Strength & Conditioning',
            href: '/author/elena-rostova',
            note: 'Verified IPF/IWF color-coded plate breakdowns, specialty bar baselines, and collar adjustments.',
          }}
          tools={[
            {
              href: '/tools/warmup-calculator',
              title: 'Barbell Warm-Up Calculator',
              badge: 'Ramp Sets',
              description: 'Auto-generate warm-up jump sets and per-side plate setups before your working weight.',
              anchorText: 'Build warm-up ramps with per-side plates',
            },
            {
              href: '/tools/one-rep-max-calculator',
              title: '1RM & Percentage Calculator',
              badge: 'Target Loads',
              description: 'Compute exact 60%–100% 1RM weights before calculating barbell sleeve plates.',
              anchorText: 'Compute target loads in the 1RM Calculator',
            },
            {
              href: '/tools/strength-score-calculator',
              title: 'DOTS & IPF GL Calculator',
              badge: 'Powerlifting',
              description: 'Convert your loaded Squat, Bench, and Deadlift PRs into normalized DOTS scores.',
              anchorText: 'Check DOTS & IPF GL strength score',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Integrated Math',
              description: 'Log every barbell set with built-in plate calculation and automatic rest timers.',
              anchorText: 'Track barbell sets in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/low-bar-squat-form-fixes-maximal-loads',
              title: 'Low-Bar Squat Form Fixes Under 90%+ Maximal 1RM Loads',
              category: 'Legs (Squat)',
              description: 'Eliminate bar drift and hip rise when loading heavy multi-plate squat attempts.',
              anchorText: 'Read low-bar squat form fixes under 90%+ loads',
            },
            {
              href: '/blog/high-bar-front-squat-linear-vs-dup',
              title: 'High-Bar & Front Squat: Linear vs DUP Periodization',
              category: 'Legs (Squat)',
              description: 'Plan weekly plate increments systematically using linear or undulating progressions.',
              anchorText: 'Compare linear vs DUP squat loading progressions',
            },
            {
              href: '/blog/high-bar-front-squat-pin-work-sticking-points',
              title: 'High-Bar & Front Squat: Pin Work for Sticking Points',
              category: 'Legs (Squat)',
              description: 'Use targeted isometric pin squats to break through mid-range squat plateaus.',
              anchorText: 'Read squat pin work for sticking points',
            },
          ]}
        />

        <FaqAccordion items={PLATE_FAQS} title="Barbell & Olympic Plate Loading FAQ" />
      </main>

      <Footer />
    </div>
  );
}
