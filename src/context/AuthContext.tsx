'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  UserProfile,
  AuthContextType,
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const createGuestProfile = (): UserProfile => {
    let savedLocal: any = {};
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('ppl_guest_profile');
        if (raw) savedLocal = JSON.parse(raw);
      } catch {
        // ignore error
      }
    }
    return {
      id: 'guest-athlete',
      name: savedLocal.name || 'Athlete (Guest)',
      email: 'local@hypertrophy.app',
      preferredUnit: savedLocal.preferredUnit || 'kg',
      fitnessGoal: savedLocal.fitnessGoal || 'Hypertrophy',
      createdAt: new Date().toISOString().split('T')[0],
      onboardingCompleted: true,
      selectedSplit: savedLocal.selectedSplit || 'ppl',
      weakPoints: savedLocal.weakPoints || [],
      experienceLevel: savedLocal.experienceLevel || 'Intermediate',
      barbellBaseWeight: savedLocal.barbellBaseWeight || 20,
      isGuest: true,
    };
  };

  const continueAsGuest = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ppl_guest_mode', 'true');
    }
    setUser(createGuestProfile());
  };

  // Helper to read local overrides
  const getLocalProfileMeta = (userId: string) => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(`ppl_user_profile_${userId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saveLocalProfileMeta = (userId: string, data: Partial<UserProfile>) => {
    if (typeof window === 'undefined') return;
    try {
      const existing = getLocalProfileMeta(userId);
      const updated = { ...existing, ...data };
      localStorage.setItem(`ppl_user_profile_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profile locally:', e);
    }
  };

  // Fetch user profile from Supabase 'public.profiles' table + merge local preferences
  const fetchProfile = useCallback(
    async (userId: string, authEmail?: string, authMetadata?: any): Promise<UserProfile | null> => {
      try {
        const localMeta = getLocalProfileMeta(userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // Table or row not found, ignore error
        }

        const resolvedName =
          data?.name ||
          authMetadata?.full_name ||
          authMetadata?.name ||
          (authEmail ? authEmail.split('@')[0] : 'Athlete');

        if (data) {
          return {
            id: data.id,
            name: resolvedName,
            email: data.email || authEmail || '',
            age: data.age ?? localMeta.age ?? undefined,
            height: data.height ? Number(data.height) : (localMeta.height ?? undefined),
            weight: data.weight ? Number(data.weight) : (localMeta.weight ?? undefined),
            preferredUnit: (data.preferred_unit as 'kg' | 'lbs') || localMeta.preferredUnit || 'kg',
            fitnessGoal: (data.fitness_goal as any) || localMeta.fitnessGoal || 'Hypertrophy',
            createdAt: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            onboardingCompleted: localMeta.onboardingCompleted ?? (data.onboarding_completed || false),
            selectedSplit: localMeta.selectedSplit || data.selected_split || 'ppl',
            weakPoints: localMeta.weakPoints || data.weak_points || [],
            experienceLevel: localMeta.experienceLevel || data.experience_level || 'Intermediate',
            barbellBaseWeight: localMeta.barbellBaseWeight || 20,
          };
        }

        // If no profile row exists yet (e.g. Google OAuth signup), return default profile and auto-upsert
        const defaultProfile: UserProfile = {
          id: userId,
          name: resolvedName,
          email: authEmail || '',
          preferredUnit: localMeta.preferredUnit || 'kg',
          fitnessGoal: localMeta.fitnessGoal || 'Hypertrophy',
          createdAt: new Date().toISOString().split('T')[0],
          onboardingCompleted: localMeta.onboardingCompleted || false,
          selectedSplit: localMeta.selectedSplit || 'ppl',
          weakPoints: localMeta.weakPoints || [],
          experienceLevel: localMeta.experienceLevel || 'Intermediate',
          barbellBaseWeight: localMeta.barbellBaseWeight || 20,
        };

        try {
          await supabase.from('profiles').upsert({
            id: userId,
            name: resolvedName,
            email: authEmail || '',
            preferred_unit: defaultProfile.preferredUnit,
            fitness_goal: defaultProfile.fitnessGoal,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // Ignore if table schema differs
        }

        return defaultProfile;
      } catch (err) {
        console.error('Failed to load profile:', err);
        return null;
      }
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      setUser(profile);
    } else {
      setUser(null);
    }
  }, [fetchProfile]);

  // Listen to Supabase Auth state changes & recovery tokens
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Detect password recovery in URL hash or query params
        if (typeof window !== 'undefined') {
          const hash = window.location.hash || '';
          const search = window.location.search || '';
          if (
            hash.includes('type=recovery') ||
            search.includes('type=recovery') ||
            search.includes('reset_password=true')
          ) {
            setIsPasswordRecovery(true);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
          if (mounted) setUser(profile);
        } else if (typeof window !== 'undefined' && localStorage.getItem('ppl_guest_mode') === 'true' && mounted) {
          setUser(createGuestProfile());
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'PASSWORD_RECOVERY') {
          setIsPasswordRecovery(true);
        }

        if (session?.user) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('ppl_guest_mode');
          }
          const profile = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
          if (mounted) setUser(profile);
        } else {
          if (mounted && !isPasswordRecovery) setUser(null);
        }
        if (mounted) setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, isPasswordRecovery]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ppl_guest_mode');
        }
        const profile = await fetchProfile(data.user.id, data.user.email);
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please check your credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    additional?: Partial<UpdateProfileInput>
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
            age: additional?.age,
            height: additional?.height,
            weight: additional?.weight,
            preferred_unit: additional?.preferredUnit || 'kg',
            fitness_goal: additional?.fitnessGoal || 'Hypertrophy',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Save locally first
        saveLocalProfileMeta(data.user.id, {
          onboardingCompleted: additional?.onboardingCompleted ?? false,
          selectedSplit: additional?.selectedSplit ?? 'ppl',
          weakPoints: additional?.weakPoints ?? [],
          experienceLevel: additional?.experienceLevel ?? 'Intermediate',
          barbellBaseWeight: additional?.barbellBaseWeight ?? 20,
        });

        // Upsert into public.profiles
        const profilePayload = {
          id: data.user.id,
          name: cleanName,
          email: cleanEmail,
          age: additional?.age ?? null,
          height: additional?.height ?? null,
          weight: additional?.weight ?? null,
          preferred_unit: additional?.preferredUnit || 'kg',
          fitness_goal: additional?.fitnessGoal || 'Hypertrophy',
          updated_at: new Date().toISOString(),
        };

        try {
          await supabase.from('profiles').upsert(profilePayload);
        } catch {
          // Ignore if table schema differs
        }

        if (typeof window !== 'undefined') {
          localStorage.removeItem('ppl_guest_mode');
        }
        const profile = await fetchProfile(data.user.id, data.user.email);
        setUser(profile);
        return { success: true };
      }

      return { success: false, error: 'Signup did not return a user session.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ppl_guest_mode');
      }
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (
    data: UpdateProfileInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

    if (user.isGuest) {
      const updatedGuest: UserProfile = {
        ...user,
        name: data.name?.trim() || user.name,
        age: data.age ?? user.age,
        height: data.height ?? user.height,
        weight: data.weight ?? user.weight,
        preferredUnit: data.preferredUnit ?? user.preferredUnit,
        fitnessGoal: data.fitnessGoal ?? user.fitnessGoal,
        onboardingCompleted: data.onboardingCompleted ?? user.onboardingCompleted,
        selectedSplit: data.selectedSplit ?? user.selectedSplit,
        weakPoints: data.weakPoints ?? user.weakPoints,
        experienceLevel: data.experienceLevel ?? user.experienceLevel,
        barbellBaseWeight: data.barbellBaseWeight ?? user.barbellBaseWeight,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ppl_guest_profile', JSON.stringify(updatedGuest));
      }
      setUser(updatedGuest);
      return { success: true };
    }

    try {
      // Save locally to guarantee offline / immediate availability
      saveLocalProfileMeta(user.id, {
        name: data.name?.trim() || user.name,
        age: data.age !== undefined ? data.age : user.age,
        height: data.height !== undefined ? data.height : user.height,
        weight: data.weight !== undefined ? data.weight : user.weight,
        preferredUnit: data.preferredUnit !== undefined ? data.preferredUnit : user.preferredUnit,
        fitnessGoal: data.fitnessGoal !== undefined ? data.fitnessGoal : user.fitnessGoal,
        onboardingCompleted: data.onboardingCompleted ?? user.onboardingCompleted,
        selectedSplit: data.selectedSplit ?? user.selectedSplit,
        weakPoints: data.weakPoints ?? user.weakPoints,
        experienceLevel: data.experienceLevel ?? user.experienceLevel,
        barbellBaseWeight: data.barbellBaseWeight ?? user.barbellBaseWeight,
      });

      const updates: Record<string, any> = {
        name: data.name?.trim() || user.name,
        updated_at: new Date().toISOString(),
      };
      if (data.age !== undefined) updates.age = typeof data.age === 'number' ? data.age : null;
      if (data.height !== undefined) updates.height = typeof data.height === 'number' ? data.height : null;
      if (data.weight !== undefined) updates.weight = typeof data.weight === 'number' ? data.weight : null;
      if (data.preferredUnit !== undefined) updates.preferred_unit = data.preferredUnit;
      if (data.fitnessGoal !== undefined) updates.fitness_goal = data.fitnessGoal;
      if (data.selectedSplit !== undefined) updates.selected_split = data.selectedSplit;
      if (data.weakPoints !== undefined) updates.weak_points = data.weakPoints;
      if (data.experienceLevel !== undefined) updates.experience_level = data.experienceLevel;

      try {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
      } catch {
        // Table or column update fallback
      }

      // Also update auth user metadata if possible
      try {
        await supabase.auth.updateUser({
          data: updates,
        });
      } catch {
        // Fallback
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: data.name?.trim() || prev.name,
              age: data.age !== undefined ? data.age : prev.age,
              height: data.height !== undefined ? data.height : prev.height,
              weight: data.weight !== undefined ? data.weight : prev.weight,
              preferredUnit: data.preferredUnit !== undefined ? data.preferredUnit : prev.preferredUnit,
              fitnessGoal: data.fitnessGoal !== undefined ? data.fitnessGoal : prev.fitnessGoal,
              onboardingCompleted: data.onboardingCompleted ?? prev.onboardingCompleted,
              selectedSplit: data.selectedSplit ?? prev.selectedSplit,
              weakPoints: data.weakPoints ?? prev.weakPoints,
              experienceLevel: data.experienceLevel ?? prev.experienceLevel,
              barbellBaseWeight: data.barbellBaseWeight ?? prev.barbellBaseWeight,
            }
          : null
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save profile changes.' };
    }
  };

  const updateEmail = async (
    data: UpdateEmailInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

    const cleanNewEmail = data.newEmail.trim().toLowerCase();
    if (!cleanNewEmail || !cleanNewEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: cleanNewEmail,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      try {
        await supabase
          .from('profiles')
          .update({ email: cleanNewEmail, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      } catch {
        // Ignore table error
      }

      setUser((prev) => (prev ? { ...prev, email: cleanNewEmail } : null));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update email in database.' };
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ppl_guest_mode');
      }
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google Sign-In failed.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?type=recovery`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send password reset email.' };
    }
  };

  const updatePassword = async (
    data: UpdatePasswordInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!data.newPassword || data.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: 'New password and confirm password do not match.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setIsPasswordRecovery(false);

      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isGuest: !!user?.isGuest,
        isLoading,
        isPasswordRecovery,
        setIsPasswordRecovery,
        continueAsGuest,
        signInWithGoogle,
        resetPassword,
        login,
        signup,
        logout,
        updateProfile,
        updateEmail,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
