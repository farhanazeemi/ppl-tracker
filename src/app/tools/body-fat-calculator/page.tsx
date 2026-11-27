import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Activity } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { BodyFatCalculator } from '../../../components/tools/BodyFatCalculator';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { BODYFAT_FAQS } from '../../../components/tools/toolFaqs';
import { FaqAccordion } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'US Navy Body Fat Calculator — Men & Women BF%',
  description:
    'Calculate body fat percentage, fat mass, and lean body mass using the U.S. Navy circumference formula for men and women. Includes measurement rules & charts.',
  alternates: {
    canonical: '/tools/body-fat-calculator',
  },
  openGraph: {
    title: 'US Navy Body Fat Calculator — Men & Women BF% | PPL Tracker',
    description:
      'Estimate body fat %, fat mass, and lean body mass from neck, waist, hip, and height measurements using the U.S. Navy circumference formula.',
    url: `${baseUrl}/tools/body-fat-calculator`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PPL Tracker US Navy Body Fat Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Navy Body Fat Calculator — Men & Women BF% | PPL Tracker',
    description:
      'Calculate body fat % and lean mass with the validated U.S. Navy circumference method.',
    images: ['/og-image.png'],
  },
};

export default function BodyFatCalculatorPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'US Navy Body Fat Calculator',
    pageName: 'US Navy Body Fat Calculator — Men & Women BF% | PPL Tracker',
    breadcrumbName: 'US Navy Body Fat Calculator',
    slug: 'body-fat-calculator',
    description:
      'Calculate body fat percentage, fat mass, and lean body mass using the U.S. Navy circumference formula (Hodgdon & Beckett, 1984) for men and women.',
    faqItems: BODYFAT_FAQS,
    featureList: [
      'Hodgdon & Beckett (1984) U.S. Navy circumference equations for men and women',
      'Instant Body Fat %, Lean Body Mass (LBM), and Fat Mass calculation',
      'Dual Metric (cm/kg) and Imperial (in/lbs) inputs with Athlete Profile sync',
      'ACE body fat categories and U.S. Navy BCA age-bracket limits',
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
          <span className="text-[var(--text-primary)] font-semibold">US Navy Body Fat Calculator</span>
        </nav>

        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/25">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Body Composition Science</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
            US Navy Body Fat Calculator
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            <strong>Direct Answer:</strong> The U.S. Navy body fat calculator estimates body fat percentage, fat mass, and lean body mass from simple tape measurements (height, neck, waist, and hips for women) using the validated Hodgdon &amp; Beckett (1984) log-circumference equations—typically tracking within <strong>±3%–4%</strong> of DEXA scans without equipment costs.
          </p>
        </header>

        <BodyFatCalculator />

        {/* Section 1: Tape Measurement Protocol */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              {'// Circumference Measurement Protocol'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              How to Measure Neck, Waist &amp; Hips for the U.S. Navy Method
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Consistent landmark placement determines tape accuracy. Take every measurement first thing in the morning before food or training, standing upright with a flexible non-stretch tape held flat against the skin without compressing soft tissue.
            </p>
          </div>

          <div
            className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
            tabIndex={0}
            role="region"
            aria-label="U.S. Navy tape measurement landmarks and rounding rules"
          >
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <caption className="visually-hidden">
                Three-step U.S. Navy body fat tape measurement landmarks for men and women with DoD rounding rules
              </caption>
              <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Site</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Male Landmark</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Female Landmark</th>
                  <th scope="col" className="py-3 px-4 font-bold text-[var(--accent-primary)]">Official DoD Rounding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <th scope="row" className="py-3.5 px-4 font-bold text-[var(--text-primary)]">1. Neck</th>
                  <td className="py-3.5 px-4">Just below the larynx (Adam&apos;s apple), perpendicular to the neck axis with shoulders relaxed.</td>
                  <td className="py-3.5 px-4">Same landmark: just below the larynx, tape sloping slightly downward toward the front.</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-primary)]">Round UP to nearest 0.5 in</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3.5 px-4 font-bold text-[var(--text-primary)]">2. Waist / Abdomen</th>
                  <td className="py-3.5 px-4">Horizontally across the navel (umbilicus) at the end of a normal, relaxed exhale without sucking in.</td>
                  <td className="py-3.5 px-4">Horizontally at the narrowest natural waist between the lowest rib and top of the hip bone.</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-primary)]">Round DOWN to nearest 0.5 in</td>
                </tr>
                <tr>
                  <th scope="row" className="py-3.5 px-4 font-bold text-[var(--text-primary)]">3. Hips</th>
                  <td className="py-3.5 px-4">Not required for male equation.</td>
                  <td className="py-3.5 px-4">Horizontally around the widest protrusion of the glutes with heels together.</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-primary)]">Round DOWN to nearest 0.5 in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Hodgdon & Beckett Equations + Accuracy Limits */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[var(--border-subtle)]">
          <div className="lg:col-span-7 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              U.S. Navy Body Fat Equations &amp; Accuracy Limits
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Derived by Hodgdon &amp; Beckett (1984) at the Naval Health Research Center, the method predicts body density from logarithmic circumference ratios and converts density to body fat percentage using the Siri (1961) equation:
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <strong className="text-[var(--text-primary)] block font-mono uppercase text-xs">Men (Metric cm)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)] break-all">
                  BF% = 495 ÷ [1.0324 − 0.19077 × log₁₀(Waist − Neck) + 0.15456 × log₁₀(Height)] − 450
                </code>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <strong className="text-[var(--text-primary)] block font-mono uppercase text-xs">Women (Metric cm)</strong>
                <code className="text-xs font-mono text-[var(--accent-primary)] break-all">
                  BF% = 495 ÷ [1.29579 − 0.35004 × log₁₀(Waist + Hip − Neck) + 0.22100 × log₁₀(Height)] − 450
                </code>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-1">
              <strong className="text-[var(--text-primary)] block font-mono uppercase text-xs">
                Worked Male Example (178 cm • 80 kg • 39 cm Neck • 84 cm Waist)
              </strong>
              <p>
                Plugging <code className="font-mono text-[var(--text-primary)]">Waist − Neck = 45 cm</code> and <code className="font-mono text-[var(--text-primary)]">Height = 178 cm</code> into the male density equation yields <strong>14.9% body fat</strong>, equal to <strong>11.9 kg of fat mass</strong> and <strong>68.1 kg of Lean Body Mass (LBM)</strong>.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-display font-black uppercase text-[var(--text-primary)]">
              Accuracy vs. DEXA &amp; Method Caveats
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                <strong className="text-[var(--text-primary)]">Validation Bound (±3%–4%):</strong> Across broad adult cohorts, the U.S. Navy tape formula correlates tightly with hydrostatic weighing and DEXA, with a typical individual error of 3–4 percentage points.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Hydration &amp; Bloating Insensitivity:</strong> Unlike bioelectrical impedance (BIA) smart scales that swing 2–3% with water or glycogen shifts, circumference tracking remains stable when measured fasted.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Individual Distribution Variance:</strong> Lifters with unusually thick neck musculature or preferential lower-body fat storage can test slightly leaner or higher than a DEXA scan. Use bi-weekly trend changes alongside waist measurements rather than treating one reading as clinical diagnosis.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: ACE & US Navy Standards + BMI vs BF% vs FFMI Bridge */}
        <section className="space-y-8 pt-8 border-t border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-[var(--text-primary)]">
              Body Fat Percentage Categories: ACE &amp; U.S. Navy Standards
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Compare your estimated body fat percentage against both general athletic fitness tiers (American Council on Exercise) and U.S. Navy Body Composition Assessment (OPNAVINST 6110.1) age-bracket maximums.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="ACE body fat percentage categories"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">
                  American Council on Exercise (ACE) Body Fat Percentage Categories for Men and Women
                </caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">ACE Category</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Men</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Women</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Essential Fat</th>
                    <td className="py-2.5 px-4">2% – 5%</td>
                    <td className="py-2.5 px-4">10% – 13%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--accent-primary)]">Athletes</th>
                    <td className="py-2.5 px-4 font-bold">6% – 13%</td>
                    <td className="py-2.5 px-4 font-bold">14% – 20%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--accent-secondary)]">Fitness</th>
                    <td className="py-2.5 px-4 font-bold">14% – 17%</td>
                    <td className="py-2.5 px-4 font-bold">21% – 24%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Acceptable / Average</th>
                    <td className="py-2.5 px-4">18% – 24%</td>
                    <td className="py-2.5 px-4">25% – 31%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Obese</th>
                    <td className="py-2.5 px-4">25%+</td>
                    <td className="py-2.5 px-4">32%+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="table-responsive-region rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
              tabIndex={0}
              role="region"
              aria-label="U.S. Navy BCA maximum allowable body fat by age"
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="visually-hidden">
                  U.S. Navy OPNAVINST 6110.1 Maximum Allowable Body Fat Percentage by Age Bracket
                </caption>
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-[11px] font-mono uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Age Bracket</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Navy Male Max</th>
                    <th scope="col" className="py-3 px-4 font-bold text-[var(--text-primary)]">Navy Female Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] tabular-nums text-[var(--text-secondary)]">
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">18 – 21 Years</th>
                    <td className="py-2.5 px-4">22%</td>
                    <td className="py-2.5 px-4">33%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">22 – 29 Years</th>
                    <td className="py-2.5 px-4">23%</td>
                    <td className="py-2.5 px-4">34%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">30 – 39 Years</th>
                    <td className="py-2.5 px-4">24%</td>
                    <td className="py-2.5 px-4">35%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">40+ Years</th>
                    <td className="py-2.5 px-4">26%</td>
                    <td className="py-2.5 px-4">36%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
            <h3 className="text-base sm:text-lg font-display font-bold uppercase text-[var(--text-primary)]">
              Turning Body Fat % Into Lean Mass, Calories &amp; Training Progress
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Once you know your estimated body fat percentage and lean body mass, you can{' '}
              <Link href="/tools/bmi-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                compare circumference results against standard BMI ranges
              </Link>{' '}
              to see why muscular athletes often trigger false overweight flags on height-weight tables. Next, plug your body fat % into our{' '}
              <Link href="/tools/ffmi-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                calculate your Fat-Free Mass Index (FFMI)
              </Link>{' '}
              tool to benchmark skeletal muscle development, then{' '}
              <Link href="/tools/tdee-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                estimate your daily calorie expenditure with our TDEE calculator
              </Link>{' '}
              using the lean-mass Katch-McArdle option and{' '}
              <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                track progressive overload and training volume in PPL Tracker
              </Link>
              .
            </p>
          </div>
        </section>

        <ToolCrossLinksSection
          heading="Related Recomposition & Body Composition Guides"
          subheading="Combine circumference tracking with nutrition periodization and structured progressive overload."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Verified Hodgdon & Beckett (1984) log-density equations, U.S. Navy BCA age brackets, and ACE normative ranges.',
          }}
          tools={[
            {
              href: '/tools/ffmi-calculator',
              title: 'FFMI Calculator',
              badge: 'Lean Mass',
              description: 'Use your estimated body fat % to compute raw and 1.80m height-normalized Fat-Free Mass Index.',
              anchorText: 'Calculate your Fat-Free Mass Index (FFMI)',
            },
            {
              href: '/tools/tdee-calculator',
              title: 'TDEE & Macro Calculator',
              badge: 'Katch-McArdle',
              description: 'Turn your lean mass into precise cutting, recomposition, or lean-bulking calorie and protein targets.',
              anchorText: 'Estimate daily calories with our TDEE calculator',
            },
            {
              href: '/tools/bmi-calculator',
              title: 'BMI Calculator for Lifters',
              badge: 'Screening',
              description: 'See how height-weight BMI compares to circumference body fat % and FFMI when you carry muscle mass.',
              anchorText: 'Compare against BMI ranges for lifters',
            },
            {
              href: '/tools/ppl-tracker',
              title: 'PPL Workout Tracker',
              badge: 'Progressive Overload',
              description: 'Preserve lean tissue during a fat-loss phase by logging sets, reps, and RPE across 4 periodized splits.',
              anchorText: 'Track progressive overload in PPL Tracker',
            },
          ]}
          articles={[
            {
              href: '/blog/tracking-body-recomposition-beyond-scale',
              title: 'Tracking Body Recomposition Biomarkers Beyond the Scale',
              category: 'Fat Loss & Recomp',
              description: 'Why tape measurements, strength retention, and bi-weekly averages outperform noisy daily scale fluctuations.',
              anchorText: 'Read tracking body recomposition metrics beyond scale weight',
            },
            {
              href: '/blog/body-recomposition-science-action-plan',
              title: 'Body Recomposition Science: Build Muscle & Lose Fat',
              category: 'Fat Loss & Recomp',
              description: 'Calorie partitioning, protein dosing, and training stimulus protocols for simultaneous fat loss and lean tissue gain.',
              anchorText: 'Explore the body recomposition training and nutrition plan',
            },
            {
              href: '/blog/breaking-a-4-week-weight-loss-plateau-tracking-biomarkers-beyond-scale-weight',
              title: 'Breaking a 4-Week Weight Loss Plateau: Tracking Biomarkers Beyond Scale Weight',
              category: 'Fat Loss & Recomp',
              description: 'How waist-to-neck circumferences distinguish true fat loss from water retention during a cut.',
              anchorText: 'Break a 4-week fat-loss plateau using circumference biomarkers',
            },
            {
              href: '/blog/female-hypertrophy-science-heavy-weights',
              title: 'Female Hypertrophy Science: Heavy Weights vs Light Reps',
              category: "Women's Strength",
              description: 'Evidence-based resistance loading strategies for improving lean-to-fat composition ratios in women.',
              anchorText: 'Read female hypertrophy science on heavy resistance vs high reps',
            },
            {
              href: '/blog/sustainable-strength-habits-women-over-40',
              title: 'Sustainable Strength Training Habits for Women Over 40',
              category: "Women's Strength",
              description: 'Protecting lean muscle mass, bone mineral density, and metabolic health across midlife training cycles.',
              anchorText: 'Read sustainable strength habits for women over 40',
            },
          ]}
        />

        <FaqAccordion items={BODYFAT_FAQS} title="US Navy Body Fat Method FAQ" />
      </main>

      <Footer />
    </div>
  );
}
