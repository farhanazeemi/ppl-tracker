import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import FfmiCalculator from '@/components/tools/FfmiCalculator';
import { FaqAccordion, FaqItem } from '@/components/FaqAccordion';
import { getCalculatorToolPageSchema, BASE_URL } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'FFMI Calculator — Fat-Free Mass Index & Natural Muscle Limit',
  description:
    'Calculate your raw and height-normalized Fat-Free Mass Index (FFMI), Lean Body Mass, and natural muscular potential using the Kouri et al. (1995) equations.',
  alternates: {
    canonical: `${BASE_URL}/tools/ffmi-calculator`,
  },
  openGraph: {
    title: 'FFMI Calculator — Fat-Free Mass Index & Natural Muscle Limit | PPL Tracker',
    description:
      'Measure your Fat-Free Mass Index (FFMI), Lean Body Mass, and natural genetic muscular potential with height-normalized body composition equations.',
    url: `${BASE_URL}/tools/ffmi-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker FFMI Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FFMI Calculator — Fat-Free Mass Index & Natural Muscle Limit | PPL Tracker',
    description:
      'Calculate your raw and height-normalized Fat-Free Mass Index (FFMI) and Lean Body Mass.',
    images: ['/og-image.png'],
  },
};

const FFMI_FAQS: FaqItem[] = [
  {
    question: 'What is the difference between BMI and FFMI?',
    answer:
      'Body Mass Index (BMI) only divides total body weight by height squared, meaning it cannot distinguish between skeletal muscle mass and adipose fat tissue. A lean bodybuilder at 10% body fat is frequently misclassified as "overweight" or "obese" by BMI. Fat-Free Mass Index (FFMI) factors in body fat percentage so only fat-free lean tissue is indexed against your height.',
  },
  {
    question: 'Why does Normalized FFMI adjust for a height of 1.80 meters?',
    answer:
      'Because human volume scales cubically while FFMI divides by height squared, taller lifters naturally carry slightly higher raw FFMI scores for the same proportional muscularity. Kouri et al. (1995) introduced the normalization term [FFMI + 6.1 × (1.8 − height_m)] to standardize all athletes to a 1.80m (5 ft 11 in) reference frame.',
  },
  {
    question: 'Is 25.0 FFMI an absolute genetic ceiling for natural lifters?',
    answer:
      'In the landmark 1995 study by Kouri et al., non-steroid-using male athletes peaked near a normalized FFMI of 25.0 kg/m². While 25.0 remains an accurate benchmark for elite natural muscularity at lean body fat levels (8–12%), subsequent research on drug-tested powerlifters and heavy-frame athletes shows rare genetic outliers can reach 26–27 at higher body fat percentages.',
  },
  {
    question: 'How do I increase my FFMI without gaining excessive body fat?',
    answer:
      'To raise FFMI efficiently, pair a slight caloric surplus (5–10% above TDEE) and daily protein intake of 1.6–2.2 g/kg with progressive mechanical tension across 10–20 weekly hard sets per muscle group.',
  },
];

export default function FfmiCalculatorPage() {
  const jsonLd = getCalculatorToolPageSchema({
    name: 'FFMI & Natural Muscular Potential Calculator',
    description:
      'Calculate raw FFMI, height-normalized FFMI, Lean Body Mass, and natural muscular ceiling using Kouri et al. (1995) equations.',
    slug: 'ffmi-calculator',
    faqItems: FFMI_FAQS,
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 outline-none"
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold text-[var(--text-muted)]">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">
                Tools
              </Link>
            </li>
            <li>/</li>
            <li className="text-[var(--text-primary)]" aria-current="page">
              FFMI Calculator
            </li>
          </ol>
        </nav>

        {/* Hero Header */}
        <header className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 text-[var(--accent-primary)] text-xs font-extrabold uppercase tracking-wider mb-3">
            Body Composition &amp; Hypertrophy Benchmarks
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
            FFMI &amp; Natural Muscular Potential Calculator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            <strong>Direct Answer:</strong> Fat-Free Mass Index (FFMI) measures how much lean mass you carry relative to your height: <code className="text-[var(--accent-primary)] font-mono text-sm">FFMI = Lean Body Mass (kg) / Height (m)²</code>. An average untrained male scores <strong>18.5–19.5</strong>, an advanced natural lifter scores <strong>22.0–23.5</strong>, and the classic natural genetic ceiling sits near <strong>25.0 kg/m²</strong> (or <strong>21.0 kg/m²</strong> for women).
          </p>
        </header>

        {/* Interactive Calculator */}
        <section aria-label="FFMI Calculator Tool" className="mb-16">
          <FfmiCalculator />
        </section>

        {/* Scientific Methodology & Reference Standards */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mb-4">
              How Fat-Free Mass Index (FFMI) Is Calculated
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Developed by Dr. Elena Kouri and colleagues at Harvard Medical School (<em>Clinical Journal of Sport Medicine, 1995</em>), FFMI isolates skeletal muscle and fat-free tissue from adipose fat stores across three sequential equations:
            </p>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)] mb-6">
              <li className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">1. Lean Body Mass (LBM)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)]">
                  LBM (kg) = Total Weight (kg) × (1 − Body Fat % / 100)
                </code>
              </li>
              <li className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">2. Raw Fat-Free Mass Index</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)]">
                  Raw FFMI = LBM (kg) ÷ [Height (m)]²
                </code>
              </li>
              <li className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">3. Height-Normalized FFMI (1.80m Standard)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)]">
                  Normalized FFMI = Raw FFMI + 6.1 × (1.80 − Height in meters)
                </code>
              </li>
            </ul>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Once you know how much untapped lean mass room remains on your frame, pair your nutrition targets from our{' '}
              <Link href="/tools/tdee-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                TDEE &amp; Macro Split Calculator
              </Link>{' '}
              with structured progressive overload and{' '}
              <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                log your sets, reps, and RPE with the PPL Tracker tool
              </Link>
              .
            </p>
          </div>

          <div className="lg:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-4">
              Natural FFMI Classification Benchmarks
            </h2>
            <div className="table-responsive-region rounded-xl border border-[var(--border-subtle)]" tabIndex={0} role="region" aria-label="FFMI reference benchmarks">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">Normalized FFMI Reference Ranges for Men and Women</caption>
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    <th scope="col" className="py-2.5 px-3">Tier</th>
                    <th scope="col" className="py-2.5 px-3">Men (Norm)</th>
                    <th scope="col" className="py-2.5 px-3">Women (Norm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Below Average</td>
                    <td className="py-2.5 px-3">&lt; 18.0</td>
                    <td className="py-2.5 px-3">&lt; 14.0</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Average Recreational</td>
                    <td className="py-2.5 px-3">18.0 – 19.9</td>
                    <td className="py-2.5 px-3">14.0 – 15.9</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Intermediate Lifter</td>
                    <td className="py-2.5 px-3">20.0 – 21.9</td>
                    <td className="py-2.5 px-3">16.0 – 17.9</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[var(--accent-secondary)]">Advanced Muscular</td>
                    <td className="py-2.5 px-3 font-bold">22.0 – 23.5</td>
                    <td className="py-2.5 px-3 font-bold">18.0 – 19.5</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[var(--accent-primary)]">Elite Natural Peak</td>
                    <td className="py-2.5 px-3 font-bold">23.6 – 25.2</td>
                    <td className="py-2.5 px-3 font-bold">19.6 – 21.2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="max-w-4xl mx-auto">
          <FaqAccordion items={FFMI_FAQS} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
