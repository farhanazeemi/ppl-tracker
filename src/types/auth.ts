export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  preferredUnit: 'kg' | 'lbs';
  fitnessGoal: 'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition';
  createdAt: string;
}

export interface UpdateProfileInput {
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  preferredUnit: 'kg' | 'lbs';
  fitnessGoal: 'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition';
}

export interface UpdateEmailInput {
  newEmail: string;
}

export interface UpdatePasswordInput {
  newPassword: string;
  confirmPassword: string;
}
