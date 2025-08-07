import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Dumbbell, FileText, TrendingUp } from 'lucide-react';
import { Exercise, Player, WorkoutPlan, Category } from '../types';
import { format } from 'date-fns';

interface DashboardProps {
  exercises: Exercise[];
  players: Player[];
  workoutPlans: WorkoutPlan[];
  categories: Category[];
}

export const Dashboard: React.FC<DashboardProps> = ({ exercises, players, workoutPlans, categories }) => {
  const { t } = useTranslation();

  const recentPlans = workoutPlans
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: t('totalExercises'),
      value: exercises.length,
      icon: Dumbbell,
      color: 'bg-blue-500',
    },
    {
      title: t('totalPlayers'),
      value: players.length,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: t('workoutPlans'),
      value: workoutPlans.length,
      icon: FileText,
      color: 'bg-orange-500',
    },
    {
      title: t('thisMonth'),
      value: workoutPlans.filter(plan => {
        const planDate = new Date(plan.createdAt);
        const now = new Date();
        return planDate.getMonth() === now.getMonth() && planDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('dashboard')}</h1>
        <p className="text-gray-600">{t('welcomeBack')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Workout Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{t('recentWorkoutPlans')}</h2>
          <div className="space-y-3">
            {recentPlans.length > 0 ? (
              recentPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{plan.playerName}</p>
                    <p className="text-sm text-gray-500">
                      {t('exercises_count', { 
                        count: (plan.categories || []).reduce((total, cat) => total + cat.exercises.length, 0) 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(plan.date), 'MMM dd')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(plan.createdAt), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t('noWorkoutPlans')}</p>
            )}
          </div>
        </div>

        {/* Exercise Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{t('exerciseCategories')}</h2>
          <div className="space-y-3">
            {categories.map((category) => {
              const count = exercises.filter(ex => ex.category === category.name).length;
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-700 capitalize">{category.name}</span>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {count}
                  </span>
                </div>
              );
            })}
            {categories.length === 0 && (
              <p className="text-gray-500 text-center py-4">{t('noCategoriesCreated')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};