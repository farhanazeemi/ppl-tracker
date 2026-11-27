import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { WorkoutSubstitutionFinder } from '../../../components/tools/WorkoutSubstitutionFinder';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';
import { getCalculatorToolPageSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Exercise Substitution & PPL Alternatives',
  description:
    'Find instant biomechanical exercise alternatives and Push/Pull/Legs split swaps filtered by equipment, movement pattern, and hypertrophy goals—100% free.',
  alternates: {
    canonical: '/tools/workout-substitution-finder',
  },
  openGraph: {
    title: 'Exercise Substitution & PPL Alternatives | PPL Tracker',
    description:
      'Discover biomechanically matched exercise alternatives and PPL split substitutes based on movement patterns, target muscles, and open gym equipment.',
    url: `${baseUrl}/tools/workout-substitution-finder`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Tracker Workout Substitution Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exercise Substitution & PPL Alternatives | PPL Tracker',
    description:
      'Deterministic exercise substitution engine matching movement patterns, target muscles, and open gym equipment.',
    images: ['/og-image.png'],
  },
};

const SUBSTITUTION_FAQS: FaqItem[] = [
  {
    question: 'Will swapping an exercise mid-workout compromise my hypertrophy or strength gains?',
    answer:
      'No, provided the substitute preserves the same fundamental movement pattern (e.g., vertical pull to vertical pull) and works the target musculature through equivalent active ranges of motion. Mechanical tension—created through high motor unit recruitment close to muscular failure—is the primary driver of hypertrophy (Schoenfeld, 2010). Swapping a crowded lat pulldown station for assisted pull-ups or single-arm neutral cable pulldowns delivers comparable tension without stalling your session.',
  },
  {
    question: 'How should I adjust my working weight when switching between barbell and dumbbells?',
    answer:
      'Dumbbells introduce independent bilateral stabilization and freedom of wrist rotation, which elevates stabilizer muscle demand. As a practical heuristic, when substituting a barbell press for dumbbells, divide your barbell working weight by two and multiply by 0.75 to 0.85 (e.g., a 100 kg barbell bench press generally translates to approximately 35–40 kg dumbbells per hand). Always perform an initial acclimatization set to calibrate the resistance profile.',
  },
  {
    question: 'What is the biomechanical difference between a machine press and a free-weight bench press?',
    answer:
      'A free-weight barbell bench press features a vertical gravitational resistance curve requiring significant anterior shoulder and rotator cuff stabilization. Seated chest press machines, by contrast, utilize guided linear or converging cam tracks that eliminate horizontal stabilization demands. This allows lifters to drive sets closer to true contractile failure with minimal joint shearing, making machines exceptionally effective during high-fatigue or late-session training.',
  },
  {
    question: 'Can bodyweight pull-ups completely replace a cable lat pulldown?',
    answer:
      'Yes. Both movements share a closed-to-open vertical pulling kinematic pattern that primarily engages the latissimus dorsi, lower trapezius, and elbow flexors. Pull-ups require greater core and scapular stabilization because your body moves around a fixed bar (closed-kinetic-chain), whereas pulldowns allow you to anchor your thighs and micro-load resistance in precise 2.5 kg increments. If bodyweight is too heavy, utilize looped resistance bands or an assisted pull-up machine.',
  },
  {
    question: 'How do I maintain progressive overload when I frequently have to substitute exercises?',
    answer:
      'To prevent plateauing, record each distinct movement as its own progressive overload track rather than trying to equate dumbbell numbers directly with barbell numbers. When you log your sets, reps, and RPE with the PPL Tracker tool, note whether the exercise was performed on a machine or free weights, and apply a 2-rep double progression ceiling before increasing load.',
  },
];

export default function WorkoutSubstitutionFinderPage() {
  const schema = getCalculatorToolPageSchema({
    name: 'Workout Exercise Substitution & PPL Alternatives Finder',
    pageName: 'Exercise Substitution & PPL Alternatives | PPL Tracker',
    breadcrumbName: 'Workout Substitution Finder',
    slug: 'workout-substitution-finder',
    description:
      'Deterministic exercise substitution engine matching movement patterns, joint kinematics, target muscles, and Push/Pull/Legs alternatives by open gym equipment.',
    faqItems: SUBSTITUTION_FAQS,
    featureList: [
      'Deterministic biomechanical matching across 50+ compound and isolation exercises',
      'Equipment availability filters for dumbbells, cables, machines, barbells, and bodyweight',
      'Push, Pull, and Legs alternative recommendations with stabilization & resistance-curve notes',
      'Direct one-click exercise swap sync with PPL Workout Tracker',
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
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" aria-hidden="true" />
          <Link href="/tools" className="hover:text-[var(--accent-primary)] transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">
            Workout Substitution Finder
          </span>
        </nav>

        {/* Single Page H1 + Direct Answer */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Exercise Swaps &amp; PPL Alternatives
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
            Workout Exercise Substitution &amp; PPL Alternatives Finder
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
            <strong>Direct Answer:</strong> To substitute an exercise or adapt a Push/Pull/Legs session without losing hypertrophy stimulus, match three biomechanical variables: <strong>movement pattern</strong> (e.g., vertical pull or hip hinge), <strong>joint torque angle</strong>, and <strong>lengthened-range tension</strong>. Filter by open equipment below to get ranked alternatives and sync swaps directly into{' '}
            <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
              PPL Tracker
            </Link>
            .
          </p>
        </header>

        {/* The Interactive Substitution Finder Application */}
        <WorkoutSubstitutionFinder />

        {/* =========================================================================
            EDITORIAL GUIDE & SPORTS SCIENCE FOUNDATION
            ========================================================================= */}
        <section className="space-y-12 pt-8 border-t border-[var(--border-subtle)]">
          {/* Section 1: Biomechanics Overview */}
          <div className="space-y-4 max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
              {"// Exercise Physiology & Biomechanics"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
              The Biomechanics of Exercise Substitution: When and How to Swap Movements
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
              In a crowded commercial gym, waiting fifteen minutes for a single cable station or squat rack ruins session pacing and diminishes muscular density. However, blindly swapping exercises based solely on high-level muscle names—such as replacing a <strong>Lat Pulldown</strong> with a <strong>Barbell Bent-Over Row</strong> simply because &quot;both work the back&quot;—fundamentally alters the motor recruitment pattern and joint torque angles of your workout.
            </p>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
              Empirical exercise science confirms that skeletal muscle responds primarily to <strong className="text-[var(--text-primary)]">mechanical tension</strong>, <strong className="text-[var(--text-primary)]">active range of motion</strong>, and <strong className="text-[var(--text-primary)]">length-dependent muscle recruitment</strong> (Helms et al., 2018). Effective substitutions must mirror the original movement&apos;s line of drive, sagittal or frontal plane excursion, and stabilization requirements. When you <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold hover:underline">track your progressive overload with PPL Tracker</Link>, maintaining movement pattern consistency ensures that volume markers (MEV, MAV, and MRV) remain scientifically valid week over week.
            </p>
          </div>

          {/* Section 2: Movement Pattern Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-bento p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold uppercase text-[var(--text-primary)]">
                Match the Vector & Angle
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                Horizontal pushes (bench press, push-ups) prioritize sternal pec fibers, whereas vertical pushes (overhead press) shift tension to anterior delts. Always replace horizontal with horizontal and vertical with vertical.
              </p>
            </div>

            <div className="card-bento p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold uppercase text-[var(--text-primary)]">
                Assess Stabilization Demand
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                Free-weight barbells require systemic core and stabilizer brace, whereas selectorized machines guide the path. If moving from a machine to free weights, reduce baseline load by 15–20% to account for balance overhead.
              </p>
            </div>

            <div className="card-bento p-6 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold uppercase text-[var(--text-primary)]">
                Preserve Lengthened Tension
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                Contemporary hypertrophy research confirms that exercises exerting peak tension in the stretched position (e.g., incline dumbbell curls, Romanian deadlifts, overhead cable extensions) yield robust sarcomere genesis. Choose alternatives that preserve deep stretch.
              </p>
            </div>
          </div>

          {/* Section 3: Structured Substitution Reference Table */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-[var(--text-primary)]">
              Common Gym Substitutions Reference Guide
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
              Use this structured matrix when common gym equipment stations are unavailable during peak workout hours:
            </p>

            <div className="overflow-x-auto rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[var(--bg-elevated)]/60 border-b border-[var(--border-subtle)] font-mono text-[11px] uppercase text-[var(--text-muted)]">
                  <tr>
                    <th className="p-4 font-bold text-[var(--text-primary)]">Original Exercise</th>
                    <th className="p-4 font-bold text-[var(--text-primary)]">Best Alternative</th>
                    <th className="p-4 font-bold text-[var(--text-primary)]">Equipment Shift</th>
                    <th className="p-4 font-bold text-[var(--text-primary)]">Biomechanical Nuance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <tr className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">Wide-Grip Lat Pulldown</td>
                    <td className="p-4 text-[var(--accent-primary)] font-bold">Assisted Pull-Up or Single-Arm Pulldown</td>
                    <td className="p-4 font-mono text-[11px]">Cable → Bodyweight / Machine</td>
                    <td className="p-4">Higher core recruitment; identical vertical adduction of the shoulder girdle.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">Flat Barbell Bench Press</td>
                    <td className="p-4 text-[var(--accent-primary)] font-bold">Flat Dumbbell Press or Machine Press</td>
                    <td className="p-4 font-mono text-[11px]">Barbell → Dumbbells / Machine</td>
                    <td className="p-4">Allows deeper bottom stretch; wrist rotation relieves acromioclavicular stress.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">45-Degree Leg Press</td>
                    <td className="p-4 text-[var(--accent-primary)] font-bold">Hack Squat or Dumbbell Goblet Squat</td>
                    <td className="p-4 font-mono text-[11px]">Machine → Dumbbell / Machine</td>
                    <td className="p-4">Anterior weight carriage promotes upright torso, sparing the lumbar spine.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">Standing Cable Fly</td>
                    <td className="p-4 text-[var(--accent-primary)] font-bold">Pec Deck Machine or Dumbbell Fly</td>
                    <td className="p-4 font-mono text-[11px]">Cable → Machine / Dumbbells</td>
                    <td className="p-4">Pec deck provides fixed transverse adduction; dumbbell fly peaks tension at stretch.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">Barbell Back Squat</td>
                    <td className="p-4 text-[var(--accent-primary)] font-bold">Bulgarian Split Squat or Leg Press</td>
                    <td className="p-4 font-mono text-[11px]">Barbell → Dumbbell / Machine</td>
                    <td className="p-4">Eliminates spinal axial compression while matching knee extension torque.</td>
                  </tr>
                  <tr className="hover:bg-[var(--bg-elevated)]/40 transition-colors">
                    <td className="p-4 font-bold text-[var(--text-primary)]">Barbell Romanian Deadlift</td>
                    <td className="p-4 text-[var(--accent-primary)] font-bold">Dumbbell RDL or 45° Hyperextension</td>
                    <td className="p-4 font-mono text-[11px]">Barbell → Dumbbells / Bench</td>
                    <td className="p-4">Freedom to trace dumbbells along thighs keeps load centered over mid-foot.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Push/Pull/Legs Split Alternatives & Progressive Overload */}
          <div className="p-8 rounded-3xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/25 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-[var(--text-primary)]">
              Push / Pull / Legs Alternatives &amp; Maintaining Progressive Overload
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
              Looking for practical <strong>PPL alternatives</strong> when equipment is occupied or your weekly schedule drops from 6 days to 3–4 days? Swap crowded barbell movements for biomechanically matched dumbbell or machine variants above, or transition into a 4-day Upper/Lower or 3-day Full Body split inside{' '}
              <Link href="/tools/ppl-tracker" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                PPL Tracker
              </Link>
              . Track each distinct movement on its own double-progression rep track rather than equating machine loads pound-for-pound with free weights, and calibrate working intensity with our{' '}
              <Link href="/tools/rpe-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                RPE / RIR Load Estimator
              </Link>{' '}
              and{' '}
              <Link href="/tools/warmup-calculator" className="text-[var(--accent-primary)] font-bold underline underline-offset-4">
                Barbell Warm-Up Calculator
              </Link>
              .
            </p>
          </div>

          <ToolCrossLinksSection
            heading="Related Exercise Swaps & Split Hypertrophy Guides"
            subheading="Pair smart movement substitutions with joint-friendly biomechanics and structured progressive overload."
            reviewer={{
              name: 'Liam Sterling',
              role: 'Natural Bodybuilding Coach & Hypertrophy Specialist',
              href: '/author/liam-sterling',
              note: 'Reviewed movement-pattern equivalence rules, stabilization trade-offs, and lengthened-range tension criteria.',
            }}
            tools={[
              {
                href: '/tools/ppl-tracker',
                title: 'PPL Workout Tracker',
                badge: 'Split Engine',
                description: 'Execute 6-day PPL, 4-day Upper/Lower, 5-day Bro Split, or 3-day Full Body schedules with active swaps.',
                anchorText: 'Launch PPL & alternative splits in PPL Tracker',
              },
              {
                href: '/tools/rpe-calculator',
                title: 'RPE / RIR Load Estimator',
                badge: 'Autoregulation',
                description: 'Recalibrate working weight accurately after switching between barbell, dumbbell, and machine stations.',
                anchorText: 'Calibrate substitute load with the RPE Calculator',
              },
              {
                href: '/tools/warmup-calculator',
                title: 'Barbell Warm-Up Calculator',
                badge: 'Joint Prep',
                description: 'Build non-fatiguing ramp sets before compound substitutes to protect shoulders, knees, and lower back.',
                anchorText: 'Generate compound warm-up sets',
              },
            ]}
            articles={[
              {
                href: '/blog/upper-chest-frequency-3x-vs-bro-split',
                title: 'Upper Chest Frequency: 3x Weekly vs Bro-Split Growth',
                category: 'Push (Chest)',
                description: 'Compare split frequency alternatives when adapting Push days around recovery and schedule.',
                anchorText: 'Compare 3x weekly vs bro-split push frequency',
              },
              {
                href: '/blog/lat-hypertrophy-tension-vs-metabolic-stress',
                title: 'Lat Hypertrophy Science: Tension vs Metabolic Stress',
                category: 'Pull (Back)',
                description: 'Evaluate pulldown, pull-up, and row substitutions for maximizing thoracic and iliac lat tension.',
                anchorText: 'Read lat hypertrophy science on tension vs metabolic stress',
              },
              {
                href: '/blog/romanian-deadlift-hamstring-glute-guide',
                title: 'Romanian Deadlift Biomechanics for Hamstring & Glutes',
                category: 'Legs (Squat)',
                description: 'Understand hip-hinge lever arms when swapping barbell RDLs for dumbbells or 45-degree extensions.',
                anchorText: 'Read Romanian deadlift hamstring & glute mechanics',
              },
              {
                href: '/blog/shoulder-impingement-biomechanical-screening',
                title: 'Shoulder Impingement Screening & Biomechanical Tests',
                category: 'Prehab & Mobility',
                description: 'Identify impingement triggers and choose shoulder-friendly pressing and lateral-raise substitutes.',
                anchorText: 'Screen shoulder impingement triggers before swapping presses',
              },
              {
                href: '/blog/debunking-the-bulky-myth-why-lifting-heavy-creates-a-toned-physique-troubleshooting-plateaus-in-strength-and-body-composition',
                title: 'Troubleshooting Plateaus in Strength and Body Composition',
                category: "Women's Strength",
                description: 'How smart exercise rotation and progressive tension break through stalled strength and physique plateaus.',
                anchorText: 'Troubleshoot strength and body composition plateaus',
              },
            ]}
          />

          {/* Section 5: Accessible Interactive FAQ Accordion */}
          <FaqAccordion
            items={SUBSTITUTION_FAQS}
            title="Workout Substitution & Biomechanics FAQ"
            description="Evidence-based guidance on equipment transitions, lever arms, and progressive overload maintenance."
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
