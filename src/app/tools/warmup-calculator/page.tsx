import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Flame } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { WarmupCalculator } from '../../../components/tools/WarmupCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { WARMUP_FAQS } from '../../../components/tools/toolFaqs';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Barbell Warm-Up Calculator — Ramp Set Planner',
  description:
    'Generate optimal barbell warm-up set ladders and exact plate loads per side that prime your nervous system and lubricate joints without accumulating fatigue.',
  alternates: {
    canonical: '/tools/warmup-calculator',
  },
  openGraph: {
    title: 'Barbell Warm-Up Calculator — Ramp Set Planner | PPL Tracker',
    description:
      'Generate evidence-based warm-up ramp sets with exact plate loading per side and inverse rep progressions.',
    url: `${baseUrl}/tools/warmup-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker Warm-Up Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barbell Warm-Up Calculator — Ramp Set Planner | PPL Tracker',
    description:
      'Generate neural warm-up ladders and plate breakdowns for compound and isolation lifts.',
    images: ['/og-image.png'],
  },
};

export default function WarmupCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Barbell Warm-Up Set Calculator',
    pageName: 'Barbell Warm-Up Calculator — Ramp Set Planner | PPL Tracker',
    breadcrumbName: 'Warm-Up Calculator',
    slug: 'warmup-calculator',
    description:
      'Generate optimal barbell warm-up set progressions and exact plate loadings that prime the nervous system without fatigue.',
    faqItems: WARMUP_FAQS,
    featureList: [
      'Inverse rep-ramp progression ladders snapped to 2.5 kg or 5 lb gym plates',
      'Per-side plate color breakdown for Olympic, Women’s, and Trap barbells',
      'Compound vs isolation warm-up volume calibration without lactate buildup',
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
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-semibold">Warm-Up Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/25">
            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Neural Ramping Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Barbell Warm-Up Set Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            <strong>Direct Answer:</strong> An effective barbell warm-up uses an <strong>inverse rep-ramp</strong>—starting with the empty bar for 8–10 reps and progressively increasing load (<strong>50% → 70% → 85%</strong>) while dropping reps to 5, 3, and 1–2 before your first working set. This excites high-threshold motor units without pre-fatiguing target muscles.
          </p>
        </header>

        <WarmupCalculator />

        {/* SSR 4-Step Potentiation Pyramid Table */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              4-Step Neural Potentiation Warm-Up Pyramid
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Use this standardized progression template when ramping up to heavy squats, bench presses, overhead presses, or deadlifts. Pair each rung with our{' '}
              <Link href="/tools/plate-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                Barbell Plate Calculator
              </Link>{' '}
              and verify your top-set percentages using the{' '}
              <Link href="/tools/one-rep-max-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                1RM &amp; Training Percentage Calculator
              </Link>
              .
            </p>
          </div>

          <div
            className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
            tabIndex={0}
            role="region"
            aria-label="4-step barbell warm-up pyramid"
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <caption className="visually-hidden">Four-Step Barbell Warm-Up Ramp Protocol</caption>
              <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Warm-Up Stage</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">% of Working Load</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Reps</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Rest</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Physiological Goal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">Set 1 (Bar Only)</th>
                  <td className="py-3 px-4 font-mono">Empty Bar</td>
                  <td className="py-3 px-4 font-mono">8 – 10 reps</td>
                  <td className="py-3 px-4 font-mono">45 – 60 s</td>
                  <td className="py-3 px-4">Synovial joint lubrication &amp; groove bar path</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">Set 2 (Light Ramp)</th>
                  <td className="py-3 px-4 font-mono">~50%</td>
                  <td className="py-3 px-4 font-mono">5 reps</td>
                  <td className="py-3 px-4 font-mono">60 s</td>
                  <td className="py-3 px-4">Tissue elasticity &amp; scapular/hip bracing check</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">Set 3 (Moderate Ramp)</th>
                  <td className="py-3 px-4 font-mono">~70%</td>
                  <td className="py-3 px-4 font-mono">3 reps</td>
                  <td className="py-3 px-4 font-mono">90 s</td>
                  <td className="py-3 px-4">Speed-strength bar velocity without fatigue</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3 px-4 font-bold text-[var(--accent-secondary)]">Set 4 (Acclimatization)</th>
                  <td className="py-3 px-4 font-mono font-bold">~85% – 90%</td>
                  <td className="py-3 px-4 font-mono font-bold">1 – 2 reps</td>
                  <td className="py-3 px-4 font-mono">120 s</td>
                  <td className="py-3 px-4">Post-activation potentiation (PAP) for top sets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Barbell Loading & Warm-Up Guides"
          subheading="Pair non-fatiguing ramp sets with calibrated plate math, autoregulated RPE targets, and joint-prep prehab routines."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Reviewed post-activation potentiation (PAP) ramp parameters and non-fatiguing warm-up volume separation.',
          }}
          tools={[
            {
              href: '/tools/plate-calculator',
              title: 'Barbell Plate Loader',
              badge: 'Sleeve Math',
              description: 'Visualize exact per-side KG and LB plate changes across every warm-up jump.',
              anchorText: 'Load barbell plates per side',
            },
            {
              href: '/tools/one-rep-max-calculator',
              title: '1RM & Percentage Calculator',
              badge: 'Load Targets',
              description: 'Calculate your working set targets from 60% to 95% 1RM before ramping up.',
              anchorText: 'Compute 1RM & working set weights',
            },
            {
              href: '/tools/rpe-calculator',
              title: 'RPE / RIR Load Estimator',
              badge: 'Readiness',
              description: 'Adjust top-set loads based on how your final 85% warm-up set moved.',
              anchorText: 'Calibrate readiness in the RPE Calculator',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Training Log',
              description: 'Tag warm-up sets separately so working hypertrophy tonnage stays accurate.',
              anchorText: 'Track working sets in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/low-bar-squat-warmup-top-set-backoff',
              title: 'Low-Bar Squat Warm-Up Pyramid & Top-Set Architecture',
              category: 'Legs (Squat)',
              description: 'Exact jump increments and back-off set programming for heavy squat days.',
              anchorText: 'Read low-bar squat warm-up pyramid guide',
            },
            {
              href: '/blog/high-bar-front-squat-mastery-warm-up-pyramid-top-set-back-off-architecture',
              title: 'High-Bar & Front Squat Mastery: Warm-Up Pyramid & Top-Set Back-Off Architecture',
              category: 'Legs (Squat)',
              description: 'How to pace upright squat warm-up jumps before 80%–90% working top sets.',
              anchorText: 'Explore high-bar squat warm-up pyramid programming',
            },
            {
              href: '/blog/10-minute-rotator-cuff-scapular-prehab',
              title: '10-Minute Rotator Cuff & Scapular Prehab Warm-Up Plan',
              category: 'Prehab & Mobility',
              description: 'Targeted band and scapular activation drills before heavy bench press and overhead work.',
              anchorText: 'Follow the 10-minute rotator cuff prehab routine',
            },
            {
              href: '/blog/romanian-deadlift-hamstring-glute-guide',
              title: 'Romanian Deadlift Biomechanics for Hamstring & Glutes',
              category: 'Legs (Squat)',
              description: 'Warm up hip-hinge patterning and hamstring lengthening safely before heavy posterior-chain sets.',
              anchorText: 'Read Romanian deadlift warm-up & hinge biomechanics',
            },
          ]}
        />

        <FaqAccordion items={WARMUP_FAQS} title="Warm-Up Science & Ramping FAQ" />
      </main>

      <Footer />
    </div>
  );
}
