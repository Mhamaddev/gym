import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './components/ThemeProvider';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ExerciseManagement } from './components/ExerciseManagement';
import { CategoryManagement } from './components/CategoryManagement';
import { PlayerManagement } from './components/PlayerManagement';
import { WorkoutPlans } from './components/WorkoutPlans';
import { WorkoutPlanForm } from './components/WorkoutPlanForm';
import { Settings } from './components/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Exercise, Player, WorkoutPlan, GymSettings, NavigationTab, Category, CategoryWithDays } from './types';

const defaultSettings: GymSettings = {
  name: 'IRON PARADISE GYM CENTER',
  contactEmail: 'info@ironparadise.com',
  contactPhone: '+1 (555) 123-4567',
  location: 'New York, USA',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
  themeColor: '#F97316',
  language: 'en',
  darkMode: false,
};

const defaultCategories: Category[] = [
  {
    id: 'cat1',
    name: 'chest',
    color: '#F97316',
    description: 'Chest and pectoral exercises',
    createdAt: new Date(),
  },
  {
    id: 'cat2',
    name: 'triceps',
    color: '#EF4444',
    description: 'Tricep and arm extension exercises',
    createdAt: new Date(),
  },
  {
    id: 'cat3',
    name: 'biceps',
    color: '#10B981',
    description: 'Bicep and arm curl exercises',
    createdAt: new Date(),
  },
  {
    id: 'cat4',
    name: 'legs',
    color: '#3B82F6',
    description: 'Leg and lower body exercises',
    createdAt: new Date(),
  },
];

const sampleExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Bench Press',
    category: 'chest',
    description: 'Classic chest exercise with barbell',
    createdAt: new Date(),
  },
  {
    id: 'ex2',
    name: 'Tricep Dips',
    category: 'triceps',
    description: 'Bodyweight tricep exercise',
    createdAt: new Date(),
  },
  {
    id: 'ex3',
    name: 'Bicep Curls',
    category: 'biceps',
    description: 'Isolated bicep exercise with dumbbells',
    createdAt: new Date(),
  },
  {
    id: 'ex4',
    name: 'Squats',
    category: 'legs',
    description: 'Full body compound movement',
    createdAt: new Date(),
  },
];

function App() {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planFormProps, setPlanFormProps] = useState<{
    preselectedPlayerId?: string;
    preselectedPlayerName?: string;
  }>({});

  const [exercises, setExercises] = useLocalStorage<Exercise[]>('gym-exercises', sampleExercises);
  const [players, setPlayers] = useLocalStorage<Player[]>('gym-players', []);
  const [workoutPlans, setWorkoutPlans] = useLocalStorage<WorkoutPlan[]>('gym-workout-plans', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('gym-categories', defaultCategories);
  const [gymSettings, setGymSettings] = useLocalStorage<GymSettings>('gym-settings', defaultSettings);

  // Update document direction and language based on settings
  React.useEffect(() => {
    const isRTL = gymSettings.language === 'ar' || gymSettings.language === 'ku';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', gymSettings.language);
    document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    
    // Change i18n language if different
    if (i18n.language !== gymSettings.language) {
      i18n.changeLanguage(gymSettings.language);
    }
  }, [gymSettings.language, i18n]);

  // Close mobile nav on window resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile nav when language changes (for RTL/LTR switch)
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsNavOpen(false);
    }
  }, [gymSettings.language]);

  const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

  const handleAddExercise = (exerciseData: Omit<Exercise, 'id' | 'createdAt'>) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: generateId(),
      createdAt: new Date(),
    };
    setExercises([...exercises, newExercise]);
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: new Date(),
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (id: string, categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const oldCategory = categories.find(cat => cat.id === id);
    if (oldCategory && oldCategory.name !== categoryData.name) {
      // Update exercises that use this category
      const updatedExercises = exercises.map(exercise => 
        exercise.category === oldCategory.name 
          ? { ...exercise, category: categoryData.name }
          : exercise
      );
      setExercises(updatedExercises);
    }
    
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { ...cat, ...categoryData }
        : cat
    ));
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (categoryToDelete) {
      // Remove exercises in this category or reassign them
      const updatedExercises = exercises.filter(exercise => exercise.category !== categoryToDelete.name);
      setExercises(updatedExercises);
    }
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddPlayer = (playerData: Omit<Player, 'id' | 'createdAt'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: generateId(),
      createdAt: new Date(),
    };
    setPlayers([...players, newPlayer]);
  };

  const handleCreatePlan = (playerId?: string, playerName?: string) => {
    setPlanFormProps({ preselectedPlayerId: playerId, preselectedPlayerName: playerName });
    setShowPlanForm(true);
  };

  const handleSubmitPlan = (planData: {
    playerId: string;
    playerName: string;
    categories: CategoryWithDays[];
    date: Date;
    notes?: string;
  }) => {
    const newPlan: WorkoutPlan = {
      ...planData,
      id: generateId(),
      createdAt: new Date(),
    };
    setWorkoutPlans([...workoutPlans, newPlan]);
    setShowPlanForm(false);
    setPlanFormProps({});
  };

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    // Always close mobile nav when changing tabs on mobile
    const isMobile = window.innerWidth < 1024;
    if (isMobile && isNavOpen) {
      setIsNavOpen(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard exercises={exercises} players={players} workoutPlans={workoutPlans} categories={categories} />;
      case 'exercises':
        return <ExerciseManagement exercises={exercises} categories={categories} onAddExercise={handleAddExercise} />;
      case 'categories':
        return (
          <CategoryManagement
            categories={categories}
            exercises={exercises}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case 'players':
        return (
          <PlayerManagement
            players={players}
            workoutPlans={workoutPlans}
            onAddPlayer={handleAddPlayer}
            onCreatePlan={handleCreatePlan}
          />
        );
      case 'plans':
        return (
          <WorkoutPlans
            workoutPlans={workoutPlans}
            players={players}
            exercises={exercises}
            gymSettings={gymSettings}
            onCreatePlan={() => handleCreatePlan()}
          />
        );
      case 'settings':
        return <Settings settings={gymSettings} onSave={setGymSettings} />;
      default:
        return <Dashboard exercises={exercises} players={players} workoutPlans={workoutPlans} categories={categories} />;
    }
  };

  return (
    <ThemeProvider settings={gymSettings}>
      <div className={`min-h-screen ${gymSettings.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex">
          <Navigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            gymSettings={gymSettings}
            onSettingsChange={setGymSettings}
            isOpen={isNavOpen}
            onToggle={handleNavToggle}
          />
          
          <main className={`flex-1 min-h-screen ${gymSettings.language === 'ar' || gymSettings.language === 'ku' ? 'lg:mr-64' : 'lg:ml-64'} pt-16 lg:pt-0`}>
            {renderActiveTab()}
          </main>
        </div>

        {showPlanForm && (
          <WorkoutPlanForm
            exercises={exercises}
            players={players}
            categories={categories}
            preselectedPlayerId={planFormProps.preselectedPlayerId}
            preselectedPlayerName={planFormProps.preselectedPlayerName}
            onSubmit={handleSubmitPlan}
            onClose={() => {
              setShowPlanForm(false);
              setPlanFormProps({});
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;