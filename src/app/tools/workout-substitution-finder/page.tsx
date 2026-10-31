import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { WorkoutSubstitutionFinder } from '../../../components/tools/WorkoutSubstitutionFinder';
import { FaqAccordion, FaqItem } from '../../../components/FaqAccordion';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Workout Substitution Finder | Gym Exercise Alternatives | PPL Tracker',
  description:
    'Find instant biomechanical exercise alternatives for busy gyms or home workouts. Filter by available equipment, target muscles, and training goals free.',
  alternates: {
    canonical: '/tools/workout-substitution-finder',
  },
  openGraph: {
    title: 'Workout Substitution Finder | Exercise Alternatives Engine | PPL Tracker',
    description:
      'Can\'t get your preferred machine or barbell? Discover biomechanically matched exercise alternatives based on movement patterns, target muscles, and available equipment.',
    url: `${baseUrl}/tools/workout-substitution-finder`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PPL Tracker Workout Substitution Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workout Substitution Finder | Gym Exercise Alternatives',
    description:
      'Deterministic exercise substitution engine matching movement patterns, target muscles, and open gym equipment.',
    images: ['/icon.svg'],
  },
};

const SUBSTITUTION_FAQS: FaqItem[] = [
  {
    question: 'Will swapping an exercise mid-workout compromise my hypertrophy or strength gains?',
    answer:
      'No, provided the substitute preserves the same fundamental movement pattern (e.g., vertical pull to vertical pull) and works the target musculature through equivalent active ranges of motion. Mechanical tension—created through high motor unit recruitment close to muscular failure—is the primary driver of hypertrophy (Schoenfeld, 2010). Swapping a crowded lat pulldown station for assisted pull-ups or single-arm neutral cable pulldowns delivers comparable tension without stalling your session.'
  },
  {
    question: 'How should I adjust my working weight when switching between barbell and dumbbells?',
    answer:
      'Dumbbells introduce independent bilateral stabilization and freedom of wrist rotation, which elevates stabilizer muscle demand. As a practical heuristic, when substituting a barbell press for dumbbells, divide your barbell working weight by two and multiply by 0.75 to 0.85 (e.g., a 100 kg barbell bench press generally translates to approximately 35–40 kg dumbbells per hand). Always perform an initial acclimatization set to calibrate the resistance profile.'
  },
  {
    question: 'What is the biomechanical difference between a machine press and a free-weight bench press?',
    answer:
      'A free-weight barbell bench press features a vertical gravitational resistance curve requiring significant anterior shoulder and rotator cuff stabilization. Seated chest press machines, by contrast, utilize guided linear or converging cam tracks that eliminate horizontal stabilization demands. This allows lifters to drive sets closer to true contractile failure with minimal joint shearing, making machines exceptionally effective during high-fatigue or late-session training.'
  },
  {
    question: 'Can bodyweight pull-ups completely replace a cable lat pulldown?',
    answer:
      'Yes. Both movements share a closed-to-open vertical pulling kinematic pattern that primarily engages the latissimus dorsi, lower trapezius, and elbow flexors. Pull-ups require greater core and scapular stabilization because your body moves around a fixed bar (closed-kinetic-chain), whereas pulldowns allow you to anchor your thighs and micro-load resistance in precise 2.5 kg increments. If bodyweight is too heavy, utilize looped resistance bands or an assisted pull-up machine.'
  },
  {
    question: 'How do I maintain progressive overload when I frequently have to substitute exercises?',
    answer:
      'To prevent plateauing, record each distinct movement as its own progressive overload track rather than trying to equate dumbbell numbers directly with barbell numbers. When you log your sets, reps, and RPE with the PPL Tracker tool, note whether the exercise was performed on a machine or free weights, and apply a 2-rep double progression ceiling before increasing load.'
  }
];

export default function WorkoutSubstitutionFinderPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/tools/workout-substitution-finder#webpage`,
        url: `${baseUrl}/tools/workout-substitution-finder`,
        name: 'Workout Substitution Finder | Gym Exercise Alternatives',
        description:
          'Interactive exercise alternative finder matching biomechanics, movement patterns, and available gym equipment.',
        breadcrumb: {
          '@id': `${baseUrl}/tools/workout-substitution-finder#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/tools/workout-substitution-finder#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${baseUrl}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Workout Substitution Finder',
            item: `${baseUrl}/tools/workout-substitution-finder`,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': `${baseUrl}/tools/workout-substitution-finder#webapp`,
        name: 'PPL Tracker Workout Substitution Finder',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'All',
        url: `${baseUrl}/tools/workout-substitution-finder`,
        description:
          'Free deterministic exercise replacement engine calculating muscle recruitment, joint angles, and equipment compatibility.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/tools/workout-substitution-finder#faq`,
        mainEntity: SUBSTITUTION_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/tools" className="hover:text-amber-500 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 dark:text-white font-bold">
            Workout Substitution Finder
          </span>
        </nav>

        {/* The Interactive Substitution Finder Application */}
        <WorkoutSubstitutionFinder />

        {/* =========================================================================
            EDITORIAL GUIDE & SPORTS SCIENCE FOUNDATION
            ========================================================================= */}
        <section className="space-y-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          {/* Section 1: Biomechanics Overview */}
          <div className="space-y-4 max-w-4xl">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">
              // Exercise Physiology & Biomechanics
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-tight">
              The Biomechanics of Exercise Substitution: When and How to Swap Movements
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              In a crowded commercial gym, waiting fifteen minutes for a single cable station or squat rack ruins session pacing and diminishes muscular density. However, blindly swapping exercises based solely on high-level muscle names—such as replacing a <strong>Lat Pulldown</strong> with a <strong>Barbell Bent-Over Row</strong> simply because &quot;both work the back&quot;—fundamentally alters the motor recruitment pattern and joint torque angles of your workout.
            </p>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Empirical exercise science confirms that skeletal muscle responds primarily to <strong>mechanical tension</strong>, <strong>active range of motion</strong>, and <strong>length-dependent muscle recruitment</strong> (Helms et al., 2018). Effective substitutions must mirror the original movement&apos;s line of drive, sagittal or frontal plane excursion, and stabilization requirements. When you <Link href="/tools/ppl-tracker" className="text-amber-500 font-bold hover:underline">track your progressive overload with PPL Tracker</Link>, maintaining movement pattern consistency ensures that volume markers (MEV, MAV, and MRV) remain scientifically valid week over week.
            </p>
          </div>

          {/* Section 2: Movement Pattern Hierarchy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-zinc-900 dark:text-white">
                Match the Vector & Angle
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Horizontal pushes (bench press, push-ups) prioritize sternal pec fibers, whereas vertical pushes (overhead press) shift tension to anterior delts. Always replace horizontal with horizontal and vertical with vertical.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-zinc-900 dark:text-white">
                Assess Stabilization Demand
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Free-weight barbells require systemic core and stabilizer brace, whereas selectorized machines guide the path. If moving from a machine to free weights, reduce baseline load by 15–20% to account for balance overhead.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#12141c] border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-display font-bold uppercase text-zinc-900 dark:text-white">
                Preserve Lengthened Tension
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Contemporary hypertrophy research confirms that exercises exerting peak tension in the stretched position (e.g., incline dumbbell curls, Romanian deadlifts, overhead cable extensions) yield robust sarcomere genesis. Choose alternatives that preserve deep stretch.
              </p>
            </div>
          </div>

          {/* Section 3: Structured Substitution Reference Table */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-zinc-900 dark:text-white">
              Common Gym Substitutions Reference Guide
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
              Use this structured matrix when common gym equipment stations are unavailable during peak workout hours:
            </p>

            <div className="overflow-x-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#12141c]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-zinc-100 dark:bg-[#181a24] border-b border-zinc-200 dark:border-zinc-800 font-mono text-[11px] uppercase text-zinc-500">
                  <tr>
                    <th className="p-4 font-bold text-zinc-900 dark:text-white">Original Exercise</th>
                    <th className="p-4 font-bold text-zinc-900 dark:text-white">Best Alternative</th>
                    <th className="p-4 font-bold text-zinc-900 dark:text-white">Equipment Shift</th>
                    <th className="p-4 font-bold text-zinc-900 dark:text-white">Biomechanical Nuance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">Wide-Grip Lat Pulldown</td>
                    <td className="p-4 text-amber-500 font-bold">Assisted Pull-Up or Single-Arm Pulldown</td>
                    <td className="p-4 font-mono text-[11px]">Cable → Bodyweight / Machine</td>
                    <td className="p-4">Higher core recruitment; identical vertical adduction of the shoulder girdle.</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">Flat Barbell Bench Press</td>
                    <td className="p-4 text-amber-500 font-bold">Flat Dumbbell Press or Machine Press</td>
                    <td className="p-4 font-mono text-[11px]">Barbell → Dumbbells / Machine</td>
                    <td className="p-4">Allows deeper bottom stretch; wrist rotation relieves acromioclavicular stress.</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">45-Degree Leg Press</td>
                    <td className="p-4 text-amber-500 font-bold">Hack Squat or Dumbbell Goblet Squat</td>
                    <td className="p-4 font-mono text-[11px]">Machine → Dumbbell / Machine</td>
                    <td className="p-4">Anterior weight carriage promotes upright torso, sparing the lumbar spine.</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">Standing Cable Fly</td>
                    <td className="p-4 text-amber-500 font-bold">Pec Deck Machine or Dumbbell Fly</td>
                    <td className="p-4 font-mono text-[11px]">Cable → Machine / Dumbbells</td>
                    <td className="p-4">Pec deck provides fixed transverse adduction; dumbbell fly peaks tension at stretch.</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">Barbell Back Squat</td>
                    <td className="p-4 text-amber-500 font-bold">Bulgarian Split Squat or Leg Press</td>
                    <td className="p-4 font-mono text-[11px]">Barbell → Dumbbell / Machine</td>
                    <td className="p-4">Eliminates spinal axial compression while matching knee extension torque.</td>
                  </tr>
                  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">Barbell Romanian Deadlift</td>
                    <td className="p-4 text-amber-500 font-bold">Dumbbell RDL or 45° Hyperextension</td>
                    <td className="p-4 font-mono text-[11px]">Barbell → Dumbbells / Bench</td>
                    <td className="p-4">Freedom to trace dumbbells along thighs keeps load centered over mid-foot.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Progressive Overload & Cluster Linking */}
          <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/25 space-y-4">
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-zinc-900 dark:text-white">
              How to Maintain Progressive Overload When Swapping Exercises
            </h2>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
              When substituting an exercise, never attempt to lift identical weight pound-for-pound on a new apparatus. Instead, establish a fresh baseline and use the double progression method: lock in your working weight, progress from the lower rep limit to the upper rep ceiling across all sets, and only increment resistance once every target rep is achieved with clean technical control.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/tools/ppl-tracker"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold hover:bg-amber-400 shadow-md shadow-amber-500/20 inline-flex items-center gap-1.5 transition-colors"
              >
                Launch PPL Progressive Overload Tracker →
              </Link>
              <Link
                href="/blog/double-progression-hypertrophy-overload-guide"
                className="text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-amber-500 underline"
              >
                Read Double Progression Hypertrophy Guide
              </Link>
              <Link
                href="/blog/scapular-plane-lateral-raise-delt-hypertrophy"
                className="text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-amber-500 underline"
              >
                Read Scapular Plane Deltoid Mechanics
              </Link>
            </div>
          </div>

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
