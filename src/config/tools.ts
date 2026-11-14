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
  {
    id: 'workout-substitution-finder',
    name: 'Workout Substitution Finder',
    slug: 'workout-substitution-finder',
    href: '/tools/workout-substitution-finder',
    badge: 'Biomechanical Engine',
    category: 'Workout Tracking',
    categorySlug: 'tracking',
    shortDescription:
      'Deterministic gym exercise alternative engine matching target muscles, movement patterns, and open gym equipment.',
    fullDescription:
      'Never lose workout momentum when machines or squat racks are taken. Find instant, biomechanically matched exercise substitutes filtered by available equipment, target muscles, and training goals.',
    iconName: 'Sparkles',
    features: [
      'Deterministic matching engine weighting muscle recruitment, patterns, and equipment',
      'Configurable equipment filters (Dumbbells, Barbells, Cables, Machines, Bodyweight, Bands)',
      'Training goal prioritization (Hypertrophy, Max Strength, General Fitness, Home Workout)',
      'Biomechanical explanations explaining joint kinematics and resistance curve nuances',
      'Detailed form execution instructions, critical cues, and stabilization profiles',
      'One-click integration to substitute exercises directly into the PPL Workout Tracker',
    ],
    stats: [
      'Database: 50+ Exercises',
      'Filter Modes: Multi-Equipment',
      'Algorithm: Deterministic',
    ].map((s) => {
      const [label, value] = s.split(': ');
      return { label, value };
    }),
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Find Substitutes',
  },
  {
    id: 'one-rep-max-calculator',
    name: '1RM & Training % Calculator',
    slug: 'one-rep-max-calculator',
    href: '/tools/one-rep-max-calculator',
    badge: 'Strength Formula',
    category: 'Strength & Overload',
    categorySlug: 'calculators',
    shortDescription:
      'Estimate your true One-Rep Max using Epley, Brzycki, Lombardi & O’Conner equations with a 60%–95% rep-max table.',
    fullDescription:
      'Compute your estimated One-Rep Max (e1RM) from any submaximal working set and generate an instant training percentage breakdown table (60% to 95%+) calibrated for peaking, myofibrillar strength, and hypertrophy.',
    iconName: 'Flame',
    features: [
      'Multi-formula comparison across Epley, Brzycki, Lombardi, O’Conner, and 4-Formula Consensus Average',
      'Full training percentage breakdown table from 60% to 100% 1RM with corresponding rep-max brackets',
      'Instant Metric (kg) and Imperial (lbs) unit conversion with quick-select compound lift presets',
      'Training zone prescriptions (Neural Peaking, Heavy Strength, Myofibrillar Hypertrophy, Metabolic Volume)',
      'Direct progression targets to plug straight into your PPL Workout Tracker session',
    ],
    stats: [
      { label: 'Formulas', value: 'Epley & Brzycki+' },
      { label: 'Load Table', value: '60% – 100% 1RM' },
      { label: 'Unit Support', value: 'KG & LBS' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate 1RM',
  },
  {
    id: 'tdee-calculator',
    name: 'TDEE & Macro Split Calculator',
    slug: 'tdee-calculator',
    href: '/tools/tdee-calculator',
    badge: 'Sports Nutrition',
    category: 'Nutrition & Energy',
    categorySlug: 'health',
    shortDescription:
      'Calculate BMR and Total Daily Energy Expenditure (Mifflin-St Jeor & Katch-McArdle) with custom macro presets.',
    fullDescription:
      'Determine your exact Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor or lean-mass Katch-McArdle equations, complete with evidence-based macronutrient splits for cutting, recomposition, and lean bulking.',
    iconName: 'Activity',
    features: [
      'Dual metabolic equations: Mifflin-St Jeor (standard) and Katch-McArdle (when body fat % is provided)',
      'Calorie phase presets for Aggressive Cut (-20%), Moderate Cut (-15%), Maintenance/Recomp, and Lean Bulk (+10%)',
      'Customizable macronutrient presets (Balanced Hypertrophy, High-Protein Cut, High-Carb Performance, Low-Carb)',
      'Automatic protein-per-kilogram (g/kg) verification against ISSN 1.6–2.2g/kg hypertrophy thresholds',
      'Dual unit support for Metric (cm/kg) and Imperial (ft/in/lbs) lifters',
    ],
    stats: [
      { label: 'Equations', value: 'Mifflin & Katch' },
      { label: 'Goal Phases', value: 'Cut / Recomp / Bulk' },
      { label: 'Protein Target', value: '1.6–2.2g / kg' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate TDEE',
  },
  {
    id: 'plate-calculator',
    name: 'Barbell Plate Loader Calculator',
    slug: 'plate-calculator',
    href: '/tools/plate-calculator',
    badge: 'Gym Utility',
    category: 'Workout Tracking',
    categorySlug: 'tracking',
    shortDescription:
      'Visual barbell sleeve breakdown showing exact competition plates needed per side for any target weight.',
    fullDescription:
      'Eliminate gym math errors between heavy sets. Select your barbell type, toggle available gym plate inventory, and visualize the exact per-side sleeve loading in kilograms or pounds—or use Reverse Mode to sum plates already on the bar.',
    iconName: 'Dumbbell',
    features: [
      'Interactive visual barbell sleeve graphic with calibrated IPF/IWF competition plate colors',
      'Supports 20kg/45lb Olympic, 15kg/35lb Women’s, 10kg/25lb EZ-Curl, and 25kg/55lb Trap Bars',
      'Customizable gym plate inventory toggles (enable or disable 25kg, 20kg, 15kg, 10kg, 5kg, 2.5kg, 1.25kg)',
      'Reverse Plate Counter mode: tap plates to calculate total loaded barbell weight instantly',
      'Warmup progression ladder generator (40%, 60%, 75%, 85%, 100% working weight) with plate loads',
    ],
    stats: [
      { label: 'Barbell Types', value: '4 Standard Bars' },
      { label: 'Modes', value: 'Target & Reverse' },
      { label: 'Warmup Sets', value: 'Auto-Generated' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Load Barbell',
  },
  {
    id: 'rpe-calculator',
    name: 'RPE / RIR Load Estimator',
    slug: 'rpe-calculator',
    href: '/tools/rpe-calculator',
    badge: 'Autoregulation',
    category: 'Strength & Overload',
    categorySlug: 'calculators',
    shortDescription:
      'Convert Rate of Perceived Exertion (RPE 6–10) and Reps in Reserve (0–4 RIR) into working weights and overload targets.',
    fullDescription:
      'Autoregulate your training intensity with precision. Enter a completed reference set (Weight × Reps @ RPE) to compute your daily readiness 1RM, recommended working weight for any target rep/RPE prescription, and next-session progressive overload load.',
    iconName: 'Timer',
    features: [
      'Seamless conversion between Rate of Perceived Exertion (RPE 6.0–10.0) and Reps in Reserve (0–4 RIR)',
      'Calculates daily readiness e1RM and prescribes exact working weights for back-off or top sets',
      'Interactive RPE-to-%1RM reference matrix across 1 to 12 reps and RPE 6.5 to 10.0',
      'Automatic +2.5% progressive overload target calculation for your next microcycle session',
      'Supports both Metric (kg) and Imperial (lbs) with half-RPE step precision',
    ],
    stats: [
      { label: 'RPE Scale', value: '6.0 to 10.0 RPE' },
      { label: 'RIR Mapping', value: '0 to 4 RIR' },
      { label: 'Reference Matrix', value: '1–12 Rep Chart' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Estimate RPE Load',
  },
  {
    id: 'ffmi-calculator',
    name: 'FFMI & Body Comp Estimator',
    slug: 'ffmi-calculator',
    href: '/tools/ffmi-calculator',
    badge: 'Muscular Potential',
    category: 'Health & Body Composition',
    categorySlug: 'health',
    shortDescription:
      'Calculate Fat-Free Mass Index (FFMI), normalized lean mass, and natural genetic muscular potential benchmarks.',
    fullDescription:
      'Unlike standard BMI, Fat-Free Mass Index (FFMI) isolates skeletal muscle and lean tissue from adipose fat. Calculate your raw FFMI, height-normalized FFMI, total lean body mass, and natural genetic potential projections at 10%, 12%, and 15% body fat.',
    iconName: 'Scale',
    features: [
      'Computes Total Lean Body Mass (LBM), Fat Mass, Raw FFMI, and Height-Normalized FFMI (Kouri et al., 1995)',
      'Interactive natural muscular potential spectrum gauge benchmarked for male and female lifters',
      'Goal physique weight projections at 10%, 12%, 15%, and 18% body fat for your current lean mass',
      'Visual body fat percentage reference guide to help estimate body composition accurately',
      'Full Metric (cm/kg) and Imperial (ft/in/lbs) unit switching',
    ],
    stats: [
      { label: 'Normalized Scale', value: '1.80m Calibrated' },
      { label: 'Natural Benchmark', value: 'Up to ~25 FFMI' },
      { label: 'Projections', value: 'Multi-Bodyfat Tiers' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate FFMI',
  },
];

export const UPCOMING_TOOLS: Array<{
  name: string;
  badge: string;
  category: string;
  description: string;
  iconName: 'Activity' | 'Flame' | 'Timer';
  eta: string;
}> = [];
