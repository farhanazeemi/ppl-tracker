import { describe, it, expect, beforeEach } from 'vitest';

describe('Username authentication and mapping tests', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    global.window = {} as any;
    global.localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
      length: 0,
      key: () => null,
    };
  });

  const validateUsername = (username: string): boolean => {
    const clean = username.trim().toLowerCase().replace(/^@/, '');
    return /^[a-zA-Z0-9_]{3,24}$/.test(clean);
  };

  const saveMapping = (username: string, email: string) => {
    const raw = localStorage.getItem('ppl_username_map');
    const map = raw ? JSON.parse(raw) : {};
    map[username.toLowerCase().trim().replace(/^@/, '')] = email.toLowerCase().trim();
    localStorage.setItem('ppl_username_map', JSON.stringify(map));
  };

  const resolveIdentifier = (identifier: string): string => {
    const clean = identifier.trim().toLowerCase().replace(/^@/, '');
    if (clean.includes('@')) return clean;
    const raw = localStorage.getItem('ppl_username_map');
    const map = raw ? JSON.parse(raw) : {};
    return map[clean] || clean;
  };

  it('validates acceptable usernames and rejects invalid characters or length', () => {
    expect(validateUsername('alex_lifts')).toBe(true);
    expect(validateUsername('@alex_lifts')).toBe(true);
    expect(validateUsername('powerlifter99')).toBe(true);
    expect(validateUsername('ab')).toBe(false); // too short
    expect(validateUsername('alex lifts')).toBe(false); // space not allowed
    expect(validateUsername('alex$lifts')).toBe(false); // special char not allowed
  });

  it('correctly maps username to email for login resolution', () => {
    saveMapping('hypertrophy_beast', 'athlete@ppltracker.web.id');
    expect(resolveIdentifier('hypertrophy_beast')).toBe('athlete@ppltracker.web.id');
    expect(resolveIdentifier('@hypertrophy_beast')).toBe('athlete@ppltracker.web.id');
    expect(resolveIdentifier('direct@email.com')).toBe('direct@email.com');
  });
});
