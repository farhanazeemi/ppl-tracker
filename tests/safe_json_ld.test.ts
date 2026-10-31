import { describe, it, expect } from 'vitest';
import { safeJsonLd } from '../src/lib/safeJsonLd';

describe('SEC-03: safeJsonLd XSS sanitization', () => {
  it('escapes closing script tags to prevent HTML script breakout', () => {
    const maliciousPayload = {
      headline: 'Normal Title</script><script>alert("pwned")</script>',
      description: 'Test <img src=x onerror=alert(1)> description & payload',
    };

    const output = safeJsonLd(maliciousPayload);

    // Verify raw '<', '>', and '&' characters are strictly eliminated from serialized output
    expect(output).not.toContain('</script>');
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('<img');
    expect(output).toContain('\\u003c/script\\u003e');
    expect(output).toContain('\\u003cscript\\u003e');
    expect(output).toContain('\\u0026');
  });

  it('preserves valid JSON structure and data types', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PPL Tracker',
      rating: 4.9,
      features: ['Log sets', 'Calculate 1RM'],
    };

    const output = safeJsonLd(schema);
    const parsed = JSON.parse(output);

    expect(parsed.name).toBe('PPL Tracker');
    expect(parsed.rating).toBe(4.9);
    expect(parsed.features).toHaveLength(2);
  });
});
