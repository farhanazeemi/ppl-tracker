import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Flame } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { OneRepMaxCalculator } from '../../../components/tools/OneRepMaxCalculator';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: '1RM Calculator (One-Rep Max & Training Percentages)',
  description:
    'Estimate your One-Rep Max (1RM) using Epley, Brzycki, Lombardi, and O’Conner formulas with a full 60% to 95% training percentage and rep-max breakdown table.',
  alternates: {
    canonical: '/tools/one-rep-max-calculator',
  },
  openGraph: {
    title: '1RM Calculator & Training Percentage Table | PPL Tracker',
    description:
      'Estimate your One-Rep Max (1RM) using Epley, Brzycki, Lombardi, and O’Conner formulas with a full 60% to 95% training percentage breakdown.',
    url: `${baseUrl}/tools/one-rep-max-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker 1RM Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1RM Calculator & Training Percentage Table | PPL Tracker',
    description:
      'Estimate your One-Rep Max (1RM) using Epley & Brzycki formulas with a 60%–95% rep-max table.',
    images: ['/og-image.png'],
  },
};

const ORM_FAQS: FaqItem[] = [
  {
    question: 'Which 1RM formula is more accurate: Epley or Brzycki?',
    answer:
      'Both equations demonstrate high predictive validity (r > 0.95) across compound barbell movements when tested between 2 and 10 repetitions (LeSuer et al., 1997). The Brzycki formula is slightly more conservative and accurate for low-rep heavy strength sets (2–5 reps), whereas the Epley formula performs exceptionally well for standard hypertrophy working sets (6–10 reps). At exactly 10 repetitions, Epley and Brzycki produce identical predictions.',
  },
  {
    question: 'Why does 1RM accuracy decline above 10 repetitions?',
    answer:
      'Sets exceeding 10–12 repetitions introduce significant peripheral metabolic fatigue, intracellular acidosis, and cardiovascular strain that limit performance before maximal high-threshold motor unit recruitment is exhausted. Consequently, a 15-rep set measures local muscular endurance alongside maximal strength, which can skew linear 1RM extrapolations by 5–8%.',
  },
  {
    question: 'What percentage of my 1RM should I use for muscle hypertrophy?',
    answer:
      'Contemporary meta-analyses by Schoenfeld et al. (2017) confirm that muscle hypertrophy occurs across a wide spectrum of loading zones (30% to 85%+ 1RM) provided sets are taken within 1–3 reps of muscular failure. However, the 70% to 85% 1RM bracket (corresponding to 6–12 repetitions) offers the highest practical efficiency: it generates maximal mechanical tension without the joint shearing of 90%+ loads or the systemic nausea of 20-rep failure sets.',
  },
  {
    question: 'How often should I re-calculate my estimated 1RM?',
    answer:
      'Instead of testing a true 1-rep max—which carries elevated central nervous system fatigue and injury risk—track your estimated 1RM automatically on every working set. Whenever you clear your target rep ceiling and add 2.5 kg (5 lbs) in the PPL Tracker workout tool, your rolling e1RM updates in real time.',
  },
];

export default function OneRepMaxCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: '1RM (One-Rep Max) & Training Percentage Calculator',
    slug: 'one-rep-max-calculator',
    description:
      'Estimate your One-Rep Max (1RM) using Epley, Brzycki, Lombardi, and O’Conner formulas with a full 60% to 95% training percentage breakdown.',
    faqItems: ORM_FAQS,
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14 outline-none">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">1RM Calculator</span>
        </nav>

        {/* Page Hero */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" aria-hidden="true" /> Strength & Hypertrophy Load Calibration
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            1RM & Training Percentage Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> To estimate your One-Rep Max (1RM) safely without testing a maximal single, multiply your lifted weight by <code>(1 + Reps / 30)</code> (Epley formula) or <code>36 / (37 − Reps)</code> (Brzycki formula) using a working set of 2 to 10 repetitions. Use <strong>75%–85% of your 1RM</strong> for 6–10 rep hypertrophy sets and <strong>85%–95% of your 1RM</strong> for heavy neural strength work.
          </p>
        </header>

        {/* Interactive Calculator */}
        <OneRepMaxCalculator />

        {/* Scientific Breakdown & Internal Links */}
        <section className="space-y-8 pt-8 border-t border-[var(--border-subtle)] max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            How to Program Progressive Overload Using 1RM Percentages
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-sans">
            Estimating your One-Rep Max from submaximal working sets eliminates the central nervous system fatigue and connective tissue strain of frequent 1RM testing. Once you know your baseline 1RM, lock in a working load corresponding to <strong>75%–82.5% of your 1RM</strong> and <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">log your sets, reps, and RPE with the PPL Tracker tool</Link>.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <Link href="/blog/double-progression-protocol-hypertrophy" className="text-[var(--accent-primary)] hover:underline">
              → Double Progression Hypertrophy Guide
            </Link>
            <Link href="/tools/rpe-calculator" className="text-[var(--accent-primary)] hover:underline">
              → Convert 1RM to RPE / RIR Working Loads
            </Link>
            <Link href="/tools/plate-calculator" className="text-[var(--accent-primary)] hover:underline">
              → Load Your Exact 1RM on the Barbell Plate Calculator
            </Link>
          </div>
        </section>

        <FaqAccordion items={ORM_FAQS} title="One-Rep Max & Percentage Training FAQ" />
      </main>

      <Footer />
    </div>
  );
}
