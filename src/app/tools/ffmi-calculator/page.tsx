import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { safeJsonLd } from '@/lib/safeJsonLd';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import FfmiCalculator from '@/components/tools/FfmiCalculator';
import { ToolCrossLinksSection } from '@/components/tools/ToolCrossLinksSection';
import { FFMI_FAQS } from '@/components/tools/toolFaqs';
import { FaqAccordion } from '@/components/FaqAccordion';
import { getCalculatorToolPageSchema, BASE_URL } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'FFMI Calculator — Male & Female Natural Limit',
  description:
    'Calculate Raw and Normalized FFMI, Fat-Free Mass (FFM), and Fat Mass Index (FMI) for men and women. Compare Kouri (1995) and frame-size natural limits.',
  alternates: {
    canonical: `${BASE_URL}/tools/ffmi-calculator`,
  },
  openGraph: {
    title: 'FFMI Calculator — Male & Female Natural Limit | PPL Tracker',
    description:
      'Measure your Fat-Free Mass Index (FFMI), Fat-Free Mass (FFM), Fat Mass Index (FMI), and natural muscular potential for men and women.',
    url: `${BASE_URL}/tools/ffmi-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker FFMI Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FFMI Calculator — Male & Female Natural Limit | PPL Tracker',
    description:
      'Calculate raw & height-normalized FFMI, FFM, and FMI with male and female natural benchmarks.',
    images: ['/og-image.png'],
  },
};

export default function FfmiCalculatorPage() {
  const jsonLd = getCalculatorToolPageSchema({
    name: 'FFMI Calculator for Men & Women',
    pageName: 'FFMI Calculator — Male & Female Natural Limit | PPL Tracker',
    breadcrumbName: 'FFMI Calculator',
    description:
      'Calculate Raw FFMI, height-normalized FFMI, Fat-Free Mass (FFM), and Fat Mass Index (FMI) for men and women using Kouri et al. (1995) equations.',
    slug: 'ffmi-calculator',
    faqItems: FFMI_FAQS,
    featureList: [
      'Raw FFMI, 1.80m Height-Normalized FFMI, Fat-Free Mass (FFM), and Fat Mass Index (FMI)',
      'Dedicated Male (18–25+) and Female (13.5–21+) natural muscularity benchmark charts',
      'Kouri et al. (1995) natural limit comparison vs. frame-size anthropometry caveats',
      'Body-composition weight projections synced with US Navy Body Fat & TDEE Calculators',
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 space-y-14 outline-none"
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-[var(--text-muted)]">
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
            <li className="text-[var(--text-primary)] font-semibold" aria-current="page">
              FFMI Calculator
            </li>
          </ol>
        </nav>

        {/* Hero Header */}
        <header className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 text-[var(--accent-primary)] text-xs font-mono font-extrabold uppercase tracking-wider">
            Body Composition &amp; Hypertrophy Benchmarks
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-[var(--text-primary)] leading-tight uppercase">
            FFMI Calculator for Men &amp; Women — Fat-Free Mass Index
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            <strong>Direct Answer:</strong> Fat-Free Mass Index (FFMI) measures how much lean, non-fat mass (FFM) you carry relative to height: <code className="text-[var(--accent-primary)] font-mono text-sm">FFMI = FFM (kg) ÷ Height (m)²</code>, while Fat Mass Index (<code className="text-[var(--accent-primary)] font-mono text-sm">FMI = Fat Mass ÷ Height²</code>) tracks adiposity separately. Untrained men average <strong>18.0–19.9</strong> (women <strong>14.0–15.9</strong>), advanced natural lifters reach <strong>22.0–23.5</strong> (women <strong>18.0–19.5</strong>), and Kouri et al. (1995) observed a classic lean natural male limit near <strong>25.0 kg/m²</strong>. Don&apos;t know your body fat %?{' '}
            <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              Estimate your body fat percentage with the US Navy Body Fat Calculator
            </Link>
            .
          </p>
        </header>

        {/* Interactive Calculator */}
        <section aria-label="FFMI Calculator Tool">
          <FfmiCalculator />
        </section>

        {/* Section 1: Equations, FFM, FMI & Worked Male Example */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[var(--border-subtle)]">
          <div className="lg:col-span-7 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              FFMI, FFM &amp; FMI Equations (+ Worked Male Example)
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Formalized by Kouri et al. (<em>Clinical Journal of Sport Medicine, 1995</em>), FFMI separates skeletal muscle and organs from body fat across four linked metrics:
            </p>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">1. Fat-Free Mass (FFM / Lean Body Mass)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)]">
                  FFM (kg) = Total Weight (kg) × (1 − Body Fat % ÷ 100)
                </code>
              </li>
              <li className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">2. Raw FFMI &amp; Fat Mass Index (FMI)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)] block">
                  Raw FFMI = FFM (kg) ÷ [Height (m)]² &nbsp;|&nbsp; FMI = Fat Mass (kg) ÷ [Height (m)]²
                </code>
              </li>
              <li className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <strong className="text-[var(--text-primary)] block mb-1">3. Height-Normalized FFMI (1.80m Male Reference)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)]">
                  Normalized FFMI = Raw FFMI + 6.1 × (1.80 − Height in meters)
                </code>
              </li>
            </ul>
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-1.5">
              <strong className="text-[var(--text-primary)] block font-mono uppercase text-xs">
                Worked Male Example (180 cm • 82 kg • 14.0% Body Fat)
              </strong>
              <p>
                Fat Mass is <code className="font-mono text-[var(--text-primary)]">82 × 0.14 = 11.5 kg</code>, leaving <strong>70.5 kg FFM</strong>. Dividing by <code className="font-mono text-[var(--text-primary)]">1.80² = 3.24 m²</code> produces a <strong>Raw and Normalized FFMI of 21.8 kg/m²</strong> (late intermediate / early advanced male lifter) alongside an <strong>FMI of 3.5 kg/m²</strong>.
              </p>
              <p>
                <strong>Body Fat Sensitivity Warning:</strong> Guessing your body fat percentage 4 points too low (10.0% instead of 14.0% at 82 kg and 180 cm) artificially inflates FFMI from <strong>21.8 to 22.8</strong>—while 18.0% BF lowers it to <strong>20.7</strong>. Measure reliably using our{' '}
                <Link href="/tools/body-fat-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                  US Navy Body Fat Calculator
                </Link>{' '}
                before benchmarking natural limits.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Natural Muscular Potential: Kouri (1995) vs. Frame-Size Models
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              While Kouri et al. (1995) found natural male athletes clustered at or below a normalized FFMI of <strong>25.0 kg/m²</strong>, applying that single number universally overlooks two important biological realities:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                <strong className="text-[var(--text-primary)]">Skeletal Frame Size (Casey Butt &amp; Menno Henselmans Models):</strong> Wrist and ankle circumference equations recognize that broader bone structures support greater total cross-sectional muscle mass than narrow frames at the same height.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Height Scaling &amp; Adiposity Drift:</strong> Kouri&apos;s linear <code className="font-mono">6.1 × (1.80 − h)</code> adjustment slightly under-corrects very tall lifters (&gt;1.88 m), and higher body fat (20%+) carries extra non-muscle stromal/connective fat-free mass, pushing rare drug-free strength athletes into the 25–26.5 range.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">BMI vs. FFMI for Lifters:</strong> A 180 cm lifter at 88 kg and 11% body fat has an FFMI of 24.2 (elite muscularity) yet triggers an &quot;Overweight&quot; BMI of 27.2—{' '}
                <Link href="/tools/bmi-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                  see why muscular lifters fail standard BMI classification
                </Link>
                .
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Explicit Male & Female FFMI Benchmark Charts */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Male &amp; Female FFMI Benchmark Charts
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Compare your height-normalized score against dedicated male and female natural muscularity ranges calibrated for lean athletic body fat percentages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="Male FFMI classification chart"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">Male Normalized FFMI Classification Tiers</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Male Training Tier</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">Norm FFMI</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Typical Physique Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--text-primary)]">Below Average / Novice</th>
                    <td className="py-3 px-4 font-mono">&lt; 18.0</td>
                    <td className="py-3 px-4">Minimal prior resistance training</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--text-primary)]">Average Recreational</th>
                    <td className="py-3 px-4 font-mono">18.0 – 19.9</td>
                    <td className="py-3 px-4">Active adult or 6–12 months lifting</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--text-primary)]">Intermediate Lifter</th>
                    <td className="py-3 px-4 font-mono">20.0 – 21.9</td>
                    <td className="py-3 px-4">Visible muscularity, 1.5–3+ years PPL</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--accent-secondary)]">Advanced Muscular</th>
                    <td className="py-3 px-4 font-mono font-bold">22.0 – 23.5</td>
                    <td className="py-3 px-4">Dedicated hypertrophy athlete (4–7+ yrs)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--accent-primary)]">Elite Natural Limit</th>
                    <td className="py-3 px-4 font-mono font-bold">23.6 – 25.2</td>
                    <td className="py-3 px-4">Near Kouri (1995) natural ceiling</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="Female FFMI classification chart"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">Female Normalized FFMI Classification Tiers</caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Female Training Tier</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-secondary)]">Norm FFMI</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Typical Physique Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--text-primary)]">Below Average / Novice</th>
                    <td className="py-3 px-4 font-mono">&lt; 14.0</td>
                    <td className="py-3 px-4">Untrained baseline lean tissue</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--text-primary)]">Average Recreational</th>
                    <td className="py-3 px-4 font-mono">14.0 – 15.9</td>
                    <td className="py-3 px-4">Fit active female / early training year</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--text-primary)]">Intermediate Lifter</th>
                    <td className="py-3 px-4 font-mono">16.0 – 17.9</td>
                    <td className="py-3 px-4">Defined athletic musculature &amp; strength</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--accent-secondary)]">Advanced Muscular</th>
                    <td className="py-3 px-4 font-mono font-bold">18.0 – 19.5</td>
                    <td className="py-3 px-4">Multi-year strength or physique competitor</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 px-4 font-semibold text-[var(--accent-primary)]">Elite Natural Limit</th>
                    <td className="py-3 px-4 font-mono font-bold">19.6 – 21.2</td>
                    <td className="py-3 px-4">Upper natural female lean-mass range</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3: Actionable Hypertrophy & Nutrition Links */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            Convert Your FFMI Score Into Hypertrophy &amp; Nutrition Actions
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Whether you have several kilograms of lean mass ceiling left to build or are preparing for a lean cut, combine your FFMI reading with accurate nutrition and relative strength tracking:{' '}
            <Link href="/tools/tdee-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              set lean-bulking or recomp calories in the TDEE calculator
            </Link>
            ,{' '}
            <Link href="/tools/strength-score-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              benchmark your relative powerlifting strength with DOTS &amp; IPF GL
            </Link>
            , and{' '}
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              log progressive hypertrophy sets in PPL Tracker
            </Link>
            .
          </p>
        </section>

        <ToolCrossLinksSection
          heading="Related Muscularity Calculators & Hypertrophy Guides"
          subheading="Close the loop between body composition estimation, calorie partitioning, and weekly set volume."
          reviewer={{
            name: 'Elena Rostova, CSCS',
            role: 'Head of High-Performance Strength & Conditioning',
            href: '/author/elena-rostova',
            note: 'Reviewed Kouri et al. (1995) height normalization, female muscularity benchmarks, and FMI diagnostic thresholds.',
          }}
          tools={[
            {
              href: '/tools/body-fat-calculator',
              title: 'US Navy Body Fat Calculator',
              badge: 'Prerequisite BF%',
              description: 'Measure neck, waist, and hip circumferences to supply an accurate BF% input for FFMI.',
              anchorText: 'Estimate BF% with US Navy Body Fat Calculator',
            },
            {
              href: '/tools/tdee-calculator',
              title: 'TDEE & Macro Split Calculator',
              badge: 'Nutrition',
              description: 'Auto-uses your calculated Lean Body Mass in Katch-McArdle BMR to set surplus or deficit macros.',
              anchorText: 'Set lean-bulking calories in TDEE Calculator',
            },
            {
              href: '/tools/strength-score-calculator',
              title: 'DOTS & IPF GL Calculator',
              badge: 'Relative Strength',
              description: 'Compare your Squat, Bench, and Deadlift total against pound-for-pound federation standards.',
              anchorText: 'Benchmark strength with DOTS & IPF GL',
            },
            {
              href: '/tools/bmi-calculator',
              title: 'BMI Calculator for Lifters',
              badge: 'BMI vs FFMI',
              description: 'Contrast traditional height-weight BMI categories with fat-free lean mass diagnostics.',
              anchorText: 'Compare BMI vs FFMI for muscular lifters',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Hypertrophy Engine',
              description: 'Progressively overload compound and isolation lifts across 10–20 weekly working sets.',
              anchorText: 'Log progressive hypertrophy sets in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/body-recomposition-science-action-plan',
              title: 'Body Recomposition Science: Build Muscle & Lose Fat',
              category: 'Fat Loss & Recomp',
              description: 'How to raise FFMI while lowering body fat percentage through high protein and mechanical tension.',
              anchorText: 'Read the body recomposition training and nutrition framework',
            },
            {
              href: '/blog/female-hypertrophy-science-heavy-weights',
              title: 'Female Hypertrophy Science: Heavy Weights vs Light Reps',
              category: "Women's Strength",
              description: 'Why mechanical tension across 6–12 rep sets maximizes female lean mass development without unwanted bulk.',
              anchorText: 'Explore the science of female muscular hypertrophy',
            },
            {
              href: '/blog/upper-chest-volume-landmarks-mev-mav-mrv',
              title: 'Upper Chest Volume Landmarks: MEV, MAV & MRV Guide',
              category: 'Push (Chest)',
              description: 'Allocate weekly hard sets between Minimum Effective Volume and Maximum Recoverable Volume.',
              anchorText: 'Review MEV, MAV, and MRV hypertrophy volume landmarks',
            },
            {
              href: '/blog/optimal-protein-intake-clinical-meta-analysis',
              title: 'Optimal Protein Intake Beyond 2.2g/kg: Clinical Data',
              category: 'Sports Nutrition',
              description: 'What controlled clinical trials show for protein synthesis thresholds during cutting and lean bulking.',
              anchorText: 'Read the optimal daily protein intake clinical meta-analysis',
            },
            {
              href: '/blog/lat-hypertrophy-tension-vs-metabolic-stress',
              title: 'Lat Hypertrophy Science: Tension vs Metabolic Stress',
              category: 'Pull (Back)',
              description: 'Targeted mechanical tension strategies to build wide lats and elevate upper-body FFMI.',
              anchorText: 'Read lat hypertrophy science on tension vs metabolic stress',
            },
          ]}
        />

        {/* FAQ Accordion */}
        <section className="max-w-4xl mx-auto">
          <FaqAccordion items={FFMI_FAQS} title="FFMI, Lean Mass & Natural Muscular Potential FAQ" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
