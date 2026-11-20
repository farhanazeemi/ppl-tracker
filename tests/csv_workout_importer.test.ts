import { describe, it, expect } from 'vitest';
import {
  parseCSVLines,
  detectCsvFormat,
  resolveExercise,
  parseWorkoutCsv,
} from '../src/utils/csvWorkoutImporter';
import { validateAndSanitizeHistory } from '../src/utils/historyValidation';

describe('Workout CSV Importer (openGym multi-format parser)', () => {
  it('parses CSV lines with quoted commas, double quotes, and semicolons', () => {
    const raw = 'Date,Exercise,Weight,Reps\n2026-10-31,"Bench Press, Close Grip",80,8\n2026-10-31,"Squat",100,5';
    const lines = parseCSVLines(raw);
    expect(lines).toHaveLength(3);
    expect(lines[1][1]).toBe('Bench Press, Close Grip');
    expect(lines[1][2]).toBe('80');
    expect(lines[2][1]).toBe('Squat');
  });

  it('detects export source formats from Strong and Hevy headers', () => {
    const strongHeader = ['Date', 'Workout Name', 'Duration', 'Exercise Name', 'Set Order', 'Weight', 'Reps'];
    expect(detectCsvFormat(strongHeader)).toBe('Strong');

    const hevyHeader = ['title', 'start_time', 'end_time', 'exercise_title', 'set_index', 'set_type', 'weight_kg', 'reps'];
    expect(detectCsvFormat(hevyHeader)).toBe('Hevy');

    const fitnotesHeader = ['Date', 'Exercise', 'Category', 'Weight', 'Weight Unit', 'Reps'];
    expect(detectCsvFormat(fitnotesHeader)).toBe('FitNotes');
  });

  it('maps common exercise aliases to canonical PPL Tracker IDs', () => {
    expect(resolveExercise('Bench Press (Barbell)').id).toBe('barbell-bench-press');
    expect(resolveExercise('Incline Dumbbell Press').id).toBe('incline-dumbbell-press');
    expect(resolveExercise('Conventional Deadlift').id).toBe('barbell-deadlift');
    expect(resolveExercise('Barbell Squat').id).toBe('barbell-back-squat');
    expect(resolveExercise('Lat Pulldown (Cable)').id).toBe('lat-pulldown');
  });

  it('parses Hevy-style CSV export into complete workout sessions', () => {
    const hevyCsv = `title,start_time,end_time,exercise_title,set_index,set_type,weight_kg,reps,rpe
"Push Day","2026-11-01 10:00","2026-11-01 11:00","Bench Press (Barbell)",1,"warmup",40,10,6
"Push Day","2026-11-01 10:00","2026-11-01 11:00","Bench Press (Barbell)",2,"normal",80,8,8.5
"Push Day","2026-11-01 10:00","2026-11-01 11:00","Incline Dumbbell Press",1,"normal",30,10,8
"Leg Day","2026-11-02 10:00","2026-11-02 11:00","Barbell Squat",1,"normal",120,5,8`;

    const summary = parseWorkoutCsv(hevyCsv);
    expect(summary.format).toBe('Hevy');
    expect(summary.totalSessions).toBe(2);
    expect(summary.totalSets).toBe(4);
    expect(summary.exercisesFound).toContain('Barbell Bench Press');

    // Test warm-up set detection
    const pushSession = summary.sessions.find((s) => s.notes?.includes('Push Day'));
    expect(pushSession).toBeDefined();
    const benchSets = pushSession?.exercisesLogged['barbell-bench-press'];
    expect(benchSets).toHaveLength(2);
    expect(benchSets![0].isWarmup).toBe(true);
    expect(benchSets![1].isWarmup).toBe(false);
  });

  it('integrates seamlessly with validateAndSanitizeHistory', () => {
    const strongCsv = `Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,RPE
2026-11-01,Push A,45 mins,Barbell Bench Press,1,80,8,8
2026-11-01,Push A,45 mins,Barbell Bench Press,2,80,8,8.5`;

    const result = validateAndSanitizeHistory(strongCsv);
    expect(result.isValid).toBe(true);
    expect(result.validLogs).toHaveLength(1);
    expect(result.sourceFormat).toBe('Strong');
    expect(result.validLogs[0].totalSetsCompleted).toBe(2);
  });
});
