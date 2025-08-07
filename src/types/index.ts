export interface Exercise {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt: Date;
}

export interface ExerciseWithSets {
  exercise: Exercise;
  sets: number;
  reps?: string;
  weight?: string;
  notes?: string;
}

export interface CategoryWithDays {
  categoryName: string;
  days: string[];
  exercises: ExerciseWithSets[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
}

export interface Player {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  joinDate: Date;
  createdAt: Date;
}

export interface WorkoutPlan {
  id: string;
  playerId: string;
  playerName: string;
  categories: CategoryWithDays[];
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface GymSettings {
  name: string;
  logo?: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  customFont?: string;
  themeColor: string;
  language: string;
  darkMode: boolean;
}

export type NavigationTab = 'dashboard' | 'exercises' | 'categories' | 'players' | 'plans' | 'settings';