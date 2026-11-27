import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Activity } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { TdeeCalculator } from '../../../components/tools/TdeeCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'TDEE & Macro Calculator — Cutting & Bulk',
  description:
    'Calculate BMR and TDEE using Mifflin-St Jeor or Katch-McArdle lean-mass equations with adaptive 14-day calorie calibration and protein macros.',
  alternates: {
    canonical: '/tools/tdee-calculator',
  },
  openGraph: {
    title: 'TDEE & Macro Calculator — Cutting & Bulk | PPL Tracker',
    description:
      'Calculate BMR and Total Daily Energy Expenditure (Mifflin-St Jeor & Katch-McArdle) with customizable macro presets for cutting, recomp, and lean bulking.',
    url: `${baseUrl}/tools/tdee-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker TDEE & Macro Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDEE & Macro Calculator — Cutting & Bulk | PPL Tracker',
    description:
      'Calculate BMR, TDEE, and daily protein/carb/fat macros for cutting, recomposition, and lean bulking.',
    images: ['/og-image.png'],
  },
};

const TDEE_FAQS: FaqItem[] = [
  {
    question: 'What is the difference between the Mifflin-St Jeor and Katch-McArdle equations?',
    answer:
      'The Mifflin-St Jeor equation calculates Basal Metabolic Rate (BMR) using total body weight, height, age, and biological sex, making it the clinical gold standard when body fat percentage is unknown. However, skeletal muscle is significantly more metabolically active than adipose tissue. If you know your approximate body fat percentage, the Katch-McArdle formula (`BMR = 370 + 21.6 × Lean Body Mass in kg`) prevents underestimating caloric needs in lean, muscular lifters.',
  },
  {
    question: 'How much protein do I actually need for muscle hypertrophy and fat loss?',
    answer:
      'Meta-analyses by Morton et al. (2018) and the International Society of Sports Nutrition (ISSN) establish that 1.6 to 2.2 grams of protein per kilogram of body weight per day (0.73–1.0 g/lb) maximizes muscle protein synthesis during maintenance or lean bulking. During a caloric deficit (cutting), increasing protein to 2.2–2.6 g/kg of lean mass helps preserve fat-free mass and improves satiety.',
  },
  {
    question: 'How large should my calorie surplus be for a lean bulk?',
    answer:
      'Because skeletal muscle protein accretion is rate-limited physiologically, excessive "dirty bulk" surpluses (+500–1,000 kcal/day) predominantly increase visceral and subcutaneous fat stores (Helms et al., 2019). A controlled 10% to 15% caloric surplus (+250 to +350 kcal above TDEE) provides ample energy for myofibrillar synthesis and progressive overload while keeping adipose accumulation minimal.',
  },
  {
    question: 'Should I eat different calories on rest days vs. PPL workout days?',
    answer:
      'Muscle protein synthesis remains elevated for 24 to 48 hours following a resistance training session (MacDougall et al., 1995). Therefore, slashing calories drastically on rest days can blunt recovery. Most lifters achieve superior consistency by maintaining a steady 7-day average calorie and protein intake.',
  },
];

export default function TdeeCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'TDEE & Macro Split Calculator',
    pageName: 'TDEE & Macro Calculator — Cutting & Bulk | PPL Tracker',
    breadcrumbName: 'TDEE & Macro Calculator',
    slug: 'tdee-calculator',
    description:
      'Calculate BMR and Total Daily Energy Expenditure (Mifflin-St Jeor & Katch-McArdle) with adaptive 14-day calibration and protein/carb/fat macro splits.',
    faqItems: TDEE_FAQS,
    featureList: [
      'Mifflin-St Jeor and lean-mass Katch-McArdle BMR equations',
      'Cutting (-20% / -15%), Body Recomp (0%), and Lean Bulk (+10% / +15%) calorie presets',
      'ISSN 1.6–2.2 g/kg protein verification and per-meal macro table',
    ],
    reviewedBy: {
      name: 'Dr. Marcus Vance, Ph.D.',
      slug: 'dr-marcus-vance',
      jobTitle: 'Lead Biomechanics Researcher & Exercise Physiologist',
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
          <span className="text-[var(--text-primary)] font-bold">TDEE &amp; Macro Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" /> Sports Nutrition &amp; Energy Balance
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            TDEE &amp; Macro Split Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> Your Total Daily Energy Expenditure (TDEE) equals your Basal Metabolic Rate (BMR) multiplied by your daily activity factor (1.2–1.9). Use a <strong>10%–15% calorie surplus</strong> for clean hypertrophy, a <strong>15%–20% deficit</strong> for fat loss, and <strong>1.6–2.2 g of protein per kg</strong>—entering your body fat % from our{' '}
            <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              US Navy Body Fat Calculator
            </Link>{' '}
            to unlock lean-mass Katch-McArdle precision.
          </p>
        </header>

        <TdeeCalculator />

        {/* Mifflin-St Jeor vs Katch-McArdle + 14-Day Adaptive Calibration */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[var(--border-subtle)]">
          <div className="lg:col-span-7 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Mifflin-St Jeor vs. Katch-McArdle &amp; 14-Day Adaptive Calibration
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every static TDEE formula provides a starting estimate—individual NEAT (non-exercise activity thermogenesis), metabolic adaptation, and daily step counts vary by ±10–15%. To match adaptive expenditure tools:
            </p>
            <ol className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)] list-decimal pl-5 leading-relaxed">
              <li>
                <strong className="text-[var(--text-primary)]">Supply Body Fat % When Known:</strong> Estimate BF% in the{' '}
                <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                  US Navy Body Fat Calculator
                </Link>{' '}
                so Katch-McArdle weights lean skeletal tissue properly instead of total scale mass.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Track 14-Day Rolling Scale Averages:</strong> Weigh yourself daily under consistent morning conditions and compare weekly averages over 14 days rather than reacting to single-day water spikes.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Adjust by ±125–150 kcal:</strong> If fat loss stalls below 0.3% body weight/week during a cut (or lean gain stalls below 0.25%/week during a bulk), nudge intake by 125–150 kcal and pair with{' '}
                <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                  progressive overload tracking in PPL Tracker
                </Link>
                .
              </li>
            </ol>
          </div>

          <div className="lg:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-display font-black uppercase text-[var(--text-primary)]">
              Equation &amp; Body Comp Selection Guide
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">Mifflin-St Jeor (Default)</strong>
                Best when body fat % is unknown. Uses sex, age, height, and weight.
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--accent-secondary)] block mb-1">Katch-McArdle (Lean Mass Mode)</strong>
                Best for lean or muscular lifters with an{' '}
                <Link href="/tools/ffmi-calculator" className="text-[var(--accent-primary)] font-bold underline">
                  FFMI score
                </Link>{' '}
                above average—scales BMR directly to Lean Body Mass.
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                New to body composition benchmarks?{' '}
                <Link href="/tools/bmi-calculator" className="text-[var(--accent-primary)] font-bold underline">
                  Compare athlete BMI vs. body fat ranges
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Nutrition Calculators & Body Recomposition Guides"
          subheading="Combine accurate daily calorie and protein targets with lean-mass tracking and progressive training."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Reviewed Mifflin-St Jeor / Katch-McArdle energy formulas and Morton et al. (2018) / ISSN protein thresholds.',
          }}
          tools={[
            {
              href: '/tools/body-fat-calculator',
              title: 'US Navy Body Fat Calculator',
              badge: 'Katch-McArdle Input',
              description: 'Estimate body fat % via neck, waist, and hip tape measurements to enable lean-mass BMR.',
              anchorText: 'Estimate BF% to unlock Katch-McArdle BMR',
            },
            {
              href: '/tools/ffmi-calculator',
              title: 'FFMI Calculator',
              badge: 'Lean Mass',
              description: 'Track whether your caloric surplus is adding lean tissue or excess adipose mass.',
              anchorText: 'Track Lean Body Mass & FFMI progress',
            },
            {
              href: '/tools/bmi-calculator',
              title: 'BMI Calculator for Lifters',
              badge: 'Baseline Screen',
              description: 'Check healthy weight target brackets and why muscular athletes outgrow basic BMI.',
              anchorText: 'Check BMI vs muscular weight context',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Overload Log',
              description: 'Ensure surplus calories partition into skeletal muscle with progressive set/rep logging.',
              anchorText: 'Log sets and progressive overload in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/body-recomposition-science-action-plan',
              title: 'Body Recomposition Science: Build Muscle & Lose Fat',
              category: 'Fat Loss & Recomp',
              description: 'Calorie cycling, maintenance partitioning, and protein timing for recomposition phases.',
              anchorText: 'Read the body recomposition science action plan',
            },
            {
              href: '/blog/optimal-protein-intake-clinical-meta-analysis',
              title: 'Optimal Protein Intake Beyond 2.2g/kg: Clinical Data',
              category: 'Sports Nutrition',
              description: 'Clinical evidence comparing 1.6 g/kg, 2.2 g/kg, and higher protein targets in resistance athletes.',
              anchorText: 'Read the optimal protein intake clinical meta-analysis',
            },
            {
              href: '/blog/mini-cut-vs-prolonged-deficit-muscle',
              title: 'Mini-Cut vs Prolonged Deficit for Muscle Preservation',
              category: 'Fat Loss & Recomp',
              description: 'Choose between a 4-week -20% mini-cut and a slower -15% fat-loss block without losing strength.',
              anchorText: 'Compare mini-cuts vs prolonged calorie deficits',
            },
            {
              href: '/blog/sustainable-strength-habits-women-over-40',
              title: 'Sustainable Strength Training Habits for Women Over 40',
              category: "Women's Strength",
              description: 'Align protein intake, recovery calories, and resistance frequency for lifelong strength.',
              anchorText: 'Read sustainable strength & nutrition habits for women over 40',
            },
          ]}
        />

        <FaqAccordion items={TDEE_FAQS} title="TDEE, BMR & Hypertrophy Macros FAQ" />
      </main>

      <Footer />
    </div>
  );
}
