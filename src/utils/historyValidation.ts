import { LoggedWorkoutSession, ExerciseSet } from '../types/workout';
import { parseWorkoutCsv } from './csvWorkoutImporter';

export interface HistoryValidationResult {
  validLogs: LoggedWorkoutSession[];
  isValid: boolean;
  errorMessage?: string;
  sourceFormat?: string;
}

/**
 * Validates and sanitizes imported workout history data (supporting JSON and CSV from Strong/Hevy/FitNotes).
 * Protects against malformed objects, prototype pollution, null exercisesLogged crashes,
 * and NaN/negative values.
 */
export function validateAndSanitizeHistory(data: unknown): HistoryValidationResult {
  // If data is a raw string (e.g. from file read or CSV)
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return validateAndSanitizeHistory(parsed);
      } catch {
        // Fall through to CSV check if JSON parse fails
      }
    }

    try {
      const summary = parseWorkoutCsv(trimmed);
      if (summary.sessions.length > 0) {
        return {
          validLogs: summary.sessions,
          isValid: true,
          sourceFormat: summary.format,
        };
      }
    } catch (csvErr: any) {
      return {
        validLogs: [],
        isValid: false,
        errorMessage: csvErr?.message || 'Failed to parse workout file (invalid JSON or CSV format).',
      };
    }
  }

  if (!Array.isArray(data)) {
    return {
      validLogs: [],
      isValid: false,
      errorMessage: 'File must contain a valid JSON array or CSV export of workout sessions.',
    };
  }

  const validLogs: LoggedWorkoutSession[] = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item || typeof item !== 'object') continue;

    const dayId = typeof item.dayId === 'string' && item.dayId.trim() ? item.dayId : 'custom';
    const date = typeof item.date === 'string' && item.date.trim() ? item.date : new Date().toLocaleDateString('en-US');
    const id = typeof item.id === 'string' && item.id.trim() ? item.id : `session-imported-${Date.now()}-${i}`;
    const durationMinutes =
      typeof item.durationMinutes === 'number' && Number.isFinite(item.durationMinutes) && item.durationMinutes >= 0
        ? item.durationMinutes
        : 30;
    const totalVolumeKg =
      typeof item.totalVolumeKg === 'number' && Number.isFinite(item.totalVolumeKg) && item.totalVolumeKg >= 0
        ? item.totalVolumeKg
        : 0;
    const totalSetsCompleted =
      typeof item.totalSetsCompleted === 'number' && Number.isFinite(item.totalSetsCompleted) && item.totalSetsCompleted >= 0
        ? item.totalSetsCompleted
        : 0;
    const totalRepsCompleted =
      typeof item.totalRepsCompleted === 'number' && Number.isFinite(item.totalRepsCompleted) && item.totalRepsCompleted >= 0
        ? item.totalRepsCompleted
        : 0;
    const startTime = typeof item.startTime === 'number' && Number.isFinite(item.startTime) ? item.startTime : Date.now();
    const endTime = typeof item.endTime === 'number' && Number.isFinite(item.endTime) ? item.endTime : Date.now();
    const doubleProgressionsEarned = Array.isArray(item.doubleProgressionsEarned)
      ? item.doubleProgressionsEarned.filter((s: unknown): s is string => typeof s === 'string')
      : [];

    // Sanitize exercisesLogged to ensure Object.entries never fails
    const rawExercises = item.exercisesLogged;
    const exercisesLogged: Record<string, ExerciseSet[]> = {};
    if (rawExercises && typeof rawExercises === 'object' && !Array.isArray(rawExercises)) {
      for (const [exId, rawSets] of Object.entries(rawExercises)) {
        if (typeof exId === 'string' && Array.isArray(rawSets)) {
          const validSets: ExerciseSet[] = [];
          for (let sIdx = 0; sIdx < rawSets.length; sIdx++) {
            const rawSet = rawSets[sIdx];
            if (rawSet && typeof rawSet === 'object') {
              validSets.push({
                id: typeof rawSet.id === 'string' ? rawSet.id : `${exId}-set-${sIdx + 1}`,
                setNumber: typeof rawSet.setNumber === 'number' ? rawSet.setNumber : sIdx + 1,
                weight: typeof rawSet.weight === 'number' && Number.isFinite(rawSet.weight) ? rawSet.weight : '',
                reps: typeof rawSet.reps === 'number' && Number.isFinite(rawSet.reps) ? rawSet.reps : '',
                completed: Boolean(rawSet.completed),
                isWarmup: Boolean(rawSet.isWarmup),
                rpe: typeof rawSet.rpe === 'number' ? rawSet.rpe : undefined,
              });
            }
          }
          exercisesLogged[exId] = validSets;
        }
      }
    }

    validLogs.push({
      id,
      dayId,
      date,
      startTime,
      endTime,
      durationMinutes,
      totalVolumeKg,
      totalSetsCompleted,
      totalRepsCompleted,
      exercisesLogged,
      doubleProgressionsEarned,
    });
  }

  if (validLogs.length === 0 && data.length > 0) {
    return {
      validLogs: [],
      isValid: false,
      errorMessage: 'No valid workout sessions could be parsed from the file.',
    };
  }

  return { validLogs, isValid: true, sourceFormat: 'PPL Tracker JSON' };
}
