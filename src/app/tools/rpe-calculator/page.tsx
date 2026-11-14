import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Timer } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { RpeCalculator } from '../../../components/tools/RpeCalculator';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'RPE & RIR Calculator (Autoregulation Working Weight Estimator)',
  description:
    'Convert Rate of Perceived Exertion (RPE 6.5–10) and Reps in Reserve (0–3.5 RIR) into recommended working weights and progressive overload targets.',
  alternates: {
    canonical: '/tools/rpe-calculator',
  },
  openGraph: {
    title: 'RPE / RIR Load Estimator & Chart | PPL Tracker',
    description:
      'Convert Rate of Perceived Exertion and Reps in Reserve into recommended working weights for progressive overload.',
    url: `${baseUrl}/tools/rpe-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker RPE Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RPE / RIR Load Estimator & Chart | PPL Tracker',
    description:
      'Convert RPE and Reps in Reserve (RIR) into exact working weights and 1RM percentages.',
    images: ['/og-image.png'],
  },
};

const RPE_FAQS: FaqItem[] = [
  {
    question: 'What is the difference between RPE and RIR in resistance training?',
    answer:
      'Rate of Perceived Exertion (RPE) and Reps in Reserve (RIR) are inverse expressions of proximity to concentric muscular failure (Zourdos et al., 2016). On the 1–10 resistance RPE scale, RPE 10 means 0 Reps in Reserve (true failure), RPE 9 means 1 Rep in Reserve (1 RIR), RPE 8 means 2 Reps in Reserve (2 RIR), and RPE 7 means 3 Reps in Reserve (3 RIR).',
  },
  {
    question: 'Should I train to RPE 10 (0 RIR) on every set for muscle growth?',
    answer:
      'No. Research by Helms et al. (2018) and Robinson et al. (2024) demonstrates that terminating compound barbell sets (squats, deadlifts, bench press) at RPE 8.0–9.0 (1–2 RIR) captures virtually all high-threshold motor unit recruitment while avoiding the exponential spike in neuromuscular fatigue and muscle damage caused by true RPE 10 failure. Reserve RPE 10 for safe, final-set cable or machine isolations.',
  },
  {
    question: 'How do I use RPE to autoregulate bad sleep or high-stress days?',
    answer:
      'Daily strength fluctuates by 5–10% depending on sleep quality, glycogen status, and systemic recovery. By prescribing a target RPE (e.g., 3 sets of 8 reps @ RPE 8) rather than a rigid fixed weight, you automatically adjust barbell load to match your physiological readiness on that specific day.',
  },
];

export default function RpeCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'RPE / RIR Load Estimator',
    slug: 'rpe-calculator',
    description:
      'Convert Rate of Perceived Exertion (RPE) and Reps in Reserve (RIR) into recommended working weights for progressive overload.',
    faqItems: RPE_FAQS,
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
          <span className="text-[var(--text-primary)] font-bold">RPE / RIR Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" aria-hidden="true" /> Autoregulation & Proximity to Failure
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            RPE / RIR Working Load Estimator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> In resistance training, <code>RIR = 10 − RPE</code>. Each Rep in Reserve (RIR) reduces working load by approximately <strong>2.5% to 3.2% of your 1RM</strong>. For optimal hypertrophy-to-fatigue ratio on compound lifts, target <strong>RPE 8.0 to 9.0 (1 to 2 RIR)</strong>.
          </p>
        </header>

        <RpeCalculator />

        <FaqAccordion items={RPE_FAQS} title="RPE & Reps in Reserve (RIR) Autoregulation FAQ" />
      </main>

      <Footer />
    </div>
  );
}
