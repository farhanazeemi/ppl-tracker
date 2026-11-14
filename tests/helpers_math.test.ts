import { describe, it, expect } from 'vitest';
import {
  calculateEstimated1RM,
  calculateExerciseVolume,
  calculatePlates,
  formatTime,
  calculateOneRepMaxSuite,
  calculateTdeeAndMacros,
  getRpePercentage,
  calculateRpeWorkingLoad,
  calculateFfmiMetrics,
} from '../src/utils/helpers';
import { ExerciseSet } from '../src/types/workout';

describe('BUG-10: Robust Mathematical Sanitations (1RM, Volume, Plates, Time)', () => {
  it('calculateEstimated1RM returns 0 for negative, zero, NaN, or non-finite inputs', () => {
    expect(calculateEstimated1RM(-100, 10)).toBe(0);
    expect(calculateEstimated1RM(100, -5)).toBe(0);
    expect(calculateEstimated1RM(0, 10)).toBe(0);
    expect(calculateEstimated1RM(100, 0)).toBe(0);
    expect(calculateEstimated1RM(NaN, 10)).toBe(0);
    expect(calculateEstimated1RM(100, NaN)).toBe(0);
    expect(calculateEstimated1RM(Infinity, 10)).toBe(0);
  });

  it('calculateEstimated1RM calculates correct 1RM for valid values', () => {
    expect(calculateEstimated1RM(100, 1)).toBe(100);
    // Epley: 100 * (1 + 10 / 30) = 133.3
    expect(calculateEstimated1RM(100, 10)).toBe(133.3);
  });

  it('calculateExerciseVolume ignores sets with NaN, non-finite, or negative numbers', () => {
    const sets: ExerciseSet[] = [
      { id: '1', setNumber: 1, weight: 100, reps: 5, completed: true },
      { id: '2', setNumber: 2, weight: NaN as any, reps: 5, completed: true },
      { id: '3', setNumber: 3, weight: -50, reps: 5, completed: true },
      { id: '4', setNumber: 4, weight: 80, reps: NaN as any, completed: true },
      { id: '5', setNumber: 5, weight: 80, reps: 5, completed: false }, // Not completed
    ];

    // Only set 1 (100 * 5 = 500) should be counted
    expect(calculateExerciseVolume(sets)).toBe(500);
  });

  it('calculatePlates handles negative and NaN weights safely', () => {
    const resNegative = calculatePlates(-50, 20);
    expect(resNegative.weightPerSide).toBe(0);
    expect(resNegative.platesPerSide).toEqual([]);

    const resNaN = calculatePlates(NaN, 20);
    expect(resNaN.weightPerSide).toBe(0);
    expect(resNaN.platesPerSide).toEqual([]);
  });

  it('formatTime handles negative and NaN numbers safely', () => {
    expect(formatTime(-10)).toBe('00:00');
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(90)).toBe('01:30');
  });

  it('calculateOneRepMaxSuite computes Epley, Brzycki, Lombardi, OConner, and training percentages accurately', () => {
    const res = calculateOneRepMaxSuite(100, 5, 'epley');
    expect(res.epley).toBe(116.7);
    expect(res.brzycki).toBe(112.5);
    expect(res.percentages.length).toBe(9);
    expect(res.percentages[0].percent).toBe(100);
    expect(res.percentages[0].weight).toBe(116.7);

    const invalidRes = calculateOneRepMaxSuite(-50, 5);
    expect(invalidRes.epley).toBe(0);
    expect(invalidRes.percentages).toEqual([]);
  });

  it('calculateTdeeAndMacros computes Mifflin-St Jeor and Katch-McArdle macros with zero NaN outputs', () => {
    const mifflin = calculateTdeeAndMacros({
      sex: 'male',
      age: 28,
      heightCm: 180,
      weightKg: 80,
      activityMultiplier: 1.55,
      goalAdjustmentPct: 0,
      macroSplit: { proteinPct: 30, carbsPct: 45, fatPct: 25 },
    });
    expect(mifflin.formulaUsed).toBe('Mifflin-St Jeor');
    // BMR = 10*80 + 6.25*180 - 5*28 + 5 = 800 + 1125 - 140 + 5 = 1790
    expect(mifflin.bmr).toBe(1790);
    expect(mifflin.tdee).toBe(Math.round(1790 * 1.55));
    expect(mifflin.proteinPct + mifflin.carbsPct + mifflin.fatPct).toBe(100);

    const katch = calculateTdeeAndMacros({
      sex: 'male',
      age: 28,
      heightCm: 180,
      weightKg: 80,
      activityMultiplier: 1.55,
      goalAdjustmentPct: -0.2,
      macroSplit: { proteinPct: 35, carbsPct: 40, fatPct: 25 },
      bodyFatPct: 12,
    });
    expect(katch.formulaUsed).toBe('Katch-McArdle');
    expect(katch.targetCalories).toBeLessThan(katch.tdee);
  });

  it('calculateRpeWorkingLoad computes estimated 1RM and recommended working weights from RPE/RIR', () => {
    expect(getRpePercentage(1, 10)).toBe(1);
    const loadRes = calculateRpeWorkingLoad({
      weight: 100,
      reps: 5,
      rpe: 8,
      targetReps: 5,
      targetRpe: 9,
    });
    expect(loadRes.estimated1RM).toBeGreaterThan(115);
    expect(loadRes.recommendedWeight).toBeGreaterThan(100);
    expect(loadRes.rir).toBe(2);
    expect(loadRes.targetRir).toBe(1);
  });

  it('calculateFfmiMetrics computes Lean Body Mass, Raw FFMI, and Height-Normalized FFMI', () => {
    const ffmi = calculateFfmiMetrics({
      heightCm: 180,
      weightKg: 85,
      bodyFatPct: 12,
      sex: 'male',
    });
    expect(ffmi.leanBodyMassKg).toBe(74.8);
    expect(ffmi.fatMassKg).toBe(10.2);
    // At 1.80m, rawFFMI == normalizedFFMI = 74.8 / 3.24 = 23.1
    expect(ffmi.rawFfmi).toBe(23.1);
    expect(ffmi.normalizedFfmi).toBe(23.1);
    expect(ffmi.category).toBe('Advanced Muscular');
  });
});
