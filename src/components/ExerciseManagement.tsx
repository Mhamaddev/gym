import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Exercise, Category } from '../types';
import { useTranslation } from 'react-i18next';

interface ExerciseManagementProps {
  exercises: Exercise[];
  categories: Category[];
  onAddExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => void;
}

export const ExerciseManagement: React.FC<ExerciseManagementProps> = ({ exercises, categories, onAddExercise }) => {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: categories.length > 0 ? categories[0].name : '',
    description: '',
  });

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExercise.name.trim()) {
      onAddExercise(newExercise);
      setNewExercise({ name: '', category: 'chest', description: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('exerciseManagement')}</h1>
            <p className="text-gray-600">{t('manageAndCategorize')}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} className="mr-2" />
            {t('addExercise')}
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchExercises')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">{t('allCategories')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.name} className="capitalize">
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
              {(() => {
                const category = categories.find(cat => cat.name === exercise.category);
                return (
                  <span 
                    className="px-2 py-1 text-white text-xs rounded-full capitalize"
                    style={{ backgroundColor: category?.color || '#6B7280' }}
                  >
                    {exercise.category}
                  </span>
                );
              })()}
            </div>
            {exercise.description && (
              <p className="text-gray-600 text-sm">{exercise.description}</p>
            )}
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <p className="text-gray-500">
            {categories.length === 0 
              ? t('createCategoriesFirst')
              : t('noExercisesFound')
            }
          </p>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 my-8">
            <h2 className="text-xl font-semibold mb-4">{t('addNewExercise')}</h2>
            <form onSubmit={handleAddExercise}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('exerciseName')}
                </label>
                <input
                  type="text"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('category')}
                </label>
                <select
                  value={newExercise.category}
                  onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  {categories.length === 0 && (
                    <option value="">{t('noCategoriesAvailable')}</option>
                  )}
                  {categories.map(category => (
                    <option key={category.id} value={category.name} className="capitalize">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('descriptionOptional')}
                </label>
                <textarea
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={categories.length === 0}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {t('addExercise')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};