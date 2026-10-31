import { describe, it, expect } from 'vitest';

describe('BUG-07: Build ID Cache Busting', () => {
  it('does not define a static generateBuildId in next.config.ts', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('next.config.ts', 'utf8');

    expect(content).not.toContain('generateBuildId');
    expect(content).not.toContain('production-build-id');
  });
});
