import { pdf, Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { WorkoutPlan, GymSettings } from '../types';
import { WorkoutPlanPDF } from '../components/WorkoutPlanPDF';

// Simple test PDF to verify basic functionality
const TestPDF: React.FC = () => {
  const styles = {
    page: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center' as const,
    },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Test PDF Generation</Text>
        <Text>This is a test PDF to verify that PDF generation is working.</Text>
      </Page>
    </Document>
  );
};

// Test function to verify PDF generation works
export const testPDFGeneration = async () => {
  try {
    console.log('Testing basic PDF generation...');
    const testBlob = await pdf(<TestPDF />).toBlob();
    console.log('Test PDF generated successfully:', {
      size: testBlob.size,
      type: testBlob.type
    });
    return true;
  } catch (error) {
    console.error('Test PDF generation failed:', error);
    return false;
  }
};

// Fallback PDF component for when main PDF generation fails
const FallbackPDF: React.FC<{ workoutPlan: WorkoutPlan; gymSettings: GymSettings }> = ({ workoutPlan, gymSettings }) => {
  const styles = {
    page: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center' as const,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
    exercise: {
      fontSize: 11,
      marginBottom: 3,
      marginLeft: 10,
    },
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{gymSettings.name} - Workout Plan</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Player Information</Text>
          <Text style={styles.text}>Name: {workoutPlan.playerName}</Text>
          <Text style={styles.text}>Date: {new Date(workoutPlan.date).toLocaleDateString()}</Text>
          <Text style={styles.text}>Plan ID: {workoutPlan.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workoutPlan.categories.map((category, catIndex) => (
            <View key={catIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{category.categoryName}</Text>
              <Text style={styles.text}>Days: {category.days.join(', ')}</Text>
              {category.exercises.map((exercise, exIndex) => (
                <Text key={exIndex} style={styles.exercise}>
                  {exIndex + 1}. {exercise.exercise.name} - Sets: {exercise.sets}
                  {exercise.reps && `, Reps: ${exercise.reps}`}
                  {exercise.weight && `, Weight: ${exercise.weight}`}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {workoutPlan.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.text}>{workoutPlan.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

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
    // First, test if basic PDF generation works
    const testResult = await testPDFGeneration();
    if (!testResult) {
      throw new Error('Basic PDF generation test failed');
    }
    
    console.log('Creating PDF document...');
    
    // Validate workout plan data
    if (!workoutPlan || !workoutPlan.playerName) {
      throw new Error('Invalid workout plan data: missing player name');
    }
    
    if (!workoutPlan.categories || workoutPlan.categories.length === 0) {
      throw new Error('Invalid workout plan data: no categories found');
    }
    
    // Try to create the main PDF first
    let pdfDoc;
    try {
      pdfDoc = pdf(<WorkoutPlanPDF workoutPlan={workoutPlan} gymSettings={gymSettings} />);
    } catch (mainError) {
      console.warn('Main PDF generation failed, trying fallback:', mainError);
      // If main PDF fails, use fallback
      pdfDoc = pdf(<FallbackPDF workoutPlan={workoutPlan} gymSettings={gymSettings} />);
    }
    
    console.log('Converting PDF to blob...');
    const blob = await pdfDoc.toBlob();
    
    console.log('PDF blob created successfully:', {
      size: blob.size,
      type: blob.type
    });
    
    if (blob.size === 0) {
      throw new Error('Generated PDF is empty (0 bytes)');
    }
    
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
        categoriesCount: workoutPlan.categories?.length || 0,
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
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isOnline: navigator.onLine
    });
    
    // Provide user-friendly error message
    let errorMessage = 'Failed to generate PDF. ';
    if (error instanceof Error) {
      if (error.message.includes('font')) {
        errorMessage += 'Font loading issue detected. Please try again.';
      } else if (error.message.includes('network')) {
        errorMessage += 'Network issue detected. Please check your connection.';
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += 'An unexpected error occurred.';
    }
    
    throw new Error(errorMessage);
  }
};