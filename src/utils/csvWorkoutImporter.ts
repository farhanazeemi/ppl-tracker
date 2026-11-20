/**
 * Multi-Platform Workout CSV Importer
 * Adapted from and inspired by openGym (DuarteSantos8/openGym: lib/import-csv.js)
 * 
 * Supports CSV exports from:
 * - Strong App (iOS / Android)
 * - Hevy App (iOS / Android)
 * - FitNotes (Android / iOS)
 * - openGym (CSV format)
 * - Generic Spreadsheet / Custom CSV
 */

import { LoggedWorkoutSession, ExerciseSet, SplitDayId } from '../types/workout';
import { LB_TO_KG } from './strengthCalculators';

export type DetectedWorkoutFormat = 'Strong' | 'Hevy' | 'FitNotes' | 'openGym' | 'Standard CSV';

export interface CsvImportSummary {
  format: DetectedWorkoutFormat;
  totalSessions: number;
  totalSets: number;
  totalVolumeKg: number;
  exercisesFound: string[];
  dateRange: { start: string; end: string };
  sessions: LoggedWorkoutSession[];
}

/**
 * Robust RFC 4180 CSV parser handling quoted cells, embedded commas, doubled quotes, and CRLF.
 */
export function parseCSVLines(text: string): string[][] {
  const cleanText = text.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  // Determine delimiter: Strong in some European locales uses ';'
  const firstLine = cleanText.split(/[\r\n]+/)[0] || '';
  const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // Ignored, handled by \n
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Detects the workout tracker export format based on CSV headers.
 */
export function detectCsvFormat(headerRow: string[]): DetectedWorkoutFormat {
  const normalized = headerRow.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ' '));

  if (normalized.some((h) => h.includes('exercise title')) && normalized.some((h) => h.includes('set index') || h.includes('start time'))) {
    return 'Hevy';
  }
  if (normalized.some((h) => h.includes('exercise name')) && normalized.some((h) => h.includes('set order') || h.includes('workout name'))) {
    return 'Strong';
  }
  if (normalized.some((h) => h.includes('exercise id'))) {
    return 'openGym';
  }
  if (normalized.some((h) => h.includes('exercise')) && normalized.some((h) => h.includes('category') || h.includes('weight unit') || h.includes('kind'))) {
    return 'FitNotes';
  }
  return 'Standard CSV';
}

/**
 * Canonical exercise alias map mapping third-party titles to PPL Tracker IDs.
 */
const EXERCISE_ALIAS_MAP: Record<string, { id: string; name: string; split: SplitDayId }> = {
  // Chest / Push
  'bench press': { id: 'barbell-bench-press', name: 'Barbell Bench Press', split: 'push-a' },
  'bench press (barbell)': { id: 'barbell-bench-press', name: 'Barbell Bench Press', split: 'push-a' },
  'barbell bench press': { id: 'barbell-bench-press', name: 'Barbell Bench Press', split: 'push-a' },
  'flat barbell bench press': { id: 'barbell-bench-press', name: 'Barbell Bench Press', split: 'push-a' },
  'incline bench press': { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', split: 'push-a' },
  'incline bench press (dumbbell)': { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', split: 'push-a' },
  'incline dumbbell press': { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', split: 'push-a' },
  'incline dumbbell bench press': { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', split: 'push-a' },
  'overhead press': { id: 'overhead-press', name: 'Overhead Press (OHP)', split: 'push-a' },
  'overhead press (barbell)': { id: 'overhead-press', name: 'Overhead Press (OHP)', split: 'push-a' },
  'military press': { id: 'overhead-press', name: 'Overhead Press (OHP)', split: 'push-a' },
  'lateral raise': { id: 'dumbbell-lateral-raise', name: 'Dumbbell Lateral Raise', split: 'push-a' },
  'lateral raise (dumbbell)': { id: 'dumbbell-lateral-raise', name: 'Dumbbell Lateral Raise', split: 'push-a' },
  'dumbbell lateral raise': { id: 'dumbbell-lateral-raise', name: 'Dumbbell Lateral Raise', split: 'push-a' },
  'cable lateral raise': { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', split: 'push-b' },
  'dips': { id: 'tricep-dips', name: 'Weighted Tricep Dips', split: 'push-a' },
  'chest dip': { id: 'tricep-dips', name: 'Weighted Tricep Dips', split: 'push-a' },
  'triceps pushdown': { id: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', split: 'push-a' },
  'triceps pushdown (cable)': { id: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', split: 'push-a' },
  'cable pushdown': { id: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', split: 'push-a' },
  'overhead triceps extension': { id: 'overhead-cable-extension', name: 'Overhead Cable Extension', split: 'push-b' },

  // Back / Pull
  'deadlift': { id: 'barbell-deadlift', name: 'Conventional Barbell Deadlift', split: 'pull-a' },
  'deadlift (barbell)': { id: 'barbell-deadlift', name: 'Conventional Barbell Deadlift', split: 'pull-a' },
  'conventional deadlift': { id: 'barbell-deadlift', name: 'Conventional Barbell Deadlift', split: 'pull-a' },
  'barbell row': { id: 'barbell-bent-over-row', name: 'Barbell Bent-Over Row', split: 'pull-a' },
  'bent over row (barbell)': { id: 'barbell-bent-over-row', name: 'Barbell Bent-Over Row', split: 'pull-a' },
  'lat pulldown': { id: 'lat-pulldown', name: 'Wide-Grip Lat Pulldown', split: 'pull-a' },
  'lat pulldown (cable)': { id: 'lat-pulldown', name: 'Wide-Grip Lat Pulldown', split: 'pull-a' },
  'pull up': { id: 'pull-ups', name: 'Weighted Pull-Ups', split: 'pull-a' },
  'pull-up': { id: 'pull-ups', name: 'Weighted Pull-Ups', split: 'pull-a' },
  'chin up': { id: 'pull-ups', name: 'Weighted Pull-Ups', split: 'pull-a' },
  'seated cable row': { id: 'seated-cable-row', name: 'Seated Cable Row', split: 'pull-b' },
  'face pull': { id: 'face-pull', name: 'Cable Face Pull', split: 'pull-a' },
  'face pull (cable)': { id: 'face-pull', name: 'Cable Face Pull', split: 'pull-a' },
  'bicep curl': { id: 'dumbbell-bicep-curl', name: 'Incline Dumbbell Bicep Curl', split: 'pull-a' },
  'bicep curl (dumbbell)': { id: 'dumbbell-bicep-curl', name: 'Incline Dumbbell Bicep Curl', split: 'pull-a' },
  'hammer curl': { id: 'hammer-curl', name: 'Cross-Body Hammer Curl', split: 'pull-b' },
  'hammer curl (dumbbell)': { id: 'hammer-curl', name: 'Cross-Body Hammer Curl', split: 'pull-b' },

  // Legs
  'squat': { id: 'barbell-back-squat', name: 'Barbell Back Squat', split: 'legs-a' },
  'squat (barbell)': { id: 'barbell-back-squat', name: 'Barbell Back Squat', split: 'legs-a' },
  'barbell squat': { id: 'barbell-back-squat', name: 'Barbell Back Squat', split: 'legs-a' },
  'back squat': { id: 'barbell-back-squat', name: 'Barbell Back Squat', split: 'legs-a' },
  'front squat': { id: 'front-squat', name: 'Barbell Front Squat', split: 'legs-b' },
  'leg press': { id: 'leg-press', name: 'Leg Press', split: 'legs-a' },
  'romanian deadlift': { id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', split: 'legs-a' },
  'romanian deadlift (barbell)': { id: 'romanian-deadlift', name: 'Romanian Deadlift (RDL)', split: 'legs-a' },
  'leg curl': { id: 'lying-leg-curl', name: 'Lying Leg Curl', split: 'legs-a' },
  'lying leg curl': { id: 'lying-leg-curl', name: 'Lying Leg Curl', split: 'legs-a' },
  'seated leg curl': { id: 'seated-leg-curl', name: 'Seated Leg Curl', split: 'legs-b' },
  'leg extension': { id: 'leg-extension', name: 'Leg Extension', split: 'legs-a' },
  'calf raise': { id: 'standing-calf-raise', name: 'Standing Calf Raise', split: 'legs-a' },
  'standing calf raise': { id: 'standing-calf-raise', name: 'Standing Calf Raise', split: 'legs-a' },
  'seated calf raise': { id: 'seated-calf-raise', name: 'Seated Calf Raise', split: 'legs-b' },
};

/**
 * Normalizes any exercise string into a matched or slugified ID and clean name.
 */
export function resolveExercise(rawTitle: string): { id: string; name: string; split: SplitDayId } {
  const clean = rawTitle.toLowerCase().trim();
  if (EXERCISE_ALIAS_MAP[clean]) {
    return EXERCISE_ALIAS_MAP[clean];
  }

  // Substring match attempt
  for (const [key, mapping] of Object.entries(EXERCISE_ALIAS_MAP)) {
    if (clean.includes(key)) {
      return mapping;
    }
  }

  // Fallback slugification
  const slug = clean.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom-exercise';
  return {
    id: slug,
    name: rawTitle.trim(),
    split: 'push-a',
  };
}

/**
 * Converts parsed CSV rows into complete PPL Tracker workout sessions.
 */
export function parseWorkoutCsv(csvText: string): CsvImportSummary {
  const table = parseCSVLines(csvText);
  if (table.length < 2) {
    throw new Error('CSV file contains no data rows.');
  }

  const headers = table[0];
  const format = detectCsvFormat(headers);
  const headerMap: Record<string, number> = {};

  headers.forEach((h, index) => {
    const key = h.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    headerMap[key] = index;
  });

  const getCol = (aliases: string[]): number => {
    for (const alias of aliases) {
      const k = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (headerMap[k] !== undefined) return headerMap[k];
    }
    return -1;
  };

  const colDate = getCol(['date', 'start time', 'datetime', 'timestamp']);
  const colWorkoutName = getCol(['workout name', 'title', 'routine name', 'session']);
  const colExercise = getCol(['exercise name', 'exercise title', 'exercise']);
  const colWeight = getCol(['weight', 'weight kg', 'weight lbs']);
  const colWeightUnit = getCol(['weight unit']);
  const colReps = getCol(['reps', 'rep count']);
  const colRpe = getCol(['rpe', 'rpe rating']);
  const colSetType = getCol(['set type', 'set order', 'kind']);
  const colDuration = getCol(['duration', 'duration sec', 'duration seconds', 'time']);

  if (colExercise === -1 || colReps === -1) {
    throw new Error('CSV must contain at least Exercise and Reps columns.');
  }

  // Group rows by session key: date + workout name
  interface RawSetRecord {
    exerciseName: string;
    weight: number;
    reps: number;
    rpe?: number;
    isWarmup: boolean;
  }

  interface RawSessionRecord {
    date: string;
    workoutTitle: string;
    durationMinutes: number;
    sets: RawSetRecord[];
  }

  const sessionBuckets = new Map<string, RawSessionRecord>();

  for (let r = 1; r < table.length; r++) {
    const row = table[r];
    if (row.length === 0 || !row[colExercise]) continue;

    const rawDate = colDate !== -1 && row[colDate] ? row[colDate] : new Date().toISOString().split('T')[0];
    const workoutTitle = colWorkoutName !== -1 && row[colWorkoutName] ? row[colWorkoutName] : 'Imported Workout';
    const sessionKey = `${rawDate.slice(0, 10)}_${workoutTitle}`;

    const exName = row[colExercise].trim();
    let weight = colWeight !== -1 && row[colWeight] ? parseFloat(row[colWeight].replace(',', '.')) : 0;
    if (isNaN(weight) || weight < 0) weight = 0;

    // Convert lbs to kg if specified
    const unitStr = colWeightUnit !== -1 && row[colWeightUnit] ? row[colWeightUnit].toLowerCase() : '';
    if (unitStr.includes('lb') || (headers[colWeight] && headers[colWeight].toLowerCase().includes('lb'))) {
      weight = Math.round(weight * LB_TO_KG * 10) / 10;
    }

    let reps = colReps !== -1 && row[colReps] ? parseInt(row[colReps], 10) : 0;
    if (isNaN(reps) || reps < 0) reps = 0;

    let rpe: number | undefined;
    if (colRpe !== -1 && row[colRpe]) {
      const parsedRpe = parseFloat(row[colRpe].replace(',', '.'));
      if (parsedRpe >= 5 && parsedRpe <= 10) {
        rpe = parsedRpe;
      }
    }

    const setTypeStr = colSetType !== -1 && row[colSetType] ? row[colSetType].toLowerCase() : '';
    const isWarmup = setTypeStr.includes('w') || setTypeStr.includes('warm');

    let durationMinutes = 45;
    if (colDuration !== -1 && row[colDuration]) {
      const durNum = parseFloat(row[colDuration].replace(',', '.'));
      if (durNum > 0) {
        durationMinutes = durNum > 500 ? Math.round(durNum / 60) : Math.round(durNum);
      }
    }

    if (!sessionBuckets.has(sessionKey)) {
      sessionBuckets.set(sessionKey, {
        date: rawDate,
        workoutTitle,
        durationMinutes,
        sets: [],
      });
    }

    sessionBuckets.get(sessionKey)!.sets.push({
      exerciseName: exName,
      weight,
      reps,
      rpe,
      isWarmup,
    });
  }

  // Convert raw session buckets into LoggedWorkoutSession[]
  const sessions: LoggedWorkoutSession[] = [];
  const exercisesSet = new Set<string>();
  let totalVolumeKg = 0;
  let totalSetsCount = 0;

  let sessionIdx = 0;
  for (const [, bucket] of sessionBuckets.entries()) {
    sessionIdx++;
    const exercisesLogged: Record<string, ExerciseSet[]> = {};
    let sessionVolume = 0;
    let sessionSetsCount = 0;
    let sessionRepsCount = 0;
    let primarySplit: SplitDayId = 'push-a';

    bucket.sets.forEach((set, sIdx) => {
      const resolved = resolveExercise(set.exerciseName);
      exercisesSet.add(resolved.name);
      if (sIdx === 0) {
        primarySplit = resolved.split;
      }

      if (!exercisesLogged[resolved.id]) {
        exercisesLogged[resolved.id] = [];
      }

      const currentSets = exercisesLogged[resolved.id];
      const newSet: ExerciseSet = {
        id: `${resolved.id}-set-${currentSets.length + 1}-${sessionIdx}`,
        setNumber: currentSets.length + 1,
        weight: set.weight,
        reps: set.reps,
        completed: true,
        isWarmup: set.isWarmup,
        rpe: set.rpe,
      };

      currentSets.push(newSet);

      if (!set.isWarmup) {
        sessionVolume += set.weight * set.reps;
      }
      sessionSetsCount++;
      sessionRepsCount += set.reps;
    });

    totalVolumeKg += sessionVolume;
    totalSetsCount += sessionSetsCount;

    sessions.push({
      id: `session-imported-${Date.now()}-${sessionIdx}`,
      dayId: primarySplit,
      date: bucket.date,
      startTime: Date.now() - sessionIdx * 86400000,
      endTime: Date.now() - sessionIdx * 86400000 + bucket.durationMinutes * 60000,
      durationMinutes: bucket.durationMinutes,
      totalVolumeKg: Math.round(sessionVolume),
      totalSetsCompleted: sessionSetsCount,
      totalRepsCompleted: sessionRepsCount,
      exercisesLogged,
      doubleProgressionsEarned: [],
      notes: `Imported from ${format} (${bucket.workoutTitle})`,
    });
  }

  // Sort sessions in reverse chronological order
  sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const dates = sessions.map((s) => s.date).filter(Boolean);
  const dateRange = {
    start: dates.length > 0 ? dates[dates.length - 1] : '',
    end: dates.length > 0 ? dates[0] : '',
  };

  return {
    format,
    totalSessions: sessions.length,
    totalSets: totalSetsCount,
    totalVolumeKg: Math.round(totalVolumeKg),
    exercisesFound: Array.from(exercisesSet),
    dateRange,
    sessions,
  };
}
