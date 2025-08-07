import React, { useState } from 'react';
import { X, Check, Calendar, User, Plus, Minus, Dumbbell } from 'lucide-react';
import { Exercise, Player, Category, ExerciseWithSets, CategoryWithDays } from '../types';
import { useTranslation } from 'react-i18next';

interface WorkoutPlanFormProps {
  exercises: Exercise[];
  players: Player[];
  categories: Category[];
  preselectedPlayerId?: string;
  preselectedPlayerName?: string;
  onSubmit: (plan: {
    playerId: string;
    playerName: string;
    categories: CategoryWithDays[];
    date: Date;
    notes?: string;
  }) => void;
  onClose: () => void;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({ 
  exercises, 
  players,
  categories,
  preselectedPlayerId,
  preselectedPlayerName,
  onSubmit, 
  onClose 
}) => {
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState(preselectedPlayerId || '');
  const [selectedCategories, setSelectedCategories] = useState<CategoryWithDays[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const playerName = preselectedPlayerName || selectedPlayer?.fullName || '';

  const addCategory = () => {
    if (categories.length === 0) return;
    
    const availableCategories = categories.filter(cat => 
      !selectedCategories.some(sc => sc.categoryName === cat.name)
    );
    
    if (availableCategories.length > 0) {
      const newCategory: CategoryWithDays = {
        categoryName: availableCategories[0].name,
        days: ['Monday'],
        exercises: []
      };
      setSelectedCategories([...selectedCategories, newCategory]);
    }
  };

  const removeCategory = (index: number) => {
    setSelectedCategories(selectedCategories.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index: number, categoryName: string) => {
    const updated = [...selectedCategories];
    updated[index] = { ...updated[index], categoryName, exercises: [] };
    setSelectedCategories(updated);
  };

  const updateCategoryDays = (index: number, days: string[]) => {
    const updated = [...selectedCategories];
    updated[index] = { ...updated[index], days };
    setSelectedCategories(updated);
  };

  const addExerciseToCategory = (categoryIndex: number) => {
    const category = selectedCategories[categoryIndex];
    const categoryExercises = exercises.filter(ex => ex.category === category.categoryName);
    
    if (categoryExercises.length === 0) return;
    
    const availableExercises = categoryExercises.filter(ex => 
      !category.exercises.some(ce => ce.exercise.id === ex.id)
    );
    
    if (availableExercises.length > 0) {
      const newExercise: ExerciseWithSets = {
        exercise: availableExercises[0],
        sets: 3,
        reps: '10-12',
        weight: '',
        notes: ''
      };
      
      const updated = [...selectedCategories];
      updated[categoryIndex].exercises.push(newExercise);
      setSelectedCategories(updated);
    }
  };

  const removeExerciseFromCategory = (categoryIndex: number, exerciseIndex: number) => {
    const updated = [...selectedCategories];
    updated[categoryIndex].exercises.splice(exerciseIndex, 1);
    setSelectedCategories(updated);
  };

  const updateExerciseInCategory = (categoryIndex: number, exerciseIndex: number, field: keyof ExerciseWithSets, value: any) => {
    const updated = [...selectedCategories];
    updated[categoryIndex].exercises[exerciseIndex] = {
      ...updated[categoryIndex].exercises[exerciseIndex],
      [field]: value
    };
    setSelectedCategories(updated);
  };

  const getTotalExercises = () => {
    return selectedCategories.reduce((total, cat) => total + cat.exercises.length, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayerId && playerName && selectedCategories.length > 0) {
      onSubmit({
        playerId: selectedPlayerId,
        playerName,
        categories: selectedCategories,
        date: new Date(date),
        notes: notes.trim() || undefined,
      });
    }
  };

  const handleDayToggle = (categoryIndex: number, day: string) => {
    const category = selectedCategories[categoryIndex];
    const newDays = category.days.includes(day)
      ? category.days.filter(d => d !== day)
      : [...category.days, day];
    updateCategoryDays(categoryIndex, newDays);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{t('createWorkoutPlan')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Player Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  {t('player')} *
                </label>
                {preselectedPlayerId ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-900">{preselectedPlayerName}</p>
                    <p className="text-sm text-orange-700">ID: {preselectedPlayerId}</p>
                  </div>
                ) : (
                  <select
                    value={selectedPlayerId}
                    onChange={(e) => setSelectedPlayerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t('selectPlayer_')}</option>
                    {players.map(player => (
                      <option key={player.id} value={player.id}>
                        {player.fullName} (ID: {player.id})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  {t('date')} *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Categories and Exercises */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('workoutCategories')} ({getTotalExercises()} {t('totalExercisesForm')})
                </h3>
                <button
                  type="button"
                  onClick={addCategory}
                  disabled={selectedCategories.length >= categories.length}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Plus size={16} />
                  {t('addCategory')}
                </button>
              </div>

              <div className="space-y-6">
                {selectedCategories.map((categoryData, categoryIndex) => {
                  const category = categories.find(cat => cat.name === categoryData.categoryName);
                  const categoryExercises = exercises.filter(ex => ex.category === categoryData.categoryName);
                  
                  return (
                    <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category?.color || '#6B7280' }}
                          />
                          <select
                            value={categoryData.categoryName}
                            onChange={(e) => updateCategoryName(categoryIndex, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            {categories.map(cat => (
                              <option 
                                key={cat.id} 
                                value={cat.name}
                                disabled={selectedCategories.some(sc => sc.categoryName === cat.name && sc !== categoryData)}
                                className="capitalize"
                              >
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCategory(categoryIndex)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Days Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('trainingDays')} *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map(day => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDayToggle(categoryIndex, day)}
                              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                categoryData.days.includes(day)
                                  ? 'bg-orange-600 text-white border-orange-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Exercises */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-700">
                            {t('exercises')} ({categoryData.exercises.length})
                          </label>
                          <button
                            type="button"
                            onClick={() => addExerciseToCategory(categoryIndex)}
                            disabled={categoryData.exercises.length >= categoryExercises.length}
                            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={12} />
                            {t('addExercise')}
                          </button>
                        </div>

                        <div className="space-y-3">
                          {categoryData.exercises.map((exerciseData, exerciseIndex) => (
                            <div key={exerciseIndex} className="bg-gray-50 rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('exercise')}</label>
                                  <select
                                    value={exerciseData.exercise.id}
                                    onChange={(e) => {
                                      const exercise = categoryExercises.find(ex => ex.id === e.target.value);
                                      if (exercise) {
                                        updateExerciseInCategory(categoryIndex, exerciseIndex, 'exercise', exercise);
                                      }
                                    }}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                                  >
                                    {categoryExercises.map(exercise => (
                                      <option key={exercise.id} value={exercise.id}>
                                        {exercise.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('sets')}</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={exerciseData.sets}
                                    onChange={(e) => updateExerciseInCategory(categoryIndex, exerciseIndex, 'sets', parseInt(e.target.value) || 1)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('reps')}</label>
                                  <input
                                    type="text"
                                    value={exerciseData.reps || ''}
                                    onChange={(e) => updateExerciseInCategory(categoryIndex, exerciseIndex, 'reps', e.target.value)}
                                    placeholder="e.g., 10-12"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('weight')}</label>
                                  <input
                                    type="text"
                                    value={exerciseData.weight || ''}
                                    onChange={(e) => updateExerciseInCategory(categoryIndex, exerciseIndex, 'weight', e.target.value)}
                                    placeholder="e.g., 50kg"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">{t('exerciseNotes')}</label>
                                  <input
                                    type="text"
                                    value={exerciseData.notes || ''}
                                    onChange={(e) => updateExerciseInCategory(categoryIndex, exerciseIndex, 'notes', e.target.value)}
                                    placeholder={t('additionalNotesForExercise')}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeExerciseFromCategory(categoryIndex, exerciseIndex)}
                                  className="mt-5 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {categoryData.exercises.length === 0 && (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              <Dumbbell size={24} className="mx-auto mb-2 text-gray-300" />
                              {t('noExercisesAddedYet')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {selectedCategories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mb-4">
                      <Dumbbell size={48} className="mx-auto text-gray-300" />
                    </div>
                    <p className="mb-2">{t('noCategoriesAddedYet')}</p>
                    <button
                      type="button"
                      onClick={addCategory}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      {t('addYourFirstCategory')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('notesOptional')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('addNotes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={!selectedPlayerId || !playerName || selectedCategories.length === 0 || getTotalExercises() === 0}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('createPlan_', { count: getTotalExercises() })}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};