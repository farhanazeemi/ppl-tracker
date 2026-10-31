import { describe, it, expect } from 'vitest';
import { DEFAULT_MATCHING_WEIGHTS, findExerciseSubstitutes } from '../src/lib/workout-substitution/engine';
import { CANONICAL_EXERCISE_DATABASE } from '../src/lib/workout-substitution/exerciseRepository';

describe('BUG-08 & BUG-09: Substitution Engine Weights & Deterministic Sorting', () => {
  it('BUG-08: DEFAULT_MATCHING_WEIGHTS sum to exactly 1.00 (100%)', () => {
    const sum =
      DEFAULT_MATCHING_WEIGHTS.primaryMuscle +
      DEFAULT_MATCHING_WEIGHTS.movementPattern +
      DEFAULT_MATCHING_WEIGHTS.equipment +
      DEFAULT_MATCHING_WEIGHTS.secondaryMuscle +
      DEFAULT_MATCHING_WEIGHTS.exerciseType +
      DEFAULT_MATCHING_WEIGHTS.goalBonus;

    expect(Number(sum.toFixed(4))).toBe(1.0);
  });

  it('BUG-09: results are deterministically sorted by score descending then name ascending', () => {
    expect(CANONICAL_EXERCISE_DATABASE.length).toBeGreaterThan(0);
    const exercise = CANONICAL_EXERCISE_DATABASE[0];

    const results = findExerciseSubstitutes(exercise, { availableEquipment: [] });
    expect(results.length).toBeGreaterThan(1);

    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];

      // Primary: Score descending
      if (current.score === next.score) {
        // Secondary: Alphabetical tie-breaker
        expect(current.exercise.name.localeCompare(next.exercise.name)).toBeLessThanOrEqual(0);
      } else {
        expect(current.score).toBeGreaterThan(next.score);
      }
    }
  });
});
