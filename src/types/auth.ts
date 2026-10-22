export type TrainingSplitId = 'ppl' | 'bro-split' | 'upper-lower' | 'full-body';

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
  onboardingCompleted?: boolean;
  selectedSplit?: TrainingSplitId;
  weakPoints?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  barbellBaseWeight?: number;
}

export interface UpdateProfileInput {
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  preferredUnit: 'kg' | 'lbs';
  fitnessGoal: 'Hypertrophy' | 'Strength' | 'Cutting' | 'Body Recomposition';
  onboardingCompleted?: boolean;
  selectedSplit?: TrainingSplitId;
  weakPoints?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  barbellBaseWeight?: number;
}

export interface UpdateEmailInput {
  newEmail: string;
}

export interface UpdatePasswordInput {
  newPassword: string;
  confirmPassword: string;
}
