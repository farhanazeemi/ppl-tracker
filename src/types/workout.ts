export type SplitDayId = 
  | 'push-a' | 'pull-a' | 'legs-a' | 'push-b' | 'pull-b' | 'legs-b'
  | 'bro-chest' | 'bro-back' | 'bro-shoulders' | 'bro-arms' | 'bro-legs'
  | 'upper-1' | 'lower-1' | 'upper-2' | 'lower-2'
  | 'full-body-1' | 'full-body-2' | 'full-body-3'
  | string;

export type TrainingSplitType = 'ppl' | 'bro-split' | 'upper-lower' | 'full-body';

export type MuscleGroup = 
  | 'Upper Chest'
  | 'Mid Chest'
  | 'Lower Chest'
  | 'Lateral Delts'
  | 'Front Delts'
  | 'Rear Delts'
  | 'Triceps'
  | 'Lats'
  | 'Upper Back'
  | 'Traps'
  | 'Biceps'
  | 'Forearms'
  | 'Quads'
  | 'Hamstrings'
  | 'Glutes'
  | 'Calves'
  | 'Abs';

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weight: number | '';
  reps: number | '';
  completed: boolean;
  isWarmup?: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  target: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  sets: number;
  targetReps: string; // e.g. "8–10"
  minReps: number;
  maxReps: number;
  restSeconds: number;
  restDisplay: string;
  cue: string;
  biomechanicsTip?: string;
  equipment: 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight';
  isPriorityWeakPoint?: boolean;
  weakPointBadge?: string;
}

export interface DayWorkout {
  id: SplitDayId;
  dayNumber: number;
  title: string;
  splitType: 'push' | 'pull' | 'legs' | 'chest' | 'back' | 'shoulders' | 'arms' | 'upper' | 'lower' | 'fullbody';
  subtitle: string;
  focus: string;
  themeColor: 'push' | 'pull' | 'legs' | 'gold' | 'sky';
  accentHex: string;
  dayOfWeekTarget?: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  exercises: ExerciseDefinition[];
}

export interface SplitProgram {
  id: TrainingSplitType;
  name: string;
  daysPerWeek: number;
  description: string;
  idealFor: string;
  days: DayWorkout[];
}

export interface LoggedWorkoutSession {
  id: string;
  dayId: SplitDayId;
  date: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  totalRepsCompleted: number;
  exercisesLogged: Record<string, ExerciseSet[]>;
  doubleProgressionsEarned: string[]; // exercise names that qualified
  notes?: string;
}

export interface AppSettings {
  unit: 'kg' | 'lbs';
  soundEnabled: boolean;
  autoStartTimer: boolean;
  barbellWeight: number; // default 20kg
}
