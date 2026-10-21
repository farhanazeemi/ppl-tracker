'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  logout: () => void;
  updateProfile: (data: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
  updateEmail: (data: UpdateEmailInput) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (data: UpdatePasswordInput) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'ppl_registered_users';
const CURRENT_USER_ID_KEY = 'ppl_current_user_id';

// Default demo user for instant testing
const DEFAULT_DEMO_USER: UserProfile = {
  id: 'user-demo-1',
  name: 'Farhan Azeemi',
  email: 'farhanazeemi.dev@gmail.com',
  password: 'password123',
  age: 24,
  height: 178, // cm
  weight: 78.5, // kg
  preferredUnit: 'kg',
  fitnessGoal: 'Hypertrophy',
  createdAt: '2026-01-15',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize users and current session from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      let users: UserProfile[] = [];

      if (!storedUsersRaw) {
        // Initialize with default demo user
        users = [DEFAULT_DEMO_USER];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } else {
        users = JSON.parse(storedUsersRaw);
      }

      const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
      if (currentUserId) {
        const found = users.find((u) => u.id === currentUserId);
        if (found) {
          setUser(found);
        } else if (users.length > 0) {
          setUser(users[0]);
          localStorage.setItem(CURRENT_USER_ID_KEY, users[0].id);
        }
      } else if (users.length > 0) {
        // Auto-login demo user for a friction-free first experience
        setUser(users[0]);
        localStorage.setItem(CURRENT_USER_ID_KEY, users[0].id);
      }
    } catch (err) {
      console.error('Failed to load auth state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStoredUsers = (): UserProfile[] => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [DEFAULT_DEMO_USER];
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  };

  const saveUsers = (users: UserProfile[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setUser(found);
    localStorage.setItem(CURRENT_USER_ID_KEY, found.id);
    return { success: true };
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
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const users = getStoredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      age: additional?.age || undefined,
      height: additional?.height || undefined,
      weight: additional?.weight || undefined,
      preferredUnit: additional?.preferredUnit || 'kg',
      fitnessGoal: additional?.fitnessGoal || 'Hypertrophy',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const nextUsers = [...users, newUser];
    saveUsers(nextUsers);

    setUser(newUser);
    localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  };

  const updateProfile = async (
    data: UpdateProfileInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

    const users = getStoredUsers();
    const updatedUser: UserProfile = {
      ...user,
      name: data.name.trim() || user.name,
      age: data.age,
      height: data.height,
      weight: data.weight,
      preferredUnit: data.preferredUnit,
      fitnessGoal: data.fitnessGoal,
    };

    const nextUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(nextUsers);
    setUser(updatedUser);

    return { success: true };
  };

  const updateEmail = async (
    data: UpdateEmailInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

    const cleanNewEmail = data.newEmail.trim().toLowerCase();

    if (!cleanNewEmail || !cleanNewEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (user.password !== data.currentPassword) {
      return { success: false, error: 'Current password does not match.' };
    }

    const users = getStoredUsers();
    const emailTaken = users.some(
      (u) => u.id !== user.id && u.email.toLowerCase() === cleanNewEmail
    );

    if (emailTaken) {
      return { success: false, error: 'This email is already associated with another account.' };
    }

    const updatedUser: UserProfile = {
      ...user,
      email: cleanNewEmail,
    };

    const nextUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(nextUsers);
    setUser(updatedUser);

    return { success: true };
  };

  const updatePassword = async (
    data: UpdatePasswordInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

    if (user.password !== data.currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (!data.newPassword || data.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: 'New password and confirmation do not match.' };
    }

    const users = getStoredUsers();
    const updatedUser: UserProfile = {
      ...user,
      password: data.newPassword,
    };

    const nextUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(nextUsers);
    setUser(updatedUser);

    return { success: true };
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
