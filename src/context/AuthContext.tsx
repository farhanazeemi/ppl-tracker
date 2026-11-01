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

// Local username-to-email mapping helper for offline/instant username login
const getUsernameMap = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('ppl_username_map');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveUsernameMapping = (username: string, email: string) => {
  if (typeof window === 'undefined' || !username || !email) return;
  try {
    const map = getUsernameMap();
    map[username.toLowerCase().trim().replace(/^@/, '')] = email.toLowerCase().trim();
    localStorage.setItem('ppl_username_map', JSON.stringify(map));
  } catch {
    // ignore local storage error
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      username: savedLocal.username || 'guest_lifter',
      avatarUrl: savedLocal.avatarUrl || undefined,
      email: 'local@hypertrophy.app',
      age: savedLocal.age ? Number(savedLocal.age) : undefined,
      height: savedLocal.height ? Number(savedLocal.height) : undefined,
      weight: savedLocal.weight ? Number(savedLocal.weight) : undefined,
      preferredUnit: savedLocal.preferredUnit || 'kg',
      fitnessGoal: savedLocal.fitnessGoal || 'Hypertrophy',
      selectedExercise: savedLocal.selectedExercise || 'Barbell Bench Press',
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

        const resolvedUsername =
          data?.username ||
          authMetadata?.username ||
          localMeta.username ||
          (authEmail ? authEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'athlete');

        const resolvedAvatar =
          data?.avatar_url ||
          authMetadata?.avatar_url ||
          authMetadata?.picture ||
          localMeta.avatarUrl ||
          undefined;

        const resolvedExercise =
          data?.selected_exercise ||
          authMetadata?.selected_exercise ||
          localMeta.selectedExercise ||
          'Barbell Bench Press';

        if (data) {
          return {
            id: data.id,
            name: resolvedName,
            username: resolvedUsername,
            avatarUrl: resolvedAvatar,
            email: data.email || authEmail || '',
            age: data.age !== undefined && data.age !== null ? Number(data.age) : (localMeta.age ?? undefined),
            height: data.height ? Number(data.height) : (localMeta.height ?? undefined),
            weight: data.weight ? Number(data.weight) : (localMeta.weight ?? undefined),
            preferredUnit: (data.preferred_unit as 'kg' | 'lbs') || localMeta.preferredUnit || 'kg',
            fitnessGoal: (data.fitness_goal as any) || localMeta.fitnessGoal || 'Hypertrophy',
            selectedExercise: resolvedExercise,
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
          username: resolvedUsername,
          avatarUrl: resolvedAvatar,
          email: authEmail || '',
          age: localMeta.age ?? undefined,
          height: localMeta.height ?? undefined,
          weight: localMeta.weight ?? undefined,
          preferredUnit: localMeta.preferredUnit || 'kg',
          fitnessGoal: localMeta.fitnessGoal || 'Hypertrophy',
          selectedExercise: resolvedExercise,
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
            username: resolvedUsername,
            email: authEmail || '',
            avatar_url: resolvedAvatar || null,
            preferred_unit: defaultProfile.preferredUnit,
            fitness_goal: defaultProfile.fitnessGoal,
            selected_exercise: resolvedExercise,
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
        } else if (mounted) {
          setUser((prev) => prev || createGuestProfile());
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
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const rawId = identifier.trim().toLowerCase();
    const cleanId = rawId.replace(/^@/, '');

    if (!cleanId) {
      return { success: false, error: 'Please enter your email or username.' };
    }

    let targetEmail = rawId;

    // Check if user entered a username instead of email
    if (!cleanId.includes('@')) {
      // 1. Query Supabase profiles table for matching username
      try {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', cleanId)
          .maybeSingle();

        if (profileRow?.email) {
          targetEmail = profileRow.email;
        }
      } catch {
        // Fallback to local map
      }

      // 2. Check local username map if query didn't find it
      if (!targetEmail.includes('@')) {
        const localMap = getUsernameMap();
        if (localMap[cleanId]) {
          targetEmail = localMap[cleanId];
        }
      }

      // 3. If still not resolved to an email
      if (!targetEmail.includes('@')) {
        return {
          success: false,
          error: `No account found with username @${cleanId}. Please verify your username or sign in with your email address.`,
        };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
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
    additional?: Partial<UpdateProfileInput>,
    username?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const rawUsername = (username || additional?.username || '').trim().toLowerCase().replace(/^@/, '');
    const cleanUsername = rawUsername || cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '_');

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (cleanUsername && !/^[a-zA-Z0-9_]{3,24}$/.test(cleanUsername)) {
      return { success: false, error: 'Username must be 3-24 characters containing only letters, numbers, and underscores.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
            username: cleanUsername,
            avatar_url: additional?.avatarUrl,
            age: additional?.age,
            height: additional?.height,
            weight: additional?.weight,
            preferred_unit: additional?.preferredUnit || 'kg',
            fitness_goal: additional?.fitnessGoal || 'Hypertrophy',
            selected_exercise: additional?.selectedExercise || 'Barbell Bench Press',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Save username mapping locally
        if (cleanUsername) {
          saveUsernameMapping(cleanUsername, cleanEmail);
        }

        // Save locally first
        saveLocalProfileMeta(data.user.id, {
          name: cleanName,
          username: cleanUsername,
          avatarUrl: additional?.avatarUrl,
          age: additional?.age,
          height: additional?.height,
          weight: additional?.weight,
          preferredUnit: additional?.preferredUnit || 'kg',
          fitnessGoal: additional?.fitnessGoal || 'Hypertrophy',
          selectedExercise: additional?.selectedExercise || 'Barbell Bench Press',
          onboardingCompleted: additional?.onboardingCompleted ?? false,
          selectedSplit: additional?.selectedSplit ?? 'ppl',
          weakPoints: additional?.weakPoints ?? [],
          experienceLevel: additional?.experienceLevel ?? 'Intermediate',
          barbellBaseWeight: additional?.barbellBaseWeight ?? 20,
        });

        // Upsert into public.profiles
        const profilePayload: Record<string, any> = {
          id: data.user.id,
          name: cleanName,
          username: cleanUsername,
          email: cleanEmail,
          avatar_url: additional?.avatarUrl ?? null,
          age: additional?.age ?? null,
          height: additional?.height ?? null,
          weight: additional?.weight ?? null,
          selected_exercise: additional?.selectedExercise ?? 'Barbell Bench Press',
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
        localStorage.removeItem('ppl_history_v2');
        localStorage.removeItem('ppl_sets_v2');
        localStorage.removeItem('ppl_checked');
        localStorage.removeItem('ppl_active_substitution');
        if (user?.id) {
          localStorage.removeItem(`ppl_user_profile_${user.id}`);
        }
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

    const cleanUsername = data.username !== undefined
      ? data.username.trim().toLowerCase().replace(/^@/, '')
      : user.username;

    if (cleanUsername && !/^[a-zA-Z0-9_]{3,24}$/.test(cleanUsername)) {
      return { success: false, error: 'Username must be 3-24 characters containing only letters, numbers, and underscores.' };
    }

    if (user.isGuest) {
      const updatedGuest: UserProfile = {
        ...user,
        name: data.name?.trim() || user.name,
        username: cleanUsername || user.username,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : user.avatarUrl,
        age: data.age !== undefined ? (typeof data.age === 'number' ? data.age : undefined) : user.age,
        height: data.height !== undefined ? (typeof data.height === 'number' ? data.height : undefined) : user.height,
        weight: data.weight !== undefined ? (typeof data.weight === 'number' ? data.weight : undefined) : user.weight,
        preferredUnit: data.preferredUnit ?? user.preferredUnit,
        fitnessGoal: data.fitnessGoal ?? user.fitnessGoal,
        selectedExercise: data.selectedExercise !== undefined ? data.selectedExercise : user.selectedExercise,
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
      if (cleanUsername && user.email) {
        saveUsernameMapping(cleanUsername, user.email);
      }

      // Save locally to guarantee offline / immediate availability
      saveLocalProfileMeta(user.id, {
        name: data.name?.trim() || user.name,
        username: cleanUsername || user.username,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : user.avatarUrl,
        age: data.age !== undefined ? data.age : user.age,
        height: data.height !== undefined ? data.height : user.height,
        weight: data.weight !== undefined ? data.weight : user.weight,
        preferredUnit: data.preferredUnit !== undefined ? data.preferredUnit : user.preferredUnit,
        fitnessGoal: data.fitnessGoal !== undefined ? data.fitnessGoal : user.fitnessGoal,
        selectedExercise: data.selectedExercise !== undefined ? data.selectedExercise : user.selectedExercise,
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
      if (cleanUsername !== undefined) updates.username = cleanUsername;
      if (data.avatarUrl !== undefined) updates.avatar_url = data.avatarUrl;
      if (data.age !== undefined) updates.age = typeof data.age === 'number' ? data.age : null;
      if (data.height !== undefined) updates.height = typeof data.height === 'number' ? data.height : null;
      if (data.weight !== undefined) updates.weight = typeof data.weight === 'number' ? data.weight : null;
      if (data.preferredUnit !== undefined) updates.preferred_unit = data.preferredUnit;
      if (data.fitnessGoal !== undefined) updates.fitness_goal = data.fitnessGoal;
      if (data.selectedExercise !== undefined) updates.selected_exercise = data.selectedExercise;
      if (data.selectedSplit !== undefined) updates.selected_split = data.selectedSplit;
      if (data.weakPoints !== undefined) updates.weak_points = data.weakPoints;
      if (data.experienceLevel !== undefined) updates.experience_level = data.experienceLevel;
      if (data.barbellBaseWeight !== undefined) updates.barbell_base_weight = data.barbellBaseWeight;

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
              username: cleanUsername || prev.username,
              avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : prev.avatarUrl,
              age: data.age !== undefined ? data.age : prev.age,
              height: data.height !== undefined ? data.height : prev.height,
              weight: data.weight !== undefined ? data.weight : prev.weight,
              preferredUnit: data.preferredUnit !== undefined ? data.preferredUnit : prev.preferredUnit,
              fitnessGoal: data.fitnessGoal !== undefined ? data.fitnessGoal : prev.fitnessGoal,
              selectedExercise: data.selectedExercise !== undefined ? data.selectedExercise : prev.selectedExercise,
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
