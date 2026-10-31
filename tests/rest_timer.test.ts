import { describe, it, expect } from 'vitest';

export function calculateRemainingFromTimestamp(targetEndTime: number, now: number): {
  remaining: number;
  isFinished: boolean;
} {
  const diff = Math.ceil((targetEndTime - now) / 1000);
  if (diff <= 0) {
    return { remaining: 0, isFinished: true };
  }
  return { remaining: diff, isFinished: false };
}

describe('BUG-03: Rest Timer Wall-Clock Timestamp Calculation', () => {
  it('accurately calculates remaining seconds across background tab throttling', () => {
    const startTime = 1000000;
    const durationSeconds = 90;
    const targetEndTime = startTime + durationSeconds * 1000;

    // Simulate 30 seconds passed in background
    const throttledWakeupTime = startTime + 30000;
    const status1 = calculateRemainingFromTimestamp(targetEndTime, throttledWakeupTime);
    expect(status1.remaining).toBe(60);
    expect(status1.isFinished).toBe(false);

    // Simulate 95 seconds passed in background (exceeded rest period)
    const lateWakeupTime = startTime + 95000;
    const status2 = calculateRemainingFromTimestamp(targetEndTime, lateWakeupTime);
    expect(status2.remaining).toBe(0);
    expect(status2.isFinished).toBe(true);
  });

  it('adjusts target timestamp correctly when delta is added', () => {
    const startTime = 1000000;
    let targetEndTime = startTime + 60000; // 60 seconds

    // Add 30 seconds (+30s button)
    targetEndTime += 30000;
    const now = startTime + 10000; // 10 seconds elapsed
    const status = calculateRemainingFromTimestamp(targetEndTime, now);
    expect(status.remaining).toBe(80); // (90 - 10) = 80s remaining
  });
});
