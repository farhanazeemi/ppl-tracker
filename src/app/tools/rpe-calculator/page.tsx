import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Timer } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { RpeCalculator } from '../../../components/tools/RpeCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'RPE & RIR Calculator — %1RM Autoregulation',
  description:
    'Convert Rate of Perceived Exertion (RPE 6.5–10) and Reps in Reserve (0–3.5 RIR) into exact working weights, %1RM targets, and overload goals.',
  alternates: {
    canonical: '/tools/rpe-calculator',
  },
  openGraph: {
    title: 'RPE & RIR Calculator — %1RM Autoregulation | PPL Tracker',
    description:
      'Convert Rate of Perceived Exertion and Reps in Reserve into recommended working weights and %1RM targets for progressive overload.',
    url: `${baseUrl}/tools/rpe-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker RPE & RIR Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RPE & RIR Calculator — %1RM Autoregulation | PPL Tracker',
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
    pageName: 'RPE & RIR Calculator — %1RM Autoregulation | PPL Tracker',
    breadcrumbName: 'RPE / RIR Calculator',
    slug: 'rpe-calculator',
    description:
      'Convert Rate of Perceived Exertion (RPE) and Reps in Reserve (RIR) into recommended working weights and %1RM targets for progressive overload.',
    faqItems: RPE_FAQS,
    featureList: [
      'RPE 6.5–10.0 to RIR 0–3.5 working load conversion',
      'Daily readiness e1RM estimation and +2.5% next-session overload target',
      '1–12 rep RPE-to-%1RM matrix synced with 1RM & Barbell Plate Calculators',
    ],
    reviewedBy: {
      name: 'Liam Sterling',
      slug: 'liam-sterling',
      jobTitle: 'Natural Bodybuilding Coach & Hypertrophy Specialist',
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
          <span className="text-[var(--text-primary)] font-bold">RPE / RIR Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" aria-hidden="true" /> Autoregulation &amp; Proximity to Failure
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            RPE &amp; RIR Working Load Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> In resistance training, <code>RIR = 10 − RPE</code>. Each Rep in Reserve (RIR) reduces working load by approximately <strong>2.5% to 3.2% of your 1RM</strong>. For optimal hypertrophy-to-fatigue ratio on compound lifts, target <strong>RPE 8.0 to 9.0 (1 to 2 RIR)</strong>.
          </p>
        </header>

        <RpeCalculator />

        {/* SSR Zourdos / Helms RPE-to-RIR %1RM Reference Table */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              RPE-to-RIR &amp; %1RM Autoregulation Reference Table
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Derived from the resistance-training RIR-based RPE framework (Zourdos et al., 2016; Helms et al., 2018), each cell shows the estimated percentage of 1RM corresponding to a given rep count and exertion rating. Combine with our{' '}
              <Link href="/tools/one-rep-max-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                1RM Calculator
              </Link>{' '}
              and{' '}
              <Link href="/tools/strength-score-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                DOTS &amp; IPF GL Strength Calculator
              </Link>
              .
            </p>
          </div>

          <div
            className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
            tabIndex={0}
            role="region"
            aria-label="RPE and RIR percentage of 1RM reference table"
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
              <caption className="visually-hidden">Percentage of 1RM across RPE 7.0 to 10.0 and 1 to 10 Repetitions</caption>
              <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">RPE (RIR)</th>
                  <th scope="col" className="py-3 px-3 font-bold text-center text-[var(--text-primary)]">1 Rep</th>
                  <th scope="col" className="py-3 px-3 font-bold text-center text-[var(--text-primary)]">3 Reps</th>
                  <th scope="col" className="py-3 px-3 font-bold text-center text-[var(--text-primary)]">5 Reps</th>
                  <th scope="col" className="py-3 px-3 font-bold text-center text-[var(--accent-primary)]">8 Reps</th>
                  <th scope="col" className="py-3 px-3 font-bold text-center text-[var(--accent-secondary)]">10 Reps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[var(--text-secondary)]">
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-bold text-[var(--text-primary)]">RPE 10 (0 RIR)</th>
                  <td className="py-2.5 px-3 text-center">100.0%</td>
                  <td className="py-2.5 px-3 text-center">92.2%</td>
                  <td className="py-2.5 px-3 text-center">86.3%</td>
                  <td className="py-2.5 px-3 text-center">78.6%</td>
                  <td className="py-2.5 px-3 text-center">73.9%</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-bold text-[var(--text-primary)]">RPE 9.0 (1 RIR)</th>
                  <td className="py-2.5 px-3 text-center">95.5%</td>
                  <td className="py-2.5 px-3 text-center">89.2%</td>
                  <td className="py-2.5 px-3 text-center">83.7%</td>
                  <td className="py-2.5 px-3 text-center">76.2%</td>
                  <td className="py-2.5 px-3 text-center">70.7%</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-bold text-[var(--accent-primary)]">RPE 8.0 (2 RIR)</th>
                  <td className="py-2.5 px-3 text-center">92.2%</td>
                  <td className="py-2.5 px-3 text-center">86.3%</td>
                  <td className="py-2.5 px-3 text-center">81.1%</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[var(--accent-primary)]">73.9%</td>
                  <td className="py-2.5 px-3 text-center font-bold text-[var(--accent-secondary)]">68.0%</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-bold text-[var(--text-primary)]">RPE 7.0 (3 RIR)</th>
                  <td className="py-2.5 px-3 text-center">89.2%</td>
                  <td className="py-2.5 px-3 text-center">83.7%</td>
                  <td className="py-2.5 px-3 text-center">78.6%</td>
                  <td className="py-2.5 px-3 text-center">70.7%</td>
                  <td className="py-2.5 px-3 text-center">64.9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Autoregulation Tools & Proximity-to-Failure Guides"
          subheading="Dial in working intensity, barbell warm-ups, and recovery adjustments across every training mesocycle."
          reviewer={{
            name: 'Liam Sterling',
            role: 'Natural Bodybuilding Coach & Hypertrophy Specialist',
            href: '/author/liam-sterling',
            note: 'Reviewed RIR-based RPE %1RM progression tables and fatigue-management thresholds.',
          }}
          tools={[
            {
              href: '/tools/one-rep-max-calculator',
              title: '1RM & Percentage Calculator',
              badge: 'Multi-Formula',
              description: 'Estimate your baseline 1RM across Epley, Brzycki, Lombardi, and O’Conner equations.',
              anchorText: 'Estimate baseline 1RM across 4 formulas',
            },
            {
              href: '/tools/strength-score-calculator',
              title: 'DOTS & IPF GL Calculator',
              badge: 'Powerlifting',
              description: 'Compare your Squat, Bench, and Deadlift readiness totals against federation standards.',
              anchorText: 'Calculate DOTS & IPF GL strength score',
            },
            {
              href: '/tools/warmup-calculator',
              title: 'Barbell Warm-Up Calculator',
              badge: 'Ramp Sets',
              description: 'Use your final 85% warm-up speed to gauge daily RPE readiness before your top set.',
              anchorText: 'Build neural warm-up ramp sets',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Log RPE & Sets',
              description: 'Record completed sets, reps, and RPE targets with built-in double progression tracking.',
              anchorText: 'Log sets and RPE in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/high-bar-front-squat-rpe-vbt-guide',
              title: 'High-Bar & Front Squat: RPE & VBT Autoregulation Guide',
              category: 'Legs (Squat)',
              description: 'Pair bar speed and RIR precision to keep heavy squat sets productive without burnout.',
              anchorText: 'Read high-bar squat RPE & velocity autoregulation guide',
            },
            {
              href: '/blog/low-bar-squat-rpe-velocity-autoregulation',
              title: 'Low-Bar Squat Autoregulation: RPE & Velocity Guide',
              category: 'Legs (Squat)',
              description: 'Adjust daily squat load automatically when sleep, stress, or lower-back fatigue fluctuates.',
              anchorText: 'Read low-bar squat RPE autoregulation guide',
            },
            {
              href: '/blog/upper-chest-proximity-to-failure-rir',
              title: 'Upper Chest Training: Proximity to Failure & RIR Guide',
              category: 'Push (Chest)',
              description: 'Compare 0–1 RIR vs 2–3 RIR on compound presses vs isolated chest flyes.',
              anchorText: 'Explore proximity to failure & RIR hypertrophy evidence',
            },
            {
              href: '/blog/autoregulating-training-high-stress-weeks',
              title: 'Autoregulating Training Stress During High-Work Weeks',
              category: 'Gym Mindset',
              description: 'Use RPE caps and volume adjustments to keep progressing during busy travel or work sprints.',
              anchorText: 'Learn how to autoregulate training during high-stress weeks',
            },
          ]}
        />

        <FaqAccordion items={RPE_FAQS} title="RPE & Reps in Reserve (RIR) Autoregulation FAQ" />
      </main>

      <Footer />
    </div>
  );
}
