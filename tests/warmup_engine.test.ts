import { describe, it, expect } from 'vitest';
import {
  isCompoundMovement,
  snapToGrid,
  generateWarmupLadder,
} from '../src/utils/warmupEngine';

describe('Warm-Up Engine (openGym verified ramp algorithm)', () => {
  it('correctly identifies compound and isolation movements', () => {
    expect(isCompoundMovement('Barbell Bench Press', 'barbell')).toBe(true);
    expect(isCompoundMovement('Conventional Deadlift', 'barbell')).toBe(true);
    expect(isCompoundMovement('Barbell Squat', 'barbell')).toBe(true);
    expect(isCompoundMovement('Pull-Up', 'bodyweight')).toBe(true);
    expect(isCompoundMovement('Overhead Press', 'barbell')).toBe(true);

    expect(isCompoundMovement('Bicep Curl', 'dumbbell')).toBe(false);
    expect(isCompoundMovement('Tricep Pushdown', 'cable')).toBe(false);
    expect(isCompoundMovement('Dumbbell Lateral Raise', 'dumbbell')).toBe(false);
    expect(isCompoundMovement('Leg Extension', 'machine')).toBe(false);
  });

  it('snaps raw weights down to achievable gym plate grids', () => {
    expect(snapToGrid(47.38, 2.5)).toBe(45);
    expect(snapToGrid(74.9, 2.5)).toBe(72.5);
    expect(snapToGrid(100, 2.5)).toBe(100);
    expect(snapToGrid(137.5, 5)).toBe(135);
  });

  it('generates a 4-step progressive warmup ladder for heavy compound lifts', () => {
    const ladder = generateWarmupLadder({
      workWeight: 140,
      unit: 'kg',
      barWeight: 20,
      isCompound: true,
    });

    expect(ladder.length).toBeGreaterThanOrEqual(4);

    // Step 1 should be the bare bar for 10 reps
    expect(ladder[0].weight).toBe(20);
    expect(ladder[0].reps).toBe(10);
    expect(ladder[0].isBarOnly).toBe(true);

    // Subsequent weights should be strictly ascending
    for (let i = 1; i < ladder.length; i++) {
      expect(ladder[i].weight).toBeGreaterThan(ladder[i - 1].weight);
      expect(ladder[i].weight).toBeLessThan(140);
    }

    // Reps should descend as weight climbs (e.g. 10 -> 5 -> 3 -> 2 -> 1)
    expect(ladder[ladder.length - 1].reps).toBeLessThanOrEqual(2);
  });

  it('generates fewer warm-up sets for isolation movements', () => {
    const ladder = generateWarmupLadder({
      workWeight: 20,
      unit: 'kg',
      isCompound: false,
    });

    expect(ladder.length).toBeLessThan(4);
    ladder.forEach((rung) => {
      expect(rung.weight).toBeLessThan(20);
    });
  });

  it('calculates plate breakdowns per side for each warmup rung', () => {
    const ladder = generateWarmupLadder({
      workWeight: 100,
      unit: 'kg',
      barWeight: 20,
      isCompound: true,
    });

    const heavierRung = ladder.find((r) => r.weight >= 60);
    expect(heavierRung).toBeDefined();
    expect(heavierRung?.plates).toBeDefined();
    expect(heavierRung?.plates?.platesPerSide.length).toBeGreaterThan(0);
  });
});
