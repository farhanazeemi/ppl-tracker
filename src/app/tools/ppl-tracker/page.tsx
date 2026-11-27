import { safeJsonLd } from '@/lib/safeJsonLd';
import type { Metadata } from 'next';
import { PplTrackerApp } from '../../../components/PplTrackerApp';
import { ToolCrossLinksSection } from '../../../components/tools/ToolCrossLinksSection';
import { getPplTrackerToolSchema } from '../../../lib/schema';

const baseUrl = 'https://ppltracker.web.id';

export const metadata: Metadata = {
  title: 'Free PPL Workout Tracker — Log Sets & Overload',
  description:
    'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, double progression ceilings, and local-first cloud synchronization.',
  alternates: {
    canonical: '/tools/ppl-tracker',
  },
  openGraph: {
    title: 'Free PPL Workout Tracker — Log Sets & Overload | PPL Tracker',
    description:
      'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, double progression ceilings, and local-first cloud synchronization.',
    url: `${baseUrl}/tools/ppl-tracker`,
    siteName: 'PPL Hypertrophy Tracker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PPL Hypertrophy Tracker App & Progressive Overload Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PPL Workout Tracker — Log Sets & Overload | PPL Tracker',
    description:
      'Free 6-day Push-Pull-Legs workout app with automated rest timers, Olympic plate math, and double progression ceilings.',
    images: ['/og-image.png'],
  },
};

export default function PplTrackerPage() {
  const schema = getPplTrackerToolSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
      <PplTrackerApp initialView="app">
        <ToolCrossLinksSection
          heading="Training Calculators & Evidence-Based Splits"
          subheading="Connect your Push, Pull, and Legs workout logs with calibrated body composition diagnostics, 1RM/RPE load planners, and exercise biomechanics guides."
          reviewer={{
            name: 'Dr. Marcus Vance, Ph.D.',
            role: 'Lead Biomechanics Researcher & Exercise Physiologist',
            href: '/author/dr-marcus-vance',
            note: 'Reviewed 6-day Push-Pull-Legs volume landmarks, double-progression rep ceilings, and rest interval pacing.',
          }}
          tools={[
            {
              href: '/tools/body-fat-calculator',
              title: 'US Navy Body Fat Calculator',
              badge: 'Body Comp',
              description: 'Measure neck, waist, and hip circumferences to track fat loss and lean body mass.',
              anchorText: 'Estimate BF% with US Navy Body Fat Calculator',
            },
            {
              href: '/tools/ffmi-calculator',
              title: 'FFMI Calculator',
              badge: 'Muscle Ceiling',
              description: 'Calculate raw & 1.80m normalized Fat-Free Mass Index for male and female lifters.',
              anchorText: 'Calculate Fat-Free Mass Index (FFMI)',
            },
            {
              href: '/tools/bmi-calculator',
              title: 'BMI Calculator for Lifters',
              badge: 'Fat vs Muscle',
              description: 'Screen weight-to-height BMI alongside lean muscle caveats and healthy range targets.',
              anchorText: 'Check BMI vs lean mass context',
            },
            {
              href: '/tools/one-rep-max-calculator',
              title: '1RM & Percentage Calculator',
              badge: 'Load Targets',
              description: 'Estimate 1RM across Epley & Brzycki equations to set 75%–85% hypertrophy working loads.',
              anchorText: 'Estimate 1RM & working weight percentages',
            },
            {
              href: '/tools/rpe-calculator',
              title: 'RPE / RIR Load Estimator',
              badge: 'Autoregulation',
              description: 'Adjust daily working loads using RPE 6.5–10 and Reps in Reserve readiness.',
              anchorText: 'Autoregulate working weights via RPE',
            },
            {
              href: '/tools/workout-substitution-finder',
              title: 'Workout Substitution Finder',
              badge: 'PPL Swaps',
              description: 'Find instant biomechanical exercise alternatives when gym racks or cables are busy.',
              anchorText: 'Find exercise & PPL alternatives',
            },
          ]}
          articles={[
            {
              href: '/blog/lat-hypertrophy-tension-vs-metabolic-stress',
              title: 'Lat Hypertrophy Science: Tension vs Metabolic Stress',
              category: 'Pull (Back)',
              description: 'Maximize thoracic and iliac lat fiber recruitment on Pull A and Pull B sessions.',
              anchorText: 'Read lat hypertrophy science on tension vs metabolic stress',
            },
            {
              href: '/blog/romanian-deadlift-hamstring-glute-guide',
              title: 'Romanian Deadlift Biomechanics for Hamstring & Glutes',
              category: 'Legs (Squat)',
              description: 'Dial in hip-hinge tension and lengthened hamstring stimulus on Leg days.',
              anchorText: 'Read Romanian deadlift hamstring & glute mechanics',
            },
            {
              href: '/blog/high-bar-front-squat-linear-vs-dup',
              title: 'High-Bar & Front Squat: Linear vs DUP Periodization',
              category: 'Legs (Squat)',
              description: 'Compare linear vs undulating squat progression across multi-week training cycles.',
              anchorText: 'Compare linear vs DUP squat periodization',
            },
            {
              href: '/blog/behavioral-psychology-unbreakable-gym-habits',
              title: 'Behavioral Psychology Tricks for Unbreakable Gym Habits',
              category: 'Gym Mindset',
              description: 'Evidence-based habit cues and friction removal to keep your PPL streak intact.',
              anchorText: 'Build unbreakable gym habits with behavioral psychology',
            },
            {
              href: '/blog/debunking-bulky-myth-4-day-toned-program',
              title: 'Debunking the Bulky Myth: 4-Day Toned Strength Program',
              category: "Women's Strength",
              description: 'A 4-day Upper/Lower resistance split designed for lean muscle definition and strength.',
              anchorText: 'Explore the 4-day toned strength program',
            },
            {
              href: '/blog/12-week-zone-2-training-pacing-schedule',
              title: '12-Week Zone 2 Aerobic Base Training & Pacing Schedule',
              category: 'Endurance & Cardio',
              description: 'Layer low-fatigue Zone 2 conditioning onto lifting days without hurting leg recovery.',
              anchorText: 'Follow the 12-week Zone 2 pacing schedule',
            },
            {
              href: '/blog/test-track-vo2-max-without-lab-guide',
              title: 'How to Test & Track VO2 Max Without an Expensive Lab',
              category: 'Longevity & Health',
              description: 'Practical field protocols to benchmark aerobic capacity alongside hypertrophy training.',
              anchorText: 'Learn how to test VO2 max without a lab',
            },
          ]}
        />
      </PplTrackerApp>
    </>
  );
}
