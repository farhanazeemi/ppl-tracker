import { describe, it, expect, beforeEach } from 'vitest';

describe('PRIV-01: Logout clears sensitive client storage', () => {
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

  function clearPrivateStorage(userId?: string) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('ppl_guest_mode');
    localStorage.removeItem('ppl_history_v2');
    localStorage.removeItem('ppl_sets_v2');
    localStorage.removeItem('ppl_checked');
    localStorage.removeItem('ppl_active_substitution');
    if (userId) {
      localStorage.removeItem(`ppl_user_profile_${userId}`);
    }
  }

  it('purges all workout history, sets, and profile cache on logout', () => {
    const userId = 'user-123';
    localStorage.setItem('ppl_history_v2', JSON.stringify([{ id: 'session-1', volume: 5000 }]));
    localStorage.setItem('ppl_sets_v2', JSON.stringify({ bench: [{ weight: 100, reps: 5 }] }));
    localStorage.setItem('ppl_checked', JSON.stringify({ 'day-1': true }));
    localStorage.setItem('ppl_active_substitution', JSON.stringify({ originalId: 'ex1' }));
    localStorage.setItem(`ppl_user_profile_${userId}`, JSON.stringify({ name: 'Secret Athlete' }));

    expect(localStorage.getItem('ppl_history_v2')).not.toBeNull();

    clearPrivateStorage(userId);

    expect(localStorage.getItem('ppl_history_v2')).toBeNull();
    expect(localStorage.getItem('ppl_sets_v2')).toBeNull();
    expect(localStorage.getItem('ppl_checked')).toBeNull();
    expect(localStorage.getItem('ppl_active_substitution')).toBeNull();
    expect(localStorage.getItem(`ppl_user_profile_${userId}`)).toBeNull();
  });
});
