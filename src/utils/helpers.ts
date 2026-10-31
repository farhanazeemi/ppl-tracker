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
