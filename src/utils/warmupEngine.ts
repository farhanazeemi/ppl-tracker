/**
 * Barbell & Resistance Training Warm-Up Ramp Engine
 * Adapted from and inspired by openGym (DuarteSantos8/openGym: lib/warmup-ramp.js & lib/warmup-snap.js)
 * 
 * Generates structured, non-fatiguing warm-up progressions that prime the CNS,
 * lubricate synovial joints, and potentiate heavy working sets without accumulating lactate.
 */

import { calculatePlates, PlateCalculationResult } from './helpers';

export interface WarmupRung {
  setNumber: number;
  weight: number;
  reps: number;
  percentage: number;
  isBarOnly?: boolean;
  purpose: string;
  restSeconds: number;
  plates?: PlateCalculationResult;
}

export interface WarmupConfig {
  workWeight: number;
  unit?: 'kg' | 'lbs';
  barWeight?: number; // 20kg or 45lbs default
  isCompound?: boolean;
  isBodyweight?: boolean;
  availablePlates?: number[];
}

// Exercise classification regex patterns (from openGym lib/warmup-ramp.js)
const COMPOUND_REGEX = /squat|deadlift|\bpress\b|\brow\b|rowing|pull-?up|chin-?up|\bdips?\b|lunge|clean|snatch|jerk|thrust|good ?morning|step-?up|push-?up|leg press|hack|rack pull|pulldown|pull-down/i;
const ISOLATION_REGEX = /curl|extension|raise|\bfly\b|flye|kickback|shrug|calf|crunch|pullover|pushdown|push-down|face pull|wrist|adduct|abduct|lateral/i;

/**
 * Determines whether an exercise name represents a multi-joint compound lift.
 */
export function isCompoundMovement(name: string, equipment: string = 'barbell'): boolean {
  if (equipment === 'barbell') return true;
  const n = name.toLowerCase();
  return COMPOUND_REGEX.test(n) && !ISOLATION_REGEX.test(n);
}

/**
 * Snaps a calculated weight down to the nearest achievable plate increment.
 * Prevents impractical barbell loads like 57.38 kg.
 */
export function snapToGrid(rawWeight: number, grid: number = 2.5): number {
  if (rawWeight <= 0) return 0;
  return Math.floor(rawWeight / grid) * grid;
}

/**
 * Generates an optimal warm-up ramp ladder for resistance training.
 */
export function generateWarmupLadder({
  workWeight,
  unit = 'kg',
  barWeight,
  isCompound = true,
  isBodyweight = false,
  availablePlates = unit === 'kg' ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5],
}: WarmupConfig): WarmupRung[] {
  if (!Number.isFinite(workWeight) || workWeight <= 0) {
    return [];
  }

  const effectiveBarWeight =
    typeof barWeight === 'number'
      ? barWeight
      : isCompound && !isBodyweight
      ? unit === 'kg'
        ? 20
        : 45
      : 0;

  const grid = unit === 'kg' ? 2.5 : 5;
  const ladder: WarmupRung[] = [];

  // If working weight is less than or equal to bar weight, minimal warmup is needed
  if (effectiveBarWeight > 0 && workWeight <= effectiveBarWeight) {
    return [
      {
        setNumber: 1,
        weight: workWeight,
        reps: 10,
        percentage: 100,
        isBarOnly: true,
        purpose: 'Joint lubrication & movement pattern familiarization',
        restSeconds: 60,
        plates: calculatePlates(workWeight, effectiveBarWeight, availablePlates),
      },
    ];
  }

  // 1. Bare Barbell primer (if weight allows)
  if (isCompound && !isBodyweight && effectiveBarWeight > 0 && effectiveBarWeight < workWeight) {
    ladder.push({
      setNumber: 1,
      weight: effectiveBarWeight,
      reps: 10,
      percentage: Math.round((effectiveBarWeight / workWeight) * 100),
      isBarOnly: true,
      purpose: 'Joint synovial fluid warming & groove motor pattern',
      restSeconds: 60,
      plates: calculatePlates(effectiveBarWeight, effectiveBarWeight, availablePlates),
    });
  }

  // Define percentage thresholds based on load magnitude and movement type
  let rungsDef: Array<{ pct: number; reps: number; purpose: string; rest: number }>;

  if (isCompound) {
    if (workWeight >= (unit === 'kg' ? 80 : 175)) {
      // 4-step heavy ramp: 45%, 65%, 80%, 90%
      rungsDef = [
        { pct: 45, reps: 5, purpose: 'Establish movement velocity & rhythm', rest: 60 },
        { pct: 65, reps: 3, purpose: 'Moderate load motor recruitment', rest: 90 },
        { pct: 80, reps: 2, purpose: 'High-threshold motor unit priming', rest: 120 },
        { pct: 90, reps: 1, purpose: 'Neuromuscular potentiation (PAP)', rest: 120 },
      ];
    } else if (workWeight >= (unit === 'kg' ? 45 : 100)) {
      // 3-step medium ramp: 50%, 70%, 85%
      rungsDef = [
        { pct: 50, reps: 5, purpose: 'Velocity & bar path priming', rest: 60 },
        { pct: 70, reps: 3, purpose: 'CNS excitation without metabolic fatigue', rest: 90 },
        { pct: 85, reps: 1, purpose: 'Heavy feel preparation (single)', rest: 90 },
      ];
    } else {
      // Light compound ramp: 60%, 80%
      rungsDef = [
        { pct: 60, reps: 5, purpose: 'Light muscular preparation', rest: 60 },
        { pct: 80, reps: 3, purpose: 'Acclimatization before working set', rest: 60 },
      ];
    }
  } else {
    // Isolation movements require fewer warm-up sets
    rungsDef = [
      { pct: 50, reps: 10, purpose: 'Local blood flow & muscle pump primer', rest: 60 },
      { pct: 75, reps: 4, purpose: 'Target muscle activation', rest: 60 },
    ];
  }

  let lastWeight = ladder.length > 0 ? ladder[0].weight : 0;

  for (const def of rungsDef) {
    const rawWeight = (workWeight * def.pct) / 100;
    let snappedWeight = snapToGrid(rawWeight, grid);

    // Keep weight above bar weight and below work weight
    if (effectiveBarWeight > 0 && snappedWeight <= effectiveBarWeight) {
      snappedWeight = effectiveBarWeight + grid * 2;
    }

    if (snappedWeight >= workWeight) {
      continue;
    }

    // Omit duplicate or non-ascending weights
    if (snappedWeight <= lastWeight) {
      continue;
    }

    ladder.push({
      setNumber: ladder.length + 1,
      weight: snappedWeight,
      reps: def.reps,
      percentage: Math.round((snappedWeight / workWeight) * 100),
      purpose: def.purpose,
      restSeconds: def.rest,
      plates: effectiveBarWeight > 0 ? calculatePlates(snappedWeight, effectiveBarWeight, availablePlates) : undefined,
    });

    lastWeight = snappedWeight;
  }

  return ladder;
}
