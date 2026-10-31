import { describe, it, expect, vi } from 'vitest';
import { useModalAccessibility } from '../src/utils/useModalAccessibility';

describe('A11Y-01: Modal Accessibility (Escape key and scroll lock)', () => {
  it('exports a valid hook function', () => {
    expect(typeof useModalAccessibility).toBe('function');
  });
});
