import { describe, it, expect } from 'vitest';

export function shouldSyncWithCloud(user: { id?: string; isGuest?: boolean } | null): boolean {
  if (!user?.id || user.isGuest || user.id === 'guest-athlete') {
    return false;
  }
  return true;
}

describe('BUG-02: Supabase Cloud Sync Guest Mode Guard', () => {
  it('returns false when user is null or undefined', () => {
    expect(shouldSyncWithCloud(null)).toBe(false);
  });

  it('returns false when user is guest-athlete with isGuest true', () => {
    expect(shouldSyncWithCloud({ id: 'guest-athlete', isGuest: true })).toBe(false);
  });

  it('returns false when user is guest-athlete with isGuest undefined', () => {
    expect(shouldSyncWithCloud({ id: 'guest-athlete' })).toBe(false);
  });

  it('returns true for authenticated user with valid UUID and isGuest false', () => {
    expect(shouldSyncWithCloud({ id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', isGuest: false })).toBe(true);
  });
});
