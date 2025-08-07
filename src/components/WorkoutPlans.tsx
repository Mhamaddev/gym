import React, { useState } from 'react';
import { Plus, Download, Calendar, User } from 'lucide-react';
import { WorkoutPlan, Player, Exercise, GymSettings, CategoryWithDays } from '../types';
import { format } from 'date-fns';
import { generateWorkoutPlanPDF } from '../utils/pdfGenerator';

interface WorkoutPlansProps {
  workoutPlans: WorkoutPlan[];
  players: Player[];
  exercises: Exercise[];
  gymSettings: GymSettings;
  onCreatePlan: () => void;
}

export const WorkoutPlans: React.FC<WorkoutPlansProps> = ({ 
  workoutPlans, 
  players, 
  exercises,
  gymSettings,
  onCreatePlan 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const sortedPlans = workoutPlans.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getTotalExercises = (plan: WorkoutPlan) => {
    return (plan.categories || []).reduce((total, cat) => total + cat.exercises.length, 0);
  };

  const handleDownloadPDF = async (plan: WorkoutPlan) => {
    setIsGeneratingPDF(true);
    try {
      console.log('Starting PDF download for plan:', plan.id);
      await generateWorkoutPlanPDF(plan, gymSettings);
      console.log('PDF download completed successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.';
      alert(`PDF Generation Error: ${errorMessage}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Workout Plans</h1>
            <p className="text-gray-600">Manage and view all workout plans.</p>
          </div>
          <button
            onClick={onCreatePlan}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} className="mr-2" />
            Create Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Plans List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">All Plans ({sortedPlans.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {sortedPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  selectedPlan?.id === plan.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <h3 className="font-medium text-gray-900">{plan.playerName}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadPDF(plan);
                    }}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    <Download size={12} />
                    PDF
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{getTotalExercises(plan)} exercises</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {format(new Date(plan.date), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
            ))}
            {sortedPlans.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No workout plans created yet.</p>
                <button
                  onClick={onCreatePlan}
                  className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Create your first plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          {selectedPlan ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPlan.playerName}</h2>
                  <p className="text-gray-500">
                    Created on {format(new Date(selectedPlan.date), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadPDF(selectedPlan)}
                  disabled={isGeneratingPDF}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                >
                  <Download size={16} />
                  {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                </button>
              </div>

              <div className="mb-6">
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {selectedPlan.categories.map((categoryData, categoryIndex) => (
                    <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 capitalize flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                          {categoryData.categoryName}
                        </h4>
                        <div className="text-xs text-gray-500">
                          {categoryData.exercises.length} exercises
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <strong>Days:</strong> {categoryData.days.join(', ')}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {categoryData.exercises.map((exerciseData, exerciseIndex) => (
                          <div key={exerciseIndex} className="bg-gray-50 rounded p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">
                                {exerciseIndex + 1}. {exerciseData.exercise.name}
                              </h5>
                              <div className="text-right text-sm text-gray-600">
                                <div><strong>Sets:</strong> {exerciseData.sets}</div>
                                {exerciseData.reps && <div><strong>Reps:</strong> {exerciseData.reps}</div>}
                                {exerciseData.weight && <div><strong>Weight:</strong> {exerciseData.weight}</div>}
                              </div>
                            </div>
                            {exerciseData.exercise.description && (
                              <p className="text-sm text-gray-600 mb-1">{exerciseData.exercise.description}</p>
                            )}
                            {exerciseData.notes && (
                              <p className="text-sm text-blue-600 italic">Note: {exerciseData.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlan.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedPlan.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select a workout plan to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};