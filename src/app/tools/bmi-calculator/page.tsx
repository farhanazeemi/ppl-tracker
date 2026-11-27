import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { BmiCalculator } from '../../../components/BmiCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { BMI_FAQS } from '../../../components/tools/toolFaqs';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { getBmiCalculatorPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'BMI Calculator for Lifters — Fat vs Lean Mass',
  description:
    'Calculate Body Mass Index (BMI) in metric or imperial units with WHO tiers, muscular lifter caveats, and comparisons against US Navy BF% and FFMI.',
  alternates: {
    canonical: '/tools/bmi-calculator',
  },
  openGraph: {
    title: 'BMI Calculator for Lifters — Fat vs Lean Mass | PPL Tracker',
    description:
      'Calculate Body Mass Index (BMI) in metric or imperial units with WHO tiers, healthy weight ranges, and lean muscle vs body fat context for lifters.',
    url: `${baseUrl}/tools/bmi-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Tracker BMI Calculator for Lifters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator for Lifters — Fat vs Lean Mass | PPL Tracker',
    description:
      'Instant Body Mass Index calculator with metric & imperial units and muscle-to-fat guidance for lifters.',
    images: ['/og-image.png'],
  },
};

export default function BmiCalculatorPage() {
  const schema = getBmiCalculatorPageSchema(BMI_FAQS);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />

      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14 outline-none">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">BMI Calculator</span>
        </nav>

        {/* Page Editorial Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Free Body Composition &amp; Screening Utility
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            BMI Calculator for Lifters — Fat vs. Lean Mass
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> Body Mass Index (<code className="font-mono text-[var(--accent-primary)]">BMI = weight kg ÷ height m²</code>) screens total weight-to-height ratio against World Health Organization brackets (normal <strong>18.5–24.9</strong>). Because BMI cannot separate dense skeletal muscle from adipose fat, strength athletes should pair BMI with our{' '}
            <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              US Navy Body Fat Calculator
            </Link>{' '}
            and{' '}
            <Link href="/tools/ffmi-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              FFMI Calculator
            </Link>
            .
          </p>
        </header>

        {/* The BMI Calculator Engine */}
        <BmiCalculator />

        {/* Educational Comparison Tables: WHO BMI vs Navy BF% vs FFMI */}
        <section className="space-y-8 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              {'// Scientific Methodology'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              WHO BMI Categories vs. US Navy Body Fat % &amp; FFMI
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Standard BMI provides a quick population baseline, while circumference body fat percentage and Fat-Free Mass Index reveal whether elevated scale weight comes from lean muscle hypertrophy or excess adipose tissue.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="WHO BMI categories table"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">World Health Organization Adult BMI Classification</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">WHO Classification</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">BMI (kg/m²)</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Lifter Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Underweight</th>
                    <td className="py-2.5 px-4 font-mono">&lt; 18.5</td>
                    <td className="py-2.5 px-4">Insufficient lean mass &amp; energy reserve</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--accent-secondary)]">Normal Weight</th>
                    <td className="py-2.5 px-4 font-mono font-bold">18.5 – 24.9</td>
                    <td className="py-2.5 px-4">Baseline healthy range for most adults</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Overweight</th>
                    <td className="py-2.5 px-4 font-mono">25.0 – 29.9</td>
                    <td className="py-2.5 px-4">Common in muscular lifters with lean waists</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Obese Class I–III</th>
                    <td className="py-2.5 px-4 font-mono">30.0+</td>
                    <td className="py-2.5 px-4">Verify adipose share via waist &amp; Navy BF%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="Comparison of BMI, US Navy Body Fat, and FFMI"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">Comparison of BMI vs US Navy Body Fat vs FFMI for Lifters</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Metric</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Inputs Needed</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">What It Isolates</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">BMI</th>
                    <td className="py-2.5 px-4">Height + Weight</td>
                    <td className="py-2.5 px-4">Total body mass per m² (ignores muscle vs fat)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">US Navy BF%</th>
                    <td className="py-2.5 px-4">Height, Neck, Waist (+ Hip)</td>
                    <td className="py-2.5 px-4">Adipose percentage via waist-to-neck ratio</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Normalized FFMI</th>
                    <td className="py-2.5 px-4">Height, Weight + BF%</td>
                    <td className="py-2.5 px-4">Lean muscle mass adjusted to 1.80 m height</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-4xl">
            For example, a 180 cm lifter weighing 88 kg at 11% body fat scores a BMI of <strong>27.2 (&quot;Overweight&quot;)</strong> even while carrying low abdominal fat and a muscular FFMI of 24.2. Once you verify your body fat %,{' '}
            <Link href="/tools/tdee-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              calculate maintenance and deficit calories in the TDEE Calculator
            </Link>{' '}
            and{' '}
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              log progressive resistance workouts in PPL Tracker
            </Link>
            .
          </p>
        </section>

        <ToolCrossLinksSection
          heading="Body Composition Tools & Recomposition Research"
          subheading="Go beyond scale weight with circumference body fat tracking, FFMI muscularity diagnostics, and women's & recomp strength guides."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Reviewed WHO epidemiological BMI thresholds alongside lean-mass differentiation benchmarks for resistance athletes.',
          }}
          tools={[
            {
              href: '/tools/body-fat-calculator',
              title: 'US Navy Body Fat Calculator',
              badge: 'Adipose vs Muscle',
              description: 'Use simple neck, waist, and hip tape measurements to separate lean mass from adipose fat.',
              anchorText: 'Estimate BF% with US Navy Body Fat Calculator',
            },
            {
              href: '/tools/ffmi-calculator',
              title: 'FFMI Calculator (Male & Female)',
              badge: 'Natural Limit',
              description: 'Index your fat-free mass against height to track true muscular development beyond BMI.',
              anchorText: 'Calculate your Fat-Free Mass Index (FFMI)',
            },
            {
              href: '/tools/tdee-calculator',
              title: 'TDEE & Macro Split Calculator',
              badge: 'Energy Balance',
              description: 'Set daily calorie targets and 1.6–2.2 g/kg protein splits for cutting or lean bulking.',
              anchorText: 'Calculate TDEE & daily macro splits',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Training Log',
              description: 'Track progressive overload, weekly volume landmarks, and double progression ceilings.',
              anchorText: 'Launch the PPL Tracker workout tool',
            },
          ]}
          articles={[
            {
              href: '/blog/body-recomposition-science-action-plan',
              title: 'Body Recomposition Science: Build Muscle & Lose Fat',
              category: 'Fat Loss & Recomp',
              description: 'How resistance training and high protein intake transform body composition even when BMI holds steady.',
              anchorText: 'Read the body recomposition science action plan',
            },
            {
              href: '/blog/breaking-a-4-week-weight-loss-plateau-tracking-biomarkers-beyond-scale-weight',
              title: 'Breaking a 4-Week Weight Loss Plateau: Tracking Biomarkers Beyond Scale Weight',
              category: 'Fat Loss & Recomp',
              description: 'Use circumference measurements, gym performance, and trend weights when scale BMI stalls.',
              anchorText: 'Learn how to track biomarkers beyond scale weight',
            },
            {
              href: '/blog/female-hypertrophy-science-heavy-weights',
              title: 'Female Hypertrophy Science: Heavy Weights vs Light Reps',
              category: "Women's Strength",
              description: 'Why lifting challenging weights improves lean body mass and metabolic health without excess bulk.',
              anchorText: 'Read female hypertrophy science on heavy weights',
            },
            {
              href: '/blog/debunking-bulky-myth-4-day-toned-program',
              title: 'Debunking the Bulky Myth: 4-Day Toned Strength Program',
              category: "Women's Strength",
              description: 'A structured 4-day Upper/Lower hypertrophy routine built for lean physique recomposition.',
              anchorText: 'View the 4-day toned strength program',
            },
          ]}
        />

        <FaqAccordion items={BMI_FAQS} title="Athletic BMI & Muscle Mass FAQ" />
      </main>

      <Footer />
    </div>
  );
}
