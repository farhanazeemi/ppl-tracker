import { ExerciseSet } from '../types/workout';

/**
 * Calculates estimated One-Rep Max using the Epley formula:
 * 1RM = Weight * (1 + Reps / 30)
 * Sanitizes against negative values, non-finite values, and NaN.
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(reps) || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Checks if all working completed sets hit the max rep threshold (Double Progression achieved!)
 * In progressive overload, all prescribed working sets must be marked completed AND hit or exceed maxReps.
 */
export function checkDoubleProgression(sets: ExerciseSet[], maxReps: number): boolean {
  const workingSets = sets.filter(s => !s.isWarmup);
  if (workingSets.length === 0) return false;
  return workingSets.every(
    s => s.completed && typeof s.reps === 'number' && Number.isFinite(s.reps) && s.reps >= maxReps
  );
}

/**
 * Calculate total volume for a list of sets: sum of weight * reps.
 * Strictly ignores non-completed sets, NaN, negative, or non-finite values.
 */
export function calculateExerciseVolume(sets: ExerciseSet[]): number {
  return sets.reduce((acc, curr) => {
    if (
      curr.completed &&
      typeof curr.weight === 'number' &&
      Number.isFinite(curr.weight) &&
      curr.weight > 0 &&
      typeof curr.reps === 'number' &&
      Number.isFinite(curr.reps) &&
      curr.reps > 0
    ) {
      return acc + curr.weight * curr.reps;
    }
    return acc;
  }, 0);
}

/**
 * Plate breakdown calculator for a barbell with a standard 20kg bar (or custom bar)
 */
export interface PlateCalculationResult {
  targetWeight: number;
  barWeight: number;
  weightPerSide: number;
  platesPerSide: { weight: number; count: number }[];
  remainder: number;
}

export function calculatePlates(
  targetWeight: number,
  barWeight: number = 20,
  availablePlates: number[] = [25, 20, 15, 10, 5, 2.5, 1.25]
): PlateCalculationResult {
  const safeTarget = Number.isFinite(targetWeight) && targetWeight > 0 ? targetWeight : 0;
  const safeBar = Number.isFinite(barWeight) && barWeight >= 0 ? barWeight : 20;

  if (safeTarget <= safeBar) {
    return {
      targetWeight: safeTarget,
      barWeight: safeBar,
      weightPerSide: 0,
      platesPerSide: [],
      remainder: 0,
    };
  }

  let sideWeight = (safeTarget - safeBar) / 2;
  const platesPerSide: { weight: number; count: number }[] = [];

  for (const plate of availablePlates) {
    if (sideWeight >= plate) {
      const count = Math.floor(sideWeight / plate);
      if (count > 0) {
        platesPerSide.push({ weight: plate, count });
        sideWeight = Math.round((sideWeight - count * plate) * 100) / 100;
      }
    }
  }

  return {
    targetWeight: safeTarget,
    barWeight: safeBar,
    weightPerSide: (safeTarget - safeBar) / 2,
    platesPerSide,
    remainder: sideWeight,
  };
}

export function formatTime(seconds: number): string {
  const safeSecs = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const mins = Math.floor(safeSecs / 60);
  const secs = safeSecs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Multi-formula One-Rep Max (1RM) & Training Percentage Suite
 */
export interface OneRepMaxPercentageRow {
  percent: number;
  weight: number;
  estReps: string;
  zone: string;
}

export interface OneRepMaxSuiteResult {
  epley: number;
  brzycki: number;
  lombardi: number;
  oconner: number;
  average: number;
  percentages: OneRepMaxPercentageRow[];
}

export function calculateOneRepMaxSuite(
  weight: number,
  reps: number,
  selectedFormula: 'epley' | 'brzycki' | 'lombardi' | 'oconner' | 'average' = 'epley'
): OneRepMaxSuiteResult {
  if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(reps) || reps <= 0) {
    return {
      epley: 0,
      brzycki: 0,
      lombardi: 0,
      oconner: 0,
      average: 0,
      percentages: [],
    };
  }

  const clampedReps = Math.min(30, Math.max(1, Math.round(reps)));
  const epley = clampedReps === 1 ? weight : Math.round(weight * (1 + clampedReps / 30) * 10) / 10;
  const brzycki =
    clampedReps === 1
      ? weight
      : Math.round(weight * (36 / Math.max(1, 37 - clampedReps)) * 10) / 10;
  const lombardi =
    clampedReps === 1 ? weight : Math.round(weight * Math.pow(clampedReps, 0.1) * 10) / 10;
  const oconner =
    clampedReps === 1 ? weight : Math.round(weight * (1 + 0.025 * clampedReps) * 10) / 10;
  const average = Math.round(((epley + brzycki + lombardi + oconner) / 4) * 10) / 10;

  const baseMax =
    selectedFormula === 'brzycki'
      ? brzycki
      : selectedFormula === 'lombardi'
      ? lombardi
      : selectedFormula === 'oconner'
      ? oconner
      : selectedFormula === 'average'
      ? average
      : epley;

  const brackets: Array<{ percent: number; estReps: string; zone: string }> = [
    { percent: 100, estReps: '1 Rep', zone: 'True 1RM Peak' },
    { percent: 95, estReps: '2 Reps', zone: 'Maximal Neural Strength' },
    { percent: 90, estReps: '3–4 Reps', zone: 'Heavy Strength Overload' },
    { percent: 85, estReps: '5–6 Reps', zone: 'Myofibrillar Strength-Hypertrophy' },
    { percent: 80, estReps: '7–8 Reps', zone: 'Primary Hypertrophy Zone' },
    { percent: 75, estReps: '9–10 Reps', zone: 'Metabolic & Mechanical Hypertrophy' },
    { percent: 70, estReps: '11–12 Reps', zone: 'High-Volume Hypertrophy' },
    { percent: 65, estReps: '13–15 Reps', zone: 'Muscular Endurance & Pump' },
    { percent: 60, estReps: '16–20 Reps', zone: 'Metabolic Conditioning / Deload' },
  ];

  const percentages: OneRepMaxPercentageRow[] = brackets.map((b) => ({
    percent: b.percent,
    weight: Math.round(baseMax * (b.percent / 100) * 10) / 10,
    estReps: b.estReps,
    zone: b.zone,
  }));

  return { epley, brzycki, lombardi, oconner, average, percentages };
}

/**
 * TDEE & Macronutrient Split Calculator (Mifflin-St Jeor & Katch-McArdle)
 */
export interface TdeeMacroResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  formulaUsed: 'Mifflin-St Jeor' | 'Katch-McArdle';
  proteinGrams: number;
  proteinCalories: number;
  proteinPct: number;
  proteinPerKg: number;
  carbsGrams: number;
  carbsCalories: number;
  carbsPct: number;
  fatGrams: number;
  fatCalories: number;
  fatPct: number;
}

export function calculateTdeeAndMacros(params: {
  sex: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  activityMultiplier: number;
  goalAdjustmentPct: number;
  macroSplit: { proteinPct: number; carbsPct: number; fatPct: number };
  bodyFatPct?: number;
}): TdeeMacroResult {
  const safeAge = Number.isFinite(params.age) && params.age > 0 ? params.age : 28;
  const safeHeight = Number.isFinite(params.heightCm) && params.heightCm > 0 ? params.heightCm : 178;
  const safeWeight = Number.isFinite(params.weightKg) && params.weightKg > 0 ? params.weightKg : 78;
  const safeActivity =
    Number.isFinite(params.activityMultiplier) && params.activityMultiplier >= 1.1
      ? params.activityMultiplier
      : 1.55;

  let bmr = 0;
  let formulaUsed: 'Mifflin-St Jeor' | 'Katch-McArdle' = 'Mifflin-St Jeor';

  if (
    typeof params.bodyFatPct === 'number' &&
    Number.isFinite(params.bodyFatPct) &&
    params.bodyFatPct >= 3 &&
    params.bodyFatPct <= 60
  ) {
    const leanMassKg = safeWeight * (1 - params.bodyFatPct / 100);
    bmr = Math.round(370 + 21.6 * leanMassKg);
    formulaUsed = 'Katch-McArdle';
  } else {
    const base = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge;
    bmr = Math.round(params.sex === 'male' ? base + 5 : base - 161);
  }

  const tdee = Math.round(bmr * safeActivity);
  const rawTarget = Math.round(tdee * (1 + (params.goalAdjustmentPct || 0)));
  const targetCalories = Math.max(1200, rawTarget);

  const totalPct =
    (params.macroSplit.proteinPct || 30) +
    (params.macroSplit.carbsPct || 45) +
    (params.macroSplit.fatPct || 25);
  const pPct = Math.round(((params.macroSplit.proteinPct || 30) / totalPct) * 100);
  const fPct = Math.round(((params.macroSplit.fatPct || 25) / totalPct) * 100);
  const cPct = Math.max(0, 100 - pPct - fPct);

  const proteinCalories = Math.round(targetCalories * (pPct / 100));
  const fatCalories = Math.round(targetCalories * (fPct / 100));
  const carbsCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);
  const proteinPerKg = Math.round((proteinGrams / safeWeight) * 10) / 10;

  return {
    bmr,
    tdee,
    targetCalories,
    formulaUsed,
    proteinGrams,
    proteinCalories,
    proteinPct: pPct,
    proteinPerKg,
    carbsGrams,
    carbsCalories,
    carbsPct: cPct,
    fatGrams,
    fatCalories,
    fatPct: fPct,
  };
}

/**
 * RPE / RIR Percentage Lookup & Working Load Estimator (RTS / Helms Scale)
 */
const RPE_10_BASE_PCT: Record<number, number> = {
  1: 1.0,
  2: 0.955,
  3: 0.922,
  4: 0.892,
  5: 0.863,
  6: 0.837,
  7: 0.811,
  8: 0.786,
  9: 0.762,
  10: 0.739,
  11: 0.707,
  12: 0.68,
};

export function getRpePercentage(reps: number, rpe: number): number {
  const clampedReps = Math.min(12, Math.max(1, Math.round(reps)));
  const clampedRpe = Math.min(10, Math.max(6, Math.round(rpe * 2) / 2));
  const rir = 10 - clampedRpe;
  const effectiveReps = clampedReps + rir;

  if (effectiveReps <= 12 && RPE_10_BASE_PCT[Math.floor(effectiveReps)]) {
    const lower = Math.floor(effectiveReps);
    const upper = Math.min(12, Math.ceil(effectiveReps));
    const baseLower = RPE_10_BASE_PCT[lower] || 0.68;
    const baseUpper = RPE_10_BASE_PCT[upper] || 0.68;
    const fraction = effectiveReps - lower;
    return Math.round((baseLower - (baseLower - baseUpper) * fraction) * 1000) / 1000;
  }

  // Fallback for higher effective reps > 12
  return Math.max(0.5, Math.round((1 / (1 + effectiveReps / 30)) * 1000) / 1000);
}

export interface RpeCalculationResult {
  estimated1RM: number;
  performedPct1RM: number;
  targetPct1RM: number;
  recommendedWeight: number;
  overloadWeight: number;
  rir: number;
  targetRir: number;
}

export function calculateRpeWorkingLoad(params: {
  weight: number;
  reps: number;
  rpe: number;
  targetReps: number;
  targetRpe: number;
}): RpeCalculationResult {
  if (!Number.isFinite(params.weight) || params.weight <= 0) {
    return {
      estimated1RM: 0,
      performedPct1RM: 0,
      targetPct1RM: 0,
      recommendedWeight: 0,
      overloadWeight: 0,
      rir: 0,
      targetRir: 0,
    };
  }

  const performedPct = getRpePercentage(params.reps, params.rpe);
  const targetPct = getRpePercentage(params.targetReps, params.targetRpe);
  const estimated1RM = Math.round((params.weight / performedPct) * 10) / 10;
  const recommendedWeight = Math.round(estimated1RM * targetPct * 10) / 10;
  const overloadWeight = Math.round(recommendedWeight * 1.025 * 10) / 10;

  return {
    estimated1RM,
    performedPct1RM: Math.round(performedPct * 1000) / 10,
    targetPct1RM: Math.round(targetPct * 1000) / 10,
    recommendedWeight,
    overloadWeight,
    rir: Math.max(0, Math.round((10 - params.rpe) * 10) / 10),
    targetRir: Math.max(0, Math.round((10 - params.targetRpe) * 10) / 10),
  };
}

/**
 * FFMI (Fat-Free Mass Index) & Body Composition Estimator (Kouri et al., 1995)
 */
export interface FfmiResult {
  leanBodyMassKg: number;
  fatMassKg: number;
  rawFfmi: number;
  normalizedFfmi: number;
  category: string;
  naturalPotentialPct: number;
}

export function calculateFfmiMetrics(params: {
  heightCm: number;
  weightKg: number;
  bodyFatPct: number;
  sex: 'male' | 'female';
}): FfmiResult {
  if (
    !Number.isFinite(params.heightCm) ||
    params.heightCm <= 0 ||
    !Number.isFinite(params.weightKg) ||
    params.weightKg <= 0 ||
    !Number.isFinite(params.bodyFatPct) ||
    params.bodyFatPct < 2 ||
    params.bodyFatPct >= 70
  ) {
    return {
      leanBodyMassKg: 0,
      fatMassKg: 0,
      rawFfmi: 0,
      normalizedFfmi: 0,
      category: 'Invalid Input',
      naturalPotentialPct: 0,
    };
  }

  const heightM = params.heightCm / 100;
  const fatMassKg = Math.round(params.weightKg * (params.bodyFatPct / 100) * 10) / 10;
  const leanBodyMassKg = Math.round((params.weightKg - fatMassKg) * 10) / 10;
  const rawFfmi = Math.round((leanBodyMassKg / (heightM * heightM)) * 10) / 10;
  const normalizedFfmi = Math.round((rawFfmi + 6.1 * (1.8 - heightM)) * 10) / 10;

  const isMale = params.sex === 'male';
  let category = 'Average';
  if (isMale) {
    if (normalizedFfmi < 18) category = 'Below Average';
    else if (normalizedFfmi < 20) category = 'Average Recreational';
    else if (normalizedFfmi < 22) category = 'Intermediate Lifter';
    else if (normalizedFfmi < 23.5) category = 'Advanced Muscular';
    else if (normalizedFfmi <= 25.2) category = 'Elite Natural Peak';
    else category = 'Superior / Above Natural Limit';
  } else {
    if (normalizedFfmi < 14) category = 'Below Average';
    else if (normalizedFfmi < 16) category = 'Average Recreational';
    else if (normalizedFfmi < 18) category = 'Intermediate Lifter';
    else if (normalizedFfmi < 19.5) category = 'Advanced Muscular';
    else if (normalizedFfmi <= 21.2) category = 'Elite Natural Peak';
    else category = 'Superior / Above Natural Limit';
  }

  const naturalLimit = isMale ? 25.0 : 21.0;
  const baseline = isMale ? 16.0 : 13.0;
  const naturalPotentialPct = Math.min(
    100,
    Math.max(5, Math.round(((normalizedFfmi - baseline) / (naturalLimit - baseline)) * 100))
  );

  return {
    leanBodyMassKg,
    fatMassKg,
    rawFfmi,
    normalizedFfmi,
    category,
    naturalPotentialPct,
  };
}
