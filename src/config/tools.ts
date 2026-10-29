export interface FitnessTool {
  id: string;
  name: string;
  slug: string;
  href: string;
  badge: string;
  category: string;
  categorySlug: 'tracking' | 'calculators' | 'health';
  shortDescription: string;
  fullDescription: string;
  iconName: 'Dumbbell' | 'Scale' | 'Activity' | 'Flame' | 'Timer' | 'Sparkles';
  features: string[];
  stats: { label: string; value: string }[];
  isAvailable: boolean;
  isFeatured: boolean;
  ctaText: string;
}

export const FITNESS_TOOLS: FitnessTool[] = [
  {
    id: 'ppl-tracker',
    name: 'PPL Workout Tracker',
    slug: 'ppl-tracker',
    href: '/tools/ppl-tracker',
    badge: 'Hypertrophy Engine',
    category: 'Workout Tracking',
    categorySlug: 'tracking',
    shortDescription:
      'Science-backed 6-day Push/Pull/Legs hypertrophy progressive overload engine with auto rest timers & plate math.',
    fullDescription:
      'Execute Push, Pull, and Legs sessions with day-specific smart scheduling, lagging weak-point tailoring, automatic rest intervals, Olympic barbell plate calculations, and double progression tracking.',
    iconName: 'Dumbbell',
    features: [
      'Day-specific calendar detection for 6-day PPL, Bro-Split, Upper/Lower & Full Body',
      'Automated double progression detection when rep ceilings are cleared',
      'Integrated Web Audio countdown timer with customizable interval beeps',
      'Olympic barbell plate calculator (20kg / 15kg / 10kg / 5kg / fractional sleeves)',
      'Local-first offline storage + optional Supabase cloud history sync',
      'Interactive 3D muscle anatomy visualizer for target muscle priming',
    ],
    stats: [
      { label: 'Supported Splits', value: '4 Programs' },
      { label: 'Plate Precision', value: 'To 1.25 kg/lb' },
      { label: 'Cloud Sync', value: 'Supabase Realtime' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Launch Tracker',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    href: '/tools/bmi-calculator',
    badge: 'Body Composition',
    category: 'Health & Body Composition',
    categorySlug: 'calculators',
    shortDescription:
      'Body Mass Index screening tool supporting Metric (cm/kg) and Imperial (ft/in/lb) units with visual gauge.',
    fullDescription:
      'Calculate Body Mass Index instantly with dual-unit support, interactive visual categorization gauge, healthy weight range target estimates, and dedicated clinical caveats for muscular athletes.',
    iconName: 'Scale',
    features: [
      'Dual unit modes: Metric (cm / kg) and Imperial (ft + in / lbs)',
      'Interactive visual spectrum gauge (Underweight to Obese Class III)',
      'Dynamic healthy weight range guidance based on individual height',
      'Evidence-based clinical caveat explaining muscle mass vs. fat mass for lifters',
      'Quick test presets, input validation, and instant reset functionality',
      'Mobile-optimized touch inputs with zero layout shift',
    ],
    stats: [
      { label: 'Unit Systems', value: 'Metric & Imperial' },
      { label: 'WHO Categories', value: '6 Tiers' },
      { label: 'Athlete Guidance', value: 'Hypertrophy Context' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate BMI',
  },
];

export const UPCOMING_TOOLS: Array<{
  name: string;
  badge: string;
  category: string;
  description: string;
  iconName: 'Activity' | 'Flame' | 'Timer';
  eta: string;
}> = [
  {
    name: 'One-Rep Max (1RM) Estimator',
    badge: 'Strength Formula',
    category: 'Strength & Power',
    description:
      'Calculate accurate 1RM percentages using Brzycki, Epley, and Wathan equations across rep ranges 1 to 10.',
    iconName: 'Flame',
    eta: 'In Development',
  },
  {
    name: 'TDEE & Macro Energy Calculator',
    badge: 'Sports Nutrition',
    category: 'Nutrition & Energy',
    description:
      'Mifflin-St Jeor & Katch-McArdle metabolic formulas calibrated for hypertrophy surplus or lean cutting phases.',
    iconName: 'Activity',
    eta: 'Planned',
  },
  {
    name: 'Barbell Plate Math Standalone',
    badge: 'Gym Utility',
    category: 'Gym Utilities',
    description:
      'Quick sleeve loader for Olympic barbells, safety squat bars, and trap bars with custom plate inventory.',
    iconName: 'Timer',
    eta: 'Planned',
  },
];
