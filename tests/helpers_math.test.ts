import { describe, it, expect } from 'vitest';
import {
  calculateEstimated1RM,
  calculateExerciseVolume,
  calculatePlates,
  formatTime,
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
});
