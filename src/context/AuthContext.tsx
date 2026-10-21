'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  UserProfile,
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from '../types/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    additional?: Partial<UpdateProfileInput>
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
  updateEmail: (data: UpdateEmailInput) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (data: UpdatePasswordInput) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase 'public.profiles' table
  const fetchProfile = useCallback(async (userId: string, authEmail?: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        return {
          id: data.id,
          name: data.name || (authEmail ? authEmail.split('@')[0] : 'Athlete'),
          email: data.email || authEmail || '',
          age: data.age ?? undefined,
          height: data.height ? Number(data.height) : undefined,
          weight: data.weight ? Number(data.weight) : undefined,
          preferredUnit: (data.preferred_unit as 'kg' | 'lbs') || 'kg',
          fitnessGoal: (data.fitness_goal as any) || 'Hypertrophy',
          createdAt: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        };
      }

      // If no profile row exists yet, return default profile based on auth
      return {
        id: userId,
        name: authEmail ? authEmail.split('@')[0] : 'Athlete',
        email: authEmail || '',
        preferredUnit: 'kg',
        fitnessGoal: 'Hypertrophy',
        createdAt: new Date().toISOString().split('T')[0],
      };
    } catch (err) {
      console.error('Failed to load profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id, session.user.email);
      setUser(profile);
    } else {
      setUser(null);
    }
  }, [fetchProfile]);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          if (mounted) setUser(profile);
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

        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email);
          if (mounted) setUser(profile);
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

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
        // Upsert into public.profiles directly to guarantee immediate consistency
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

        await supabase.from('profiles').upsert(profilePayload);

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

    try {
      const updates = {
        name: data.name.trim() || user.name,
        age: typeof data.age === 'number' ? data.age : null,
        height: typeof data.height === 'number' ? data.height : null,
        weight: typeof data.weight === 'number' ? data.weight : null,
        preferred_unit: data.preferredUnit,
        fitness_goal: data.fitnessGoal,
        updated_at: new Date().toISOString(),
      };

      const { error: dbError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (dbError) {
        return { success: false, error: dbError.message };
      }

      // Also update auth user metadata
      await supabase.auth.updateUser({
        data: updates,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: updates.name,
              age: data.age,
              height: data.height,
              weight: data.weight,
              preferredUnit: data.preferredUnit,
              fitnessGoal: data.fitnessGoal,
            }
          : null
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save profile changes to database.' };
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

      // Update in profiles table as well
      await supabase
        .from('profiles')
        .update({ email: cleanNewEmail, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      setUser((prev) => (prev ? { ...prev, email: cleanNewEmail } : null));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update email in database.' };
    }
  };

  const updatePassword = async (
    data: UpdatePasswordInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

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
        isLoading,
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
