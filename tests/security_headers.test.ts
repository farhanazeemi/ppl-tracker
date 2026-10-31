import { describe, it, expect } from 'vitest';

describe('SEC-02: Content-Security-Policy-Report-Only Header', () => {
  it('contains mandatory security directives covering all external services', async () => {
    // Read next.config.ts content
    const fs = await import('fs');
    const content = fs.readFileSync('next.config.ts', 'utf8');

    expect(content).toContain('Content-Security-Policy-Report-Only');
    expect(content).toContain("default-src 'self'");
    expect(content).toContain('*.supabase.co');
    expect(content).toContain('*.sanity.io');
    expect(content).toContain('www.googletagmanager.com');
    expect(content).toContain("frame-ancestors 'self' https://*.sanity.io");
    expect(content).toContain("object-src 'none'");
  });
});
