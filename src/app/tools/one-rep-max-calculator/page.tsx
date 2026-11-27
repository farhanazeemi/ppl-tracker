import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Flame } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { OneRepMaxCalculator } from '../../../components/tools/OneRepMaxCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: '1RM Calculator — One Rep Max & % Rep Chart',
  description:
    'Estimate your One-Rep Max (1RM) using Epley, Brzycki, Lombardi & O’Conner equations with a 50%–100% rep-max chart for strength & hypertrophy.',
  alternates: {
    canonical: '/tools/one-rep-max-calculator',
  },
  openGraph: {
    title: '1RM Calculator — One Rep Max & % Rep Chart | PPL Tracker',
    description:
      'Estimate your One-Rep Max (1RM) using Epley, Brzycki, Lombardi, and O’Conner formulas with a full 50% to 100% rep-max percentage chart.',
    url: `${baseUrl}/tools/one-rep-max-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker 1RM Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1RM Calculator — One Rep Max & % Rep Chart | PPL Tracker',
    description:
      'Estimate your One-Rep Max (1RM) using Epley & Brzycki formulas with a 50%–100% rep-max chart.',
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
    pageName: '1RM Calculator — One Rep Max & % Rep Chart | PPL Tracker',
    breadcrumbName: '1RM Calculator',
    slug: 'one-rep-max-calculator',
    description:
      'Estimate your One-Rep Max (1RM) using Epley, Brzycki, Lombardi, and O’Conner formulas with a full 50% to 100% training percentage and rep-max chart.',
    faqItems: ORM_FAQS,
    featureList: [
      '4-equation comparison (Epley, Brzycki, Lombardi, O’Conner) plus consensus average',
      '60%–100% training percentage breakdown synced with Plate Loader & RPE tools',
      'Dual KG and LBS presets for Squat, Bench Press, and Deadlift',
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
            <Flame className="w-3.5 h-3.5" aria-hidden="true" /> Strength &amp; Hypertrophy Load Calibration
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            1RM Calculator — One-Rep Max &amp; % Rep Chart
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> To estimate your One-Rep Max (1RM) safely from a 2–10 rep set, multiply your lifted weight by <code>(1 + Reps / 30)</code> (Epley) or <code>36 / (37 − Reps)</code> (Brzycki). Program <strong>75%–85% of 1RM</strong> for 6–10 rep hypertrophy work and <strong>85%–95% of 1RM</strong> for heavy neural strength.
          </p>
        </header>

        {/* Interactive Calculator */}
        <OneRepMaxCalculator />

        {/* SSR 1RM Percentage-to-Reps Reference Table */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              1RM Percentage-to-Reps Chart (50% – 100% 1RM)
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Epley and Brzycki equations converge within 1–2% across 2 to 10 reps (and match identically at 10RM = 75% 1RM). Above 10 reps, local muscular endurance introduces variance—keep reference test sets at 10 reps or fewer. Once you establish your working percentage,{' '}
              <Link href="/tools/plate-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                load your barbell plates per side
              </Link>{' '}
              or{' '}
              <Link href="/tools/rpe-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                autoregulate daily readiness with RPE
              </Link>
              .
            </p>
          </div>

          <div
            className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
            tabIndex={0}
            role="region"
            aria-label="1RM percentage to reps reference chart"
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
              <caption className="visually-hidden">1RM Percentage to Estimated Repetitions Reference Chart</caption>
              <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">% of 1RM</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Approx. Rep-Max</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Primary Training Adaptation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">100%</th>
                  <td className="py-2.5 px-4 font-mono">1 RM</td>
                  <td className="py-2.5 px-4">Maximal single / competition peak</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">95%</th>
                  <td className="py-2.5 px-4 font-mono">2 RM</td>
                  <td className="py-2.5 px-4">Peak neural force &amp; heavy singles/doubles</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">90%</th>
                  <td className="py-2.5 px-4 font-mono">3 – 4 RM</td>
                  <td className="py-2.5 px-4">Heavy compound strength overload</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--accent-secondary)]">85%</th>
                  <td className="py-2.5 px-4 font-mono font-bold">5 – 6 RM</td>
                  <td className="py-2.5 px-4">Myofibrillar strength-hypertrophy crossover</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--accent-primary)]">80%</th>
                  <td className="py-2.5 px-4 font-mono font-bold">7 – 8 RM</td>
                  <td className="py-2.5 px-4">Primary mechanical-tension hypertrophy bracket</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--accent-primary)]">75%</th>
                  <td className="py-2.5 px-4 font-mono font-bold">10 RM</td>
                  <td className="py-2.5 px-4">Standard 10RM hypertrophy accumulation (Epley = Brzycki)</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">65% – 70%</th>
                  <td className="py-2.5 px-4 font-mono">12 – 15 RM</td>
                  <td className="py-2.5 px-4">High-volume hypertrophy &amp; accessory isolation</td>
                </tr>
                <tr>
                  <th scope="row" className="py-2.5 px-4 font-mono font-bold text-[var(--text-primary)]">50% – 60%</th>
                  <td className="py-2.5 px-4 font-mono">16 – 25+ RM</td>
                  <td className="py-2.5 px-4">Dynamic speed work, warm-up ramps &amp; deload weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Load Calculators & Squat Periodization Guides"
          subheading="Convert your estimated 1RM into daily RPE working sets, warm-up pyramids, and long-term periodization blocks."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Verified LeSuer et al. (1997) 1RM equation predictive bounds and Schoenfeld loading-zone ranges.',
          }}
          tools={[
            {
              href: '/tools/rpe-calculator',
              title: 'RPE / RIR Load Estimator',
              badge: 'Autoregulation',
              description: 'Adjust 1RM percentages dynamically for daily readiness using RPE 6.5–10 and RIR.',
              anchorText: 'Convert 1RM to RPE / RIR working loads',
            },
            {
              href: '/tools/warmup-calculator',
              title: 'Barbell Warm-Up Calculator',
              badge: 'Neural Ramp',
              description: 'Build non-fatiguing ramp sets leading up to your heavy percentage top sets.',
              anchorText: 'Generate barbell warm-up ramp sets',
            },
            {
              href: '/tools/plate-calculator',
              title: 'Barbell Plate Loader',
              badge: 'Sleeve Math',
              description: 'Visualize the exact plates per side needed for any 60%–100% 1RM target weight.',
              anchorText: 'Load target 1RM weights on the Plate Calculator',
            },
            {
              href: '/tools/strength-score-calculator',
              title: 'DOTS & IPF GL Calculator',
              badge: 'Standards',
              description: 'Sum your Squat, Bench, and Deadlift 1RMs to check Novice-to-Elite DOTS rank.',
              anchorText: 'Score your 3-lift total with DOTS & IPF GL',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Overload Log',
              description: 'Track rolling e1RM and clear double-progression ceilings every training week.',
              anchorText: 'Log sets and progressive overload in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/high-bar-front-squat-linear-vs-dup',
              title: 'High-Bar & Front Squat: Linear vs DUP Periodization',
              category: 'Legs (Squat)',
              description: 'Structure weekly 1RM percentage progressions using linear vs undulating loading.',
              anchorText: 'Compare linear vs DUP squat periodization',
            },
            {
              href: '/blog/high-bar-front-squat-rpe-vbt-guide',
              title: 'High-Bar & Front Squat: RPE & VBT Autoregulation Guide',
              category: 'Legs (Squat)',
              description: 'Combine percentage targets with velocity and RIR feedback when daily readiness shifts.',
              anchorText: 'Read high-bar squat RPE & velocity autoregulation guide',
            },
            {
              href: '/blog/low-bar-squat-deload-week-cns-recovery',
              title: 'Low-Bar Squat Deload Weeks & CNS Fatigue Recovery Plan',
              category: 'Legs (Squat)',
              description: 'When and how to drop %1RM intensity during recovery deloads without losing strength.',
              anchorText: 'Plan deload weeks after heavy 1RM blocks',
            },
            {
              href: '/blog/low-bar-squat-linear-vs-dup-periodization',
              title: 'Low-Bar Squat Programming: Linear vs DUP Periodization',
              category: 'Legs (Squat)',
              description: 'Wave heavy 85%–92% strength days with 72%–78% volume work across the training week.',
              anchorText: 'Read low-bar squat linear vs DUP programming',
            },
          ]}
        />

        <FaqAccordion items={ORM_FAQS} title="One-Rep Max & Percentage Training FAQ" />
      </main>

      <Footer />
    </div>
  );
}
