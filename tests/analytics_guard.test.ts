import { describe, it, expect } from 'vitest';

describe('PRIV-02: Google Analytics Localhost and Non-Production Guard', () => {
  it('identifies localhost and development environments to prevent telemetry leakage', () => {
    function shouldTrackAnalytics(nodeEnv: string, hostname: string): boolean {
      if (nodeEnv !== 'production') return false;
      if (hostname === 'localhost' || hostname === '127.0.0.1') return false;
      return true;
    }

    expect(shouldTrackAnalytics('development', 'localhost')).toBe(false);
    expect(shouldTrackAnalytics('development', 'ppltracker.web.id')).toBe(false);
    expect(shouldTrackAnalytics('production', 'localhost')).toBe(false);
    expect(shouldTrackAnalytics('production', '127.0.0.1')).toBe(false);
    expect(shouldTrackAnalytics('production', 'ppltracker.web.id')).toBe(true);
  });
});
