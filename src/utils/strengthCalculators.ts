/**
 * Powerlifting Strength & Body Composition Scoring Engine
 * Adapted from and verified against openGym (DuarteSantos8/openGym: lib/calculators.js)
 * 
 * Formulations included:
 * - DOTS (Tim Konertz, 2019): USAPL and international federation standard
 * - Wilks (Robert Wilks, 1994): Classic powerlifting formula
 * - IPF GL Points (IPF, 2020): International Powerlifting Federation GoodLift points
 * - US Navy Body Fat % (Hodgdon & Beckett 1984)
 */

export const LB_TO_KG = 0.45359237;
export const KG_TO_LB = 2.2046226218;
export const CM_PER_IN = 2.54;

const num = (v: unknown): number => Number(v);
const isPositive = (v: unknown): boolean => Number.isFinite(num(v)) && num(v) > 0;
const round2 = (v: number): number => Math.round(v * 100) / 100;
const round1 = (v: number): number => Math.round(v * 10) / 10;

// ── DOTS Formula (Tim Konertz, 2019) ─────────────────────────────────────────
// Total × 500 / fourth-degree polynomial of body weight.
// Fitted on 40-210 kg for men and 40-150 kg for women.
const DOTS_COEFFS = {
  male: [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093],
  female: [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706],
};

const DOTS_BW_LIMITS = {
  male: [40, 210] as const,
  female: [40, 150] as const,
};

/**
 * Calculates DOTS score given total lifted (kg) and body weight (kg).
 */
export function calculateDots(totalKg: number, bwKg: number, sex: 'male' | 'female' = 'male'): number | null {
  if (!isPositive(totalKg) || !isPositive(bwKg)) return null;
  const k = sex === 'female' ? 'female' : 'male';
  const x = Math.min(Math.max(num(bwKg), DOTS_BW_LIMITS[k][0]), DOTS_BW_LIMITS[k][1]);
  const denominator = DOTS_COEFFS[k].reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
  if (denominator <= 0) return null;
  return round2((num(totalKg) * 500) / denominator);
}

// ── Wilks Formula (Robert Wilks, 1994) ─────────────────────────────────────────
// Total × 500 / fifth-degree polynomial of body weight.
const WILKS_COEFFS = {
  male: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8],
  female: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8],
};

const WILKS_BW_LIMITS = {
  male: [40, 201.9] as const,
  female: [26.51, 154.53] as const,
};

/**
 * Calculates Wilks score given total lifted (kg) and body weight (kg).
 */
export function calculateWilks(totalKg: number, bwKg: number, sex: 'male' | 'female' = 'male'): number | null {
  if (!isPositive(totalKg) || !isPositive(bwKg)) return null;
  const k = sex === 'female' ? 'female' : 'male';
  const x = Math.min(Math.max(num(bwKg), WILKS_BW_LIMITS[k][0]), WILKS_BW_LIMITS[k][1]);
  const denominator = WILKS_COEFFS[k].reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
  if (denominator <= 0) return null;
  return round2((num(totalKg) * 500) / denominator);
}

// ── IPF GL Points (IPF, 2020) ─────────────────────────────────────────────────
// Total × 100 / (A − B·e^(−C·bw)), classic raw three-lift competition parameters.
const IPF_GL_COEFFS = {
  male: [1199.72839, 1025.18162, 0.00921] as const,
  female: [610.32796, 1045.59282, 0.03048] as const,
};

/**
 * Calculates IPF GL Points for raw 3-lift competition.
 */
export function calculateIpfGl(totalKg: number, bwKg: number, sex: 'male' | 'female' = 'male'): number | null {
  if (!isPositive(totalKg) || !isPositive(bwKg)) return null;
  const [A, B, C] = IPF_GL_COEFFS[sex === 'female' ? 'female' : 'male'];
  const denominator = A - B * Math.exp(-C * num(bwKg));
  if (denominator <= 0) return null;
  return round2((num(totalKg) * 100) / denominator);
}

// ── Strength Classification Tiers ─────────────────────────────────────────────
export type StrengthTier = 'Novice' | 'Intermediate' | 'Advanced' | 'Elite' | 'International';

export interface StrengthClassification {
  tier: StrengthTier;
  percentile: string;
  badgeColor: string;
  nextTierTargetDots: number | null;
  pointsToNextTier: number | null;
  description: string;
}

export function getStrengthClassification(dotsScore: number, sex: 'male' | 'female' = 'male'): StrengthClassification {
  if (dotsScore >= 500) {
    return {
      tier: 'International',
      percentile: 'Top 0.5%',
      badgeColor: 'text-[#B7FF4A] bg-[#B7FF4A]/10 border-[#B7FF4A]/30',
      nextTierTargetDots: null,
      pointsToNextTier: null,
      description: 'World-class strength standard competitive at national and international championships.',
    };
  }
  if (dotsScore >= 425) {
    return {
      tier: 'Elite',
      percentile: 'Top 3%',
      badgeColor: 'text-[#36D6B0] bg-[#36D6B0]/10 border-[#36D6B0]/30',
      nextTierTargetDots: 500,
      pointsToNextTier: round1(500 - dotsScore),
      description: 'Exceptional pound-for-pound strength indicating multi-year dedicated strength training.',
    };
  }
  if (dotsScore >= 350) {
    return {
      tier: 'Advanced',
      percentile: 'Top 15%',
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      nextTierTargetDots: 425,
      pointsToNextTier: round1(425 - dotsScore),
      description: 'Well-developed strength base surpassing typical gym lifters through structured progressive overload.',
    };
  }
  if (dotsScore >= 275) {
    return {
      tier: 'Intermediate',
      percentile: 'Top 45%',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      nextTierTargetDots: 350,
      pointsToNextTier: round1(350 - dotsScore),
      description: 'Solid foundation with consistent progression across the compound barbell movements.',
    };
  }
  return {
    tier: 'Novice',
    percentile: 'Top 85%',
    badgeColor: 'text-zinc-400 bg-zinc-800 border-zinc-700',
    nextTierTargetDots: 275,
    pointsToNextTier: round1(275 - dotsScore),
    description: 'Beginning stage of barbell training with rapid linear progression potential ahead.',
  };
}

// ── US Navy Body Fat % (Hodgdon & Beckett 1984) ───────────────────────────────
export interface NavyBodyFatInput {
  sex: 'male' | 'female';
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
}

export function calculateNavyBodyFat({
  sex = 'male',
  heightCm,
  neckCm,
  waistCm,
  hipCm,
}: NavyBodyFatInput): number | null {
  const h = num(heightCm);
  const n = num(neckCm);
  const w = num(waistCm);
  const hip = num(hipCm);

  if (!isPositive(h) || !isPositive(n) || !isPositive(w)) return null;

  let bf: number;
  if (sex === 'female') {
    if (!isPositive(hip) || w + hip - n <= 0) return null;
    bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.221 * Math.log10(h)) - 450;
  } else {
    if (w - n <= 0) return null;
    bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
  }

  return Number.isFinite(bf) && bf > 0 && bf < 75 ? round1(bf) : null;
}

export type BodyFatCategory = 'Essential' | 'Athletes' | 'Fitness' | 'Average' | 'Obese';

export function getBodyFatCategory(bfPct: number, sex: 'male' | 'female' = 'male'): {
  category: BodyFatCategory;
  badgeColor: string;
  description: string;
} {
  if (sex === 'male') {
    if (bfPct < 6) {
      return { category: 'Essential', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', description: 'Essential fat level (stage ready contest conditioning).' };
    }
    if (bfPct <= 13) {
      return { category: 'Athletes', badgeColor: 'text-[#B7FF4A] bg-[#B7FF4A]/10 border-[#B7FF4A]/30', description: 'Athletic body composition with visible abdominal definition.' };
    }
    if (bfPct <= 17) {
      return { category: 'Fitness', badgeColor: 'text-[#36D6B0] bg-[#36D6B0]/10 border-[#36D6B0]/30', description: 'Optimal health and sustainable hypertrophy aesthetic.' };
    }
    if (bfPct <= 24) {
      return { category: 'Average', badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30', description: 'Normal acceptable range for general population health.' };
    }
    return { category: 'Obese', badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30', description: 'Elevated adiposity with potential cardiometabolic risk factors.' };
  } else {
    if (bfPct < 14) {
      return { category: 'Essential', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', description: 'Essential fat minimum necessary for hormonal equilibrium.' };
    }
    if (bfPct <= 20) {
      return { category: 'Athletes', badgeColor: 'text-[#B7FF4A] bg-[#B7FF4A]/10 border-[#B7FF4A]/30', description: 'Athletic physique with prominent athletic muscle tone.' };
    }
    if (bfPct <= 24) {
      return { category: 'Fitness', badgeColor: 'text-[#36D6B0] bg-[#36D6B0]/10 border-[#36D6B0]/30', description: 'Ideal functional fitness and metabolic health.' };
    }
    if (bfPct <= 31) {
      return { category: 'Average', badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30', description: 'Standard healthy female composition range.' };
    }
    return { category: 'Obese', badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30', description: 'Elevated adiposity requiring sustainable nutritional deficit.' };
  }
}
