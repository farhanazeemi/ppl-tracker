import { MuscleGroup } from './workout';

export type MovementPattern =
  | 'Horizontal Push'
  | 'Vertical Push'
  | 'Horizontal Pull'
  | 'Vertical Pull'
  | 'Squat'
  | 'Hip Hinge'
  | 'Lunge'
  | 'Knee Extension'
  | 'Knee Flexion'
  | 'Hip Abduction'
  | 'Hip Adduction'
  | 'Shoulder Isolation'
  | 'Arm Isolation'
  | 'Core Flexion'
  | 'Core Anti-Extension'
  | 'Core Anti-Rotation'
  | 'Calf Isolation'
  | 'Carry';

export type EquipmentCategory =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'smith'
  | 'bodyweight'
  | 'bands'
  | 'kettlebell'
  | 'bench'
  | 'pullup_bar';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseMechanics = 'compound' | 'isolation';

export type TrainingGoal = 'hypertrophy' | 'strength' | 'general_fitness' | 'home_workout';

export type RecommendationLabel =
  | 'Best Match'
  | 'Similar Movement'
  | 'Same Primary Muscle'
  | 'Equipment Alternative'
  | 'Home Workout Option';

export interface ExerciseBiomechanics {
  resistanceProfile: string; // e.g. "Peak tension in mid-range"
  stabilizationDemand: 'low' | 'moderate' | 'high';
  stretchEmphasis: boolean;
  jointStressProfile: string; // e.g. "Low axial spine load"
}

export interface SubstitutionExercise {
  id: string;
  name: string;
  slug: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  movementPattern: MovementPattern;
  equipment: EquipmentCategory[];
  exerciseType: ExerciseMechanics;
  difficulty: ExerciseDifficulty;
  description: string;
  instructions: string[];
  cues: string[];
  biomechanics: ExerciseBiomechanics;
  contraindications?: string[];
  aliases?: string[];
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
}

export interface MatchingWeights {
  primaryMuscle: number; // default: 0.30
  movementPattern: number; // default: 0.25
  equipment: number; // default: 0.20
  secondaryMuscle: number; // default: 0.15
  exerciseType: number; // default: 0.10
  goalBonus: number; // default: 0.05
}

export interface FilterOptions {
  availableEquipment: EquipmentCategory[]; // empty = any
  trainingGoal?: TrainingGoal;
  targetMuscle?: MuscleGroup | 'all';
  movementPattern?: MovementPattern | 'all';
  difficulty?: ExerciseDifficulty | 'all';
  exerciseType?: ExerciseMechanics | 'all';
  searchQuery?: string;
}

export interface SubstitutionMatchResult {
  exercise: SubstitutionExercise;
  score: number; // 0 to 100
  scoreLabel: 'High Compatibility' | 'Good Compatibility' | 'Moderate Alternative';
  breakdown: {
    primaryMuscleScore: number;
    movementPatternScore: number;
    secondaryMuscleScore: number;
    equipmentScore: number;
    exerciseTypeScore: number;
    goalBonus: number;
  };
  labels: RecommendationLabel[];
  whyRecommended: string[];
  keyDifferences: string[];
  isExactMovement: boolean;
  equipmentMatch: 'exact' | 'partial' | 'alternative';
}
