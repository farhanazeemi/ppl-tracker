import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Trophy } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { StrengthScoreCalculator } from '../../../components/tools/StrengthScoreCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { STRENGTH_FAQS } from '../../../components/tools/toolFaqs';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'DOTS & IPF GL Calculator — Powerlifting Score',
  description:
    'Compare pound-for-pound strength across body weights using official DOTS, IPF GL Points, and Wilks powerlifting formulas with Novice-to-Elite strength tiers.',
  alternates: {
    canonical: '/tools/strength-score-calculator',
  },
  openGraph: {
    title: 'DOTS & IPF GL Calculator — Powerlifting Score | PPL Tracker',
    description:
      'Calculate your DOTS, Wilks, and IPF GL strength score across Squat, Bench, and Deadlift with visual classification tiers.',
    url: `${baseUrl}/tools/strength-score-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker DOTS & IPF GL Strength Score Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DOTS & IPF GL Calculator — Powerlifting Score | PPL Tracker',
    description:
      'Calculate DOTS, IPF GL, and Wilks points with powerlifting classification tiers and lift ratios.',
    images: ['/og-image.png'],
  },
};

export default function StrengthScoreCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'DOTS & IPF GL Strength Score Calculator',
    pageName: 'DOTS & IPF GL Calculator — Powerlifting Score | PPL Tracker',
    breadcrumbName: 'Strength Score Calculator',
    slug: 'strength-score-calculator',
    description:
      'Compare pound-for-pound powerlifting strength across body weights using official DOTS, IPF GL Points, and Wilks formulas.',
    faqItems: STRENGTH_FAQS,
    featureList: [
      'DOTS (Tim Konertz 2019), IPF GoodLift (2020), and classic Wilks (1994) powerlifting scores',
      'Novice to International competitor classification tiers and lift ratio distribution',
      'Individual Squat/Bench/Deadlift or direct 3-lift total input modes in KG and LBS',
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
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">Tools</Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-semibold">Strength Score Calculator</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/25">
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Powerlifting &amp; Strength Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            DOTS, IPF GL &amp; Wilks Powerlifting Strength Score Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            <strong>Direct Answer:</strong> A powerlifting strength score normalizes your 3-lift total (Squat + Bench Press + Deadlift) against body weight so lighter and heavier lifters can compare relative strength fairly. Reaching <strong>275+ DOTS</strong> marks intermediate strength, <strong>350+ DOTS</strong> marks advanced regional status, and <strong>425+ DOTS</strong> marks elite national competitiveness.
          </p>
        </header>

        {/* Interactive Tool Component */}
        <StrengthScoreCalculator />

        {/* SSR Formula & Benchmark Tables */}
        <section className="space-y-8 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              DOTS vs. IPF GL Points vs. Wilks Comparison
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Federations use different normalization curves to rank best-lifter awards across weight classes. Pair your 3-lift total with our{' '}
              <Link href="/tools/one-rep-max-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                1RM &amp; Training Percentage Calculator
              </Link>{' '}
              and{' '}
              <Link href="/tools/rpe-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                RPE / RIR Load Estimator
              </Link>{' '}
              to project meet openers cleanly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="DOTS vs IPF GL vs Wilks comparison"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">Comparison of DOTS, IPF GL Points, and Wilks Powerlifting Formulas</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Formula</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Federation Use</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">Mathematical Design</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">DOTS (2019)</th>
                    <td className="py-3 px-4">USAPL, WRPF, Raw Meets</td>
                    <td className="py-3 px-4">4th-degree polynomial reducing weight-class extremes</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">IPF GL (2020)</th>
                    <td className="py-3 px-4">IPF Classic &amp; Equipped</td>
                    <td className="py-3 px-4">Exponential curve scaled per 100 points</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-bold text-[var(--text-primary)]">Wilks (1994)</th>
                    <td className="py-3 px-4">Legacy / Historical PRs</td>
                    <td className="py-3 px-4">5th-degree polynomial baseline for older meet records</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="DOTS strength classification benchmarks"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">DOTS Powerlifting Strength Classification Tiers</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Tier</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">DOTS Range</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Competitive Percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Novice</th>
                    <td className="py-2.5 px-4 font-mono">&lt; 275</td>
                    <td className="py-2.5 px-4">Top 85% (Early linear progress)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Intermediate</th>
                    <td className="py-2.5 px-4 font-mono">275 – 349</td>
                    <td className="py-2.5 px-4">Top 45% (Consistent barbell progression)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--accent-secondary)]">Advanced</th>
                    <td className="py-2.5 px-4 font-mono font-bold">350 – 424</td>
                    <td className="py-2.5 px-4">Top 15% (Regional meet competitive)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--accent-primary)]">Elite</th>
                    <td className="py-2.5 px-4 font-mono font-bold">425 – 499</td>
                    <td className="py-2.5 px-4">Top 3% (National raw standard)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--accent-primary)]">International</th>
                    <td className="py-2.5 px-4 font-mono font-bold">500+</td>
                    <td className="py-2.5 px-4">Top 0.5% (World-class standard)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Strength Calculators & Squat / Deadlift Guides"
          subheading="Optimize meet peaking, bar loading, autoregulation, and lean mass development behind your 3-lift total."
          reviewer={{
            name: 'Elena Rostova, CSCS',
            role: 'Head of High-Performance Strength & Conditioning',
            href: '/author/elena-rostova',
            note: 'Verified Konertz (2019) DOTS coefficients, IPF GoodLift curves, and classic Wilks normalization formulas.',
          }}
          tools={[
            {
              href: '/tools/one-rep-max-calculator',
              title: '1RM & Training % Calculator',
              badge: 'Max Estimation',
              description: 'Estimate Squat, Bench, and Deadlift 1RMs from submaximal working sets without peaking fatigue.',
              anchorText: 'Estimate your 1RM from working sets',
            },
            {
              href: '/tools/rpe-calculator',
              title: 'RPE / RIR Load Estimator',
              badge: 'Autoregulation',
              description: 'Adjust daily meet-prep weights cleanly using RPE 6.5–10 and Reps in Reserve.',
              anchorText: 'Autoregulate squat & deadlift loads via RPE',
            },
            {
              href: '/tools/plate-calculator',
              title: 'Barbell Plate Loader',
              badge: 'Bar Loading',
              description: 'Visualize calibrated KG and LB plates per sleeve for heavy top singles and warmups.',
              anchorText: 'Load calibrated plates on the Barbell Plate Calculator',
            },
            {
              href: '/tools/ffmi-calculator',
              title: 'FFMI Calculator',
              badge: 'Muscle Ceiling',
              description: 'Check whether adding lean mass in your weight class can boost your absolute and DOTS strength.',
              anchorText: 'Check your FFMI lean-mass potential',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Overload Log',
              description: 'Record double-progression sets, rest timers, and bar loads every training week.',
              anchorText: 'Log progressive overload sets in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/low-bar-squat-rpe-velocity-autoregulation',
              title: 'Low-Bar Squat Autoregulation: RPE & Velocity Guide',
              category: 'Legs (Squat)',
              description: 'Use bar speed and RPE/RIR precision to manage fatigue across heavy squat blocks.',
              anchorText: 'Read the low-bar squat RPE & velocity guide',
            },
            {
              href: '/blog/high-bar-front-squat-linear-vs-dup',
              title: 'High-Bar & Front Squat: Linear vs DUP Periodization',
              category: 'Legs (Squat)',
              description: 'Compare linear loading vs daily undulating periodization for pushing squat strength scores higher.',
              anchorText: 'Compare linear vs DUP squat periodization',
            },
            {
              href: '/blog/low-bar-squat-deload-week-cns-recovery',
              title: 'Low-Bar Squat Deload Weeks & CNS Fatigue Recovery Plan',
              category: 'Legs (Squat)',
              description: 'Structure volume and intensity tapers before maxing out or competing.',
              anchorText: 'Plan deload weeks for CNS recovery',
            },
            {
              href: '/blog/romanian-deadlift-hamstring-glute-guide',
              title: 'Romanian Deadlift Biomechanics for Hamstring & Glutes',
              category: 'Legs (Squat)',
              description: 'Strengthen posterior-chain lockout mechanics to push your deadlift and 3-lift DOTS total.',
              anchorText: 'Read Romanian deadlift biomechanics for posterior-chain strength',
            },
          ]}
        />

        <FaqAccordion items={STRENGTH_FAQS} title="Strength Score & Powerlifting FAQ" />
      </main>

      <Footer />
    </div>
  );
}
