import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Calculator,
  Dumbbell,
  Flame,
  Scale,
  Sparkles,
  Timer,
} from 'lucide-react';

export interface RecommendedToolCard {
  href: string;
  name: string;
  badge: string;
  description: string;
  ctaLabel: string;
  icon: 'scale' | 'activity' | 'flame' | 'dumbbell' | 'timer' | 'sparkles';
}

const TOOL_CATALOG: Record<string, RecommendedToolCard> = {
  '/tools/body-fat-calculator': {
    href: '/tools/body-fat-calculator',
    name: 'US Navy Body Fat Calculator',
    badge: 'Body Composition',
    description:
      'Estimate body fat percentage, fat mass, and lean body mass using the Hodgdon & Beckett circumference equation for men and women.',
    ctaLabel: 'Calculate US Navy BF%',
    icon: 'scale',
  },
  '/tools/ffmi-calculator': {
    href: '/tools/ffmi-calculator',
    name: 'FFMI Calculator (Men & Women)',
    badge: 'Natural Potential',
    description:
      'Calculate raw and height-normalized Fat-Free Mass Index (FFMI) and Fat Mass Index against natural male and female reference tiers.',
    ctaLabel: 'Calculate FFMI',
    icon: 'scale',
  },
  '/tools/bmi-calculator': {
    href: '/tools/bmi-calculator',
    name: 'BMI & Athletic Lean Mass Context',
    badge: 'Clinical Screening',
    description:
      'Compute Body Mass Index in metric or imperial units and see how high skeletal muscle mass affects standard WHO thresholds.',
    ctaLabel: 'Check BMI Context',
    icon: 'scale',
  },
  '/tools/tdee-calculator': {
    href: '/tools/tdee-calculator',
    name: 'TDEE & Macro Split Calculator',
    badge: 'Sports Nutrition',
    description:
      'Calculate maintenance calories via Mifflin-St Jeor or Katch-McArdle alongside 1.6–2.2 g/kg daily protein targets.',
    ctaLabel: 'Calculate TDEE & Macros',
    icon: 'activity',
  },
  '/tools/one-rep-max-calculator': {
    href: '/tools/one-rep-max-calculator',
    name: '1RM & Training % Calculator',
    badge: 'Strength Standards',
    description:
      'Estimate your true One-Rep Max across Epley, Brzycki, and Lombardi equations with an instant 60%–100% rep-max chart.',
    ctaLabel: 'Calculate 1RM',
    icon: 'flame',
  },
  '/tools/rpe-calculator': {
    href: '/tools/rpe-calculator',
    name: 'RPE & RIR Load Estimator',
    badge: 'Autoregulation',
    description:
      'Convert RPE (6.0–10.0) and Reps in Reserve (0–4 RIR) into exact daily readiness working weights and overload targets.',
    ctaLabel: 'Estimate RPE Load',
    icon: 'timer',
  },
  '/tools/strength-score-calculator': {
    href: '/tools/strength-score-calculator',
    name: 'DOTS, Wilks & IPF GL Calculator',
    badge: 'Powerlifting Score',
    description:
      'Benchmark your 3-lift Squat, Bench, and Deadlift total pound-for-pound across official USAPL DOTS and IPF GoodLift tiers.',
    ctaLabel: 'Score Strength Total',
    icon: 'dumbbell',
  },
  '/tools/warmup-calculator': {
    href: '/tools/warmup-calculator',
    name: 'Barbell Warm-Up Ramp Calculator',
    badge: 'Neural Potentiation',
    description:
      'Generate non-fatiguing ramp sets snapped to real gym plates so your nervous system is primed before top working sets.',
    ctaLabel: 'Build Warm-Up Ramp',
    icon: 'flame',
  },
  '/tools/plate-calculator': {
    href: '/tools/plate-calculator',
    name: 'Barbell Plate Loader Calculator',
    badge: 'Gym Utility',
    description:
      'Visualize exact per-side competition plate loading for 20 kg / 45 lb Olympic, women’s, EZ-curl, and trap barbells.',
    ctaLabel: 'Load Barbell Plates',
    icon: 'dumbbell',
  },
  '/tools/workout-substitution-finder': {
    href: '/tools/workout-substitution-finder',
    name: 'Exercise Substitution Finder',
    badge: 'Biomechanical Match',
    description:
      'Find joint-friendly and equipment-matched PPL exercise alternatives when racks, cables, or machines are unavailable.',
    ctaLabel: 'Find Exercise Swaps',
    icon: 'sparkles',
  },
  '/tools/workout-importer': {
    href: '/tools/workout-importer',
    name: 'Workout CSV History Importer',
    badge: 'Data Migration',
    description:
      'Import workout history CSVs from Hevy, Strong, or FitNotes directly into PPL Tracker to protect your overload trends.',
    ctaLabel: 'Import Workout CSV',
    icon: 'sparkles',
  },
  '/tools/ppl-tracker': {
    href: '/tools/ppl-tracker',
    name: 'PPL Workout Tracker',
    badge: 'Overload Engine',
    description:
      'Log sets, reps, RIR, and rest timers across Push/Pull/Legs, Upper/Lower, Full Body, or Bro-Split routines.',
    ctaLabel: 'Launch Workout Tracker',
    icon: 'dumbbell',
  },
};

const CLUSTER_DEFAULT_TOOLS: Record<string, string[]> = {
  'Fat Loss & Recomp': [
    '/tools/body-fat-calculator',
    '/tools/ffmi-calculator',
    '/tools/tdee-calculator',
    '/tools/bmi-calculator',
  ],
  "Women's Strength": [
    '/tools/body-fat-calculator',
    '/tools/ffmi-calculator',
    '/tools/bmi-calculator',
    '/tools/tdee-calculator',
  ],
  'Sports Nutrition': [
    '/tools/tdee-calculator',
    '/tools/ffmi-calculator',
    '/tools/body-fat-calculator',
    '/tools/bmi-calculator',
  ],
  'Push (Chest)': [
    '/tools/ffmi-calculator',
    '/tools/rpe-calculator',
    '/tools/one-rep-max-calculator',
    '/tools/workout-substitution-finder',
  ],
  'Pull (Back)': [
    '/tools/ffmi-calculator',
    '/tools/workout-substitution-finder',
    '/tools/rpe-calculator',
    '/tools/one-rep-max-calculator',
  ],
  'Legs (Squat)': [
    '/tools/one-rep-max-calculator',
    '/tools/strength-score-calculator',
    '/tools/rpe-calculator',
    '/tools/warmup-calculator',
  ],
  Calisthenics: [
    '/tools/workout-substitution-finder',
    '/tools/ffmi-calculator',
    '/tools/body-fat-calculator',
    '/tools/rpe-calculator',
  ],
  'Prehab & Mobility': [
    '/tools/workout-substitution-finder',
    '/tools/warmup-calculator',
    '/tools/rpe-calculator',
    '/tools/plate-calculator',
  ],
  'Endurance & Cardio': [
    '/tools/body-fat-calculator',
    '/tools/tdee-calculator',
    '/tools/bmi-calculator',
    '/tools/workout-importer',
  ],
  'Longevity & Health': [
    '/tools/body-fat-calculator',
    '/tools/ffmi-calculator',
    '/tools/bmi-calculator',
    '/tools/strength-score-calculator',
  ],
  'Gym Mindset': [
    '/tools/workout-importer',
    '/tools/rpe-calculator',
    '/tools/body-fat-calculator',
    '/tools/ffmi-calculator',
  ],
};

function selectContextTools(params: {
  splitCategory: string;
  title: string;
  slug: string;
  excerpt?: string;
}): RecommendedToolCard[] {
  const haystack = `${params.title} ${params.slug} ${params.excerpt || ''}`.toLowerCase();
  const baseOrder =
    CLUSTER_DEFAULT_TOOLS[params.splitCategory] || [
      '/tools/body-fat-calculator',
      '/tools/ffmi-calculator',
      '/tools/one-rep-max-calculator',
      '/tools/tdee-calculator',
    ];

  const prioritized: string[] = [];
  const pushUnique = (href: string) => {
    if (TOOL_CATALOG[href] && !prioritized.includes(href)) {
      prioritized.push(href);
    }
  };

  if (/\b(body fat|recomp|recomposition|waist|glp-1|plateau|fat loss|cutting|deficit|navy)\b/.test(haystack)) {
    pushUnique('/tools/body-fat-calculator');
    pushUnique('/tools/ffmi-calculator');
  }
  if (/\b(ffmi|hypertrophy|muscle|toned|lean|protein|bulk|bulky|clavicular|lat|delt)\b/.test(haystack)) {
    pushUnique('/tools/ffmi-calculator');
  }
  if (/\b(plate|pin squat|90%|deload|warmup|warm-up)\b/.test(haystack)) {
    if (/\b(plate|90%)\b/.test(haystack)) pushUnique('/tools/plate-calculator');
    if (/\b(warmup|warm-up|prehab)\b/.test(haystack)) pushUnique('/tools/warmup-calculator');
  }
  if (/\b(1rm|one-rep|squat|bench|deadlift|rdl|dup|linear)\b/.test(haystack)) {
    pushUnique('/tools/one-rep-max-calculator');
  }
  if (/\b(rpe|rir|vbt|autoregulation)\b/.test(haystack)) {
    pushUnique('/tools/rpe-calculator');
  }

  for (const href of baseOrder) {
    pushUnique(href);
  }

  return prioritized.slice(0, 4).map((href) => TOOL_CATALOG[href]);
}

function renderIcon(icon: RecommendedToolCard['icon']) {
  switch (icon) {
    case 'scale':
      return <Scale className="w-4 h-4 text-[#36D6B0]" />;
    case 'activity':
      return <Activity className="w-4 h-4 text-sky-400" />;
    case 'flame':
      return <Flame className="w-4 h-4 text-orange-400" />;
    case 'timer':
      return <Timer className="w-4 h-4 text-purple-400" />;
    case 'sparkles':
      return <Sparkles className="w-4 h-4 text-[#B7FF4A]" />;
    default:
      return <Dumbbell className="w-4 h-4 text-[#B7FF4A]" />;
  }
}

interface RelatedToolsCardProps {
  splitCategory: string;
  title: string;
  slug: string;
  excerpt?: string;
}

export function RelatedToolsCard({
  splitCategory,
  title,
  slug,
  excerpt,
}: RelatedToolsCardProps) {
  const tools = selectContextTools({ splitCategory, title, slug, excerpt });

  return (
    <section
      aria-labelledby="related-calculators-heading"
      className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5 shadow-sm card-bento"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <Calculator className="w-4 h-4" /> Recommended Evidence-Based Calculators
          </div>
          <h2
            id="related-calculators-heading"
            className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-[var(--text-primary)]"
          >
            Put {splitCategory || 'Training'} Metrics Into Action
          </h2>
        </div>

        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent-primary)] hover:underline whitespace-nowrap"
        >
          All 12 Fitness Calculators <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group p-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 transition-all flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  {renderIcon(tool.icon)}
                  <span>{tool.name}</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] shrink-0">
                  {tool.badge}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {tool.description}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[var(--accent-primary)] group-hover:translate-x-0.5 transition-transform">
              {tool.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
