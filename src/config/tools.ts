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
  {
    id: 'strength-score-calculator',
    name: 'Powerlifting Strength Score Calculator',
    slug: 'strength-score-calculator',
    href: '/tools/strength-score-calculator',
    badge: 'DOTS / Wilks Standard',
    category: 'Strength & Overload',
    categorySlug: 'calculators',
    shortDescription:
      'Compare pound-for-pound strength across bodyweights using official DOTS, Wilks, and IPF GL powerlifting formulas.',
    fullDescription:
      'Evaluate your 3-lift total (Squat, Bench Press, and Deadlift) against official powerlifting federation standards. Computes Tim Konertz DOTS (USAPL standard), classic Robert Wilks (1994), and IPF GoodLift points with strength classification tiers.',
    iconName: 'Dumbbell',
    features: [
      'Computes DOTS points (Tim Konertz 2019 fourth-degree polynomial USAPL standard)',
      'Calculates classic Wilks score and modern IPF GoodLift points for raw lifting',
      'Benchmark tiers from Novice to International Competitor with percentiles',
      'Dual modes: enter Squat / Bench / Deadlift individually or direct 3-lift total',
      'Full Metric (kg) and Imperial (lbs) unit toggle with automatic load conversions',
      'Visual lift ratio distribution breakdown (% of total from Squat, Bench, Deadlift)',
    ],
    stats: [
      { label: 'Formulas', value: 'DOTS, Wilks, IPF GL' },
      { label: 'Standards', value: 'USAPL & IPF' },
      { label: 'Tiers', value: '5 Competitor Ranks' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate Strength Score',
  },
  {
    id: 'warmup-calculator',
    name: 'Barbell Warm-Up Set Calculator',
    slug: 'warmup-calculator',
    href: '/tools/warmup-calculator',
    badge: 'Neural Potentiation',
    category: 'Workout Tracking',
    categorySlug: 'tracking',
    shortDescription:
      'Generate structured, non-fatiguing warm-up set ladders and exact plate loading per side.',
    fullDescription:
      'Prime your nervous system, increase joint synovial fluid, and groove motor patterns without accumulating muscular fatigue. Generates ramping warm-up ladders snapped to achievable gym plate increments based on openGym algorithms.',
    iconName: 'Flame',
    features: [
      'Inverse rep-ramp algorithm priming motor pathways without lactate accumulation',
      'Snaps weights to achievable barbell plate combinations (2.5kg or 5lb steps)',
      'Visual plate loading graphic for every warm-up set per sleeve',
      'Support for 20kg/45lb Olympic, 15kg/35lb Women’s, and 25kg Trap bars',
      'Physiological cue guidance explaining joint lubrication and neural potentiation',
      'Direct integration with PPL Workout Tracker to add warmups into exercises',
    ],
    stats: [
      { label: 'Plate Precision', value: 'Snapped to 2.5kg/5lb' },
      { label: 'Ramping Algorithm', value: 'Inverse Rep Ramp' },
      { label: 'Rest Guidance', value: 'Interval Timers' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate Warm-Ups',
  },
  {
    id: 'workout-importer',
    name: 'Workout CSV / History Importer',
    slug: 'workout-importer',
    href: '/tools/workout-importer',
    badge: 'Data Migration',
    category: 'Workout Tracking',
    categorySlug: 'tracking',
    shortDescription:
      'Migrate workout history from Strong, Hevy, FitNotes, openGym, or CSV into PPL Tracker with zero data lock-in.',
    fullDescription:
      'Never lose your completed workout logs when switching apps. Drag and drop CSV export files from Hevy, Strong, FitNotes, openGym, or standard spreadsheets to import completed sessions, sets, weights, and reps directly into PPL Tracker.',
    iconName: 'Sparkles',
    features: [
      'Auto-detects CSV headers for Strong, Hevy, FitNotes, openGym, and generic spreadsheets',
      'Interactive preview table showing sessions, total volume, dates, and mapped exercises',
      'Merges imported sessions cleanly into local storage without overwriting existing PRs',
      'Fuzzy exercise resolver mapping commercial app exercise names to standard movements',
      '100% client-side privacy: no workout files leave your browser',
      'Step-by-step export guides for Hevy, Strong, and FitNotes included',
    ],
    stats: [
      { label: 'Supported Apps', value: 'Hevy, Strong, FitNotes' },
      { label: 'Privacy', value: '100% Client-Side' },
      { label: 'Deduplication', value: 'Auto-Merged' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Import Workouts',
  },
  {
    id: 'body-fat-calculator',
    name: 'US Navy Body Fat Calculator',
    slug: 'body-fat-calculator',
    href: '/tools/body-fat-calculator',
    badge: 'Body Composition',
    category: 'Health & Body Composition',
    categorySlug: 'health',
    shortDescription:
      'Estimate body fat percentage, lean body mass, and fat mass using the validated circumference method.',
    fullDescription:
      'Calculate body fat percentage using the clinical US Navy circumference method (Hodgdon & Beckett 1984). Measures neck, waist, height (and hip for females) to isolate adipose fat mass from lean muscle mass without expensive DEXA scans.',
    iconName: 'Scale',
    features: [
      'Clinically validated US Navy circumference method (Hodgdon & Beckett, 1984)',
      'Calculates Body Fat %, Total Fat Mass, and Lean Body Mass (LBM)',
      'Male and female gender-specific density equations',
      'Interactive visual body composition category classification (Athletes, Fitness, Average)',
      'Dual unit support: Metric (cm / kg) and Imperial (in / lbs)',
      'Actionable nutritional recommendations for recomposition, cutting, and lean bulking',
    ],
    stats: [
      { label: 'Formula', value: 'Hodgdon & Beckett 1984' },
      { label: 'Accuracy', value: 'Within 3–4% of DEXA' },
      { label: 'Metrics', value: 'LBM, Fat Mass, %BF' },
    ],
    isAvailable: true,
    isFeatured: true,
    ctaText: 'Calculate Body Fat',
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
