import { describe, it, expect } from 'vitest';
import { validateAndSanitizeHistory } from '../src/utils/historyValidation';

describe('SEC-04: Workout History Import Validation & Storage Safety', () => {
  it('rejects non-array inputs safely', () => {
    const result = validateAndSanitizeHistory({ malicious: true });
    expect(result.isValid).toBe(false);
    expect(result.validLogs).toEqual([]);
  });

  it('sanitizes malformed objects and handles null exercisesLogged without crashing', () => {
    const malformedData = [
      {
        id: 'session-1',
        dayId: 'push-a',
        date: 'Oct 31, 2026',
        exercisesLogged: null, // Would cause Object.entries crash without fix
      },
      {
        id: 'session-2',
        dayId: 'pull-a',
        date: 'Oct 30, 2026',
        exercisesLogged: {
          'barbell-bench-press': [
            { id: 'set-1', setNumber: 1, weight: 'not-a-number', reps: 8, completed: true },
          ],
        },
      },
    ];

    const result = validateAndSanitizeHistory(malformedData);
    expect(result.isValid).toBe(true);
    expect(result.validLogs).toHaveLength(2);

    // exercisesLogged on session 1 should be an empty object, not null
    expect(result.validLogs[0].exercisesLogged).toEqual({});
    expect(() => Object.entries(result.validLogs[0].exercisesLogged)).not.toThrow();

    // Invalid non-number weight should be sanitized to empty string
    const benchSets = result.validLogs[1].exercisesLogged['barbell-bench-press'];
    expect(benchSets).toBeDefined();
    expect(benchSets[0].weight).toBe('');
    expect(benchSets[0].reps).toBe(8);
  });
});
