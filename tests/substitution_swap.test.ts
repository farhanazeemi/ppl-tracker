import { describe, it, expect } from 'vitest';
import { findCanonicalExercise } from '../src/lib/workout-substitution/exerciseRepository';
import { ExerciseDefinition } from '../src/types/workout';

describe('BUG-01: Substitution correctly swaps exercise into workout list', () => {
  const originalExercise: ExerciseDefinition = {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    target: 'Mid / Lower Pectoralis Major',
    primaryMuscle: 'Mid Chest',
    sets: 3,
    targetReps: '6–8',
    minReps: 6,
    maxReps: 8,
    restSeconds: 180,
    restDisplay: '3 min',
    cue: 'Retract scapulae',
    equipment: 'barbell',
  };

  function applySubstitution(
    exercises: ExerciseDefinition[],
    activeSub: { originalId?: string; originalName?: string; substituteId?: string; substituteName?: string } | null
  ): ExerciseDefinition[] {
    if (!activeSub) return exercises;
    return exercises.map((ex) => {
      const isMatch =
        (activeSub.originalId && ex.id === activeSub.originalId) ||
        (activeSub.originalName && ex.name.toLowerCase() === activeSub.originalName.toLowerCase());
      if (!isMatch) return ex;

      const substitute =
        (activeSub.substituteId ? findCanonicalExercise(activeSub.substituteId) : undefined) ||
        (activeSub.substituteName ? findCanonicalExercise(activeSub.substituteName) : undefined);
      if (!substitute) return ex;

      return {
        ...ex,
        id: substitute.id,
        name: substitute.name,
        target: substitute.primaryMuscles.join(', ') || ex.target,
        cue: substitute.cues?.[0] || substitute.biomechanics?.resistanceProfile || ex.cue,
        equipment: (substitute.equipment?.[0] as any) || ex.equipment,
      };
    });
  }

  it('replaces original exercise with substitute definition when active substitution matches', () => {
    const activeSub = {
      originalId: 'barbell-bench-press',
      substituteId: 'flat-dumbbell-press',
    };

    const substitute = findCanonicalExercise(activeSub.substituteId)!;
    const result = applySubstitution([originalExercise], activeSub);
    expect(result[0].id).toBe(substitute.id);
    expect(result[0].name).toBe(substitute.name);
    expect(result[0].sets).toBe(3);
    expect(result[0].minReps).toBe(6);
    expect(result[0].maxReps).toBe(8);
  });

  it('keeps original exercise untouched if no substitution active', () => {
    const result = applySubstitution([originalExercise], null);
    expect(result[0].id).toBe('barbell-bench-press');
  });
});
