import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Activity } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { TdeeCalculator } from '../../../components/tools/TdeeCalculator';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'TDEE & Macro Split Calculator (Mifflin-St Jeor & Katch-McArdle)',
  description:
    'Calculate your BMR, Total Daily Energy Expenditure (TDEE), and hypertrophy macronutrient splits for cutting, body recomposition, and lean bulking.',
  alternates: {
    canonical: '/tools/tdee-calculator',
  },
  openGraph: {
    title: 'TDEE & Macro Split Calculator | PPL Tracker',
    description:
      'Calculate BMR and Total Daily Energy Expenditure (Mifflin-St Jeor & Katch-McArdle) with customizable macro presets for cutting, maintenance, and lean bulking.',
    url: `${baseUrl}/tools/tdee-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker TDEE & Macro Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDEE & Macro Split Calculator | PPL Tracker',
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
    slug: 'tdee-calculator',
    description:
      'Calculate BMR and Total Daily Energy Expenditure (Mifflin-St Jeor & Katch-McArdle) with customizable macro presets for cutting, maintenance, and lean bulking.',
    faqItems: TDEE_FAQS,
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
          <span className="text-[var(--text-primary)] font-bold">TDEE & Macro Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" /> Sports Nutrition & Energy Balance
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            TDEE & Macro Split Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> Your Total Daily Energy Expenditure (TDEE) is your Basal Metabolic Rate (BMR) multiplied by your weekly activity factor (1.2 to 1.9). To build lean muscle with minimal fat gain, eat a <strong>10%–15% calorie surplus</strong> above TDEE; to lose fat while preserving strength, target a <strong>15%–20% calorie deficit</strong> while consuming <strong>1.6–2.2g of protein per kg of body weight</strong>.
          </p>
        </header>

        <TdeeCalculator />

        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)] max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Aligning Nutritional Energy with Progressive Overload
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            Caloric intake dictates changes in scale weight, but progressive mechanical tension dictates whether those calories are partitioned into skeletal muscle or adipose tissue. Whether you are executing a lean bulk or a body recomposition phase, <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">use our free workout tracker</Link> to verify that your working weights and repetitions are progressing week over week.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <Link href="/tools/ffmi-calculator" className="text-[var(--accent-primary)] hover:underline">
              → Calculate Your Fat-Free Mass Index (FFMI)
            </Link>
            <Link href="/tools/bmi-calculator" className="text-[var(--accent-primary)] hover:underline">
              → Screen Athlete BMI & Healthy Weight Range
            </Link>
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] hover:underline">
              → Launch 6-Day PPL Workout Tracker
            </Link>
          </div>
        </section>

        <FaqAccordion items={TDEE_FAQS} title="TDEE, BMR & Hypertrophy Macros FAQ" />
      </main>

      <Footer />
    </div>
  );
}
