
export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'sports';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  date: string; // ISO format
  sets?: number;
  reps?: number;
  weight?: number; // kg
  duration: number; // minutes
  distance?: number; // km
  calories: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  age?: number;
  gender?: string;
  height: number; // cm
  weight: number; // kg
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'endurance' | 'general-health';
  dailyGoalMinutes: number;
  dailyGoalCalories: number;
}

export interface AppState {
  profile: UserProfile;
  workouts: Exercise[];
  recentExercises: string[]; // List of unique names for autocomplete
}
