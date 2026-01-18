
import { AppState, UserProfile, Exercise } from './types';

const STORAGE_KEY = 'flextrack_app_data';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Fitness Fan',
  height: 175,
  weight: 70,
  fitnessGoal: 'general-health',
  dailyGoalMinutes: 30,
  dailyGoalCalories: 300,
};

export const loadData = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse storage data', e);
    }
  }
  return {
    profile: DEFAULT_PROFILE,
    workouts: [],
    recentExercises: ['Push Ups', 'Running', 'Bench Press', 'Yoga', 'Squats'],
  };
};

export const saveData = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Fix: Use Exercise['type'] to correctly access the property type from the Exercise interface
export const calculateCalories = (
  type: Exercise['type'],
  duration: number, // minutes
  userWeight: number, // kg
  weightLifted: number = 0
): number => {
  // Rough MET values
  const MET: Record<string, number> = {
    cardio: 8.0,
    strength: 4.5,
    flexibility: 2.5,
    sports: 6.0,
  };
  
  const metValue = MET[type] || 4.0;
  // Calories = MET * weight_kg * (duration_min / 60)
  const cals = metValue * userWeight * (duration / 60);
  
  // Add a small multiplier if weight is involved in strength
  const strengthBonus = type === 'strength' ? (weightLifted * 0.01) : 0;
  
  return Math.round(cals + strengthBonus);
};
