import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { WorkoutPlan, GymSettings } from '../types';
import { WorkoutPlanPDF } from '../components/WorkoutPlanPDF';

export const generateWorkoutPlanPDF = async (
  workoutPlan: WorkoutPlan,
  gymSettings: GymSettings
) => {
  console.log('Starting PDF generation for:', workoutPlan.playerName);
  console.log('Gym settings:', {
    name: gymSettings.name,
    language: gymSettings.language,
    themeColor: gymSettings.themeColor,
    hasLogo: !!gymSettings.logo,
    hasCustomFont: !!gymSettings.customFont,
    customFontSize: gymSettings.customFont ? gymSettings.customFont.length : 0
  });
  
  try {
    console.log('Creating PDF document...');
    const blob = await pdf(<WorkoutPlanPDF workoutPlan={workoutPlan} gymSettings={gymSettings} />).toBlob();
    console.log('PDF blob created successfully:', {
      size: blob.size,
      type: blob.type
    });
    
    console.log('Creating object URL...');
    const url = URL.createObjectURL(blob);
    console.log('Object URL created:', url);
    
    console.log('Creating download link...');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workoutPlan.playerName}-workout-plan-${new Date(workoutPlan.date).toISOString().split('T')[0]}.pdf`;
    console.log('Download filename:', link.download);
    
    console.log('Triggering download...');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Cleaning up object URL...');
    URL.revokeObjectURL(url);
    console.log('PDF generation completed successfully');
  } catch (error) {
    console.error('PDF Generation Error Details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error,
      workoutPlan: {
        id: workoutPlan.id,
        playerName: workoutPlan.playerName,
        exerciseCount: workoutPlan.exercises.length,
        date: workoutPlan.date
      },
      gymSettings: {
        name: gymSettings.name,
        language: gymSettings.language,
        themeColor: gymSettings.themeColor,
        hasLogo: !!gymSettings.logo,
        hasCustomFont: !!gymSettings.customFont,
        logoSize: gymSettings.logo ? gymSettings.logo.length : 0,
        customFontSize: gymSettings.customFont ? gymSettings.customFont.length : 0
      },
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    });
    throw error;
  }
};