import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { WorkoutPlan, GymSettings, CategoryWithDays } from '../types';
import { format } from 'date-fns';

// Register Rabar font for PDF generation
Font.register({
  family: 'Rabar',
  src: '/assets/fonts/Rabar_021.ttf',
});

// Create styles with Rabar font
const createStyles = (language: string, themeColor: string) => {
  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 20,
      fontFamily: 'Rabar',
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: themeColor,
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerContent: {
      flex: 1,
      alignItems: 'flex-start',
    },
    logo: {
      width: 40,
      height: 40,
      marginRight: 10,
      marginLeft: 0,
    },
    gymName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 4,
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: themeColor,
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    section: {
      marginBottom: 15,
      padding: 12,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 6,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: themeColor,
      marginBottom: 10,
      textAlign: 'left',
      borderBottomWidth: 1,
      borderBottomColor: themeColor,
      paddingBottom: 4,
      fontFamily: 'Rabar',
    },
    playerInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 15,
    },
    playerInfoGroup: {
      flexDirection: 'column',
      minWidth: 100,
    },
    playerInfoLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#9CA3AF',
      marginBottom: 2,
      textAlign: 'left',
      textTransform: 'uppercase',
      fontFamily: 'Rabar',
    },
    playerInfoValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1F2937',
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    totalExercisesHighlight: {
      backgroundColor: themeColor,
      color: '#FFFFFF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Rabar',
    },
    exerciseContainer: {
      marginBottom: 12,
    },
    categoryContainer: {
      marginBottom: 15,
      padding: 10,
      backgroundColor: '#FAFAFA',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    categoryTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: themeColor,
      marginBottom: 6,
      textAlign: 'left',
      textTransform: 'uppercase',
      fontFamily: 'Rabar',
    },
    categoryDays: {
      fontSize: 11,
      color: '#374151',
      marginBottom: 8,
      textAlign: 'left',
      fontWeight: '500',
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start',
      fontFamily: 'Rabar',
    },
    exerciseItem: {
      flexDirection: 'row',
      marginBottom: 8,
      padding: 8,
      backgroundColor: '#FFFFFF',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      alignItems: 'flex-start',
    },
    exerciseNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      color: themeColor,
      minWidth: 20,
      textAlign: 'center',
      marginRight: 6,
      marginLeft: 0,
      fontFamily: 'Rabar',
    },
    exerciseContent: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 2,
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    exerciseCategory: {
      fontSize: 10,
      color: themeColor,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: 2,
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    exerciseDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginBottom: 2,
    },
    exerciseDetailText: {
      fontSize: 9,
      color: '#374151',
      fontWeight: 'bold',
      backgroundColor: '#E5E7EB',
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 2,
      fontFamily: 'Rabar',
    },
    exerciseDescription: {
      fontSize: 10,
      color: '#6B7280',
      lineHeight: 1.4,
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    exerciseNotes: {
      fontSize: 9,
      color: '#1E40AF',
      fontStyle: 'italic',
      lineHeight: 1.4,
      textAlign: 'left',
      fontFamily: 'Rabar',
    },
    notesSection: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#FFF7ED',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: themeColor,
      borderLeftWidth: 3,
      borderLeftColor: themeColor,
    },
    notesText: {
      fontSize: 12,
      color: '#1F2937',
      lineHeight: 1.5,
      textAlign: 'left',
      fontStyle: 'italic',
      fontFamily: 'Rabar',
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    footerText: {
      fontSize: 9,
      color: '#9CA3AF',
      textAlign: 'left',
      fontWeight: '500',
      fontFamily: 'Rabar',
    },
    footerDate: {
      fontSize: 9,
      color: '#9CA3AF',
      textAlign: 'right',
      fontWeight: '500',
      fontFamily: 'Rabar',
    },
  });
};

interface WorkoutPlanPDFProps {
  workoutPlan: WorkoutPlan;
  gymSettings: GymSettings;
}

export const WorkoutPlanPDF: React.FC<WorkoutPlanPDFProps> = ({ workoutPlan, gymSettings }) => {
  const language = gymSettings.language || 'en';
  const themeColor = gymSettings.themeColor || '#F97316';

  const styles = createStyles(language, themeColor);

  // Enhanced translation function for PDF
  const getPDFText = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        workoutPlan: 'Workout Plan',
        playerInformation: 'Player Information',
        name: 'Name',
        date: 'Date',
        planId: 'Plan ID',
        exercises: 'Exercises',
        notes: 'Notes',
        createdOn: 'Created on',
        totalExercises: 'Total Exercises',
        category: 'Category',
        days: 'Days',
        sets: 'Sets',
        reps: 'Reps',
        weight: 'Weight',
        note: 'Note',
      },
      ar: {
        workoutPlan: 'خطة التمرين',
        playerInformation: 'معلومات اللاعب',
        name: 'الاسم',
        date: 'التاريخ',
        planId: 'معرف الخطة',
        exercises: 'التمارين',
        notes: 'الملاحظات',
        createdOn: 'تم الإنشاء في',
        totalExercises: 'إجمالي التمارين',
        category: 'الفئة',
        days: 'الأيام',
        sets: 'المجموعات',
        reps: 'التكرارات',
        weight: 'الوزن',
        note: 'ملاحظة',
      },
      ku: {
        workoutPlan: 'پلانی ڕاهێنان',
        playerInformation: 'زانیاری یاریزان',
        name: 'ناو',
        date: 'بەروار',
        planId: 'ناسنامەی پلان',
        exercises: 'ڕاهێنانەکان',
        notes: 'تێبینییەکان',
        createdOn: 'دروست کراوە لە',
        totalExercises: 'کۆی گشتی ڕاهێنانەکان',
        category: 'پۆل',
        days: 'ڕۆژەکان',
        sets: 'سێتەکان',
        reps: 'دووبارەکردنەوەکان',
        weight: 'کێش',
        note: 'تێبینی',
      },
    };
    return translations[language]?.[key] || translations.en[key];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {gymSettings.logo && (
            <Image src={gymSettings.logo} style={styles.logo} />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.gymName}>{gymSettings.name}</Text>
            <Text style={styles.title}>{getPDFText('workoutPlan')}</Text>
          </View>
        </View>

        {/* Player Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getPDFText('playerInformation')}</Text>
          
          <View style={styles.playerInfoContainer}>
            <View style={styles.playerInfoGroup}>
              <Text style={styles.playerInfoLabel}>{getPDFText('name')}</Text>
              <Text style={styles.playerInfoValue}>{workoutPlan.playerName}</Text>
            </View>
            
            <View style={styles.playerInfoGroup}>
              <Text style={styles.playerInfoLabel}>{getPDFText('date')}</Text>
              <Text style={styles.playerInfoValue}>{format(new Date(workoutPlan.date), 'MMMM dd, yyyy')}</Text>
            </View>
            
            <View style={styles.playerInfoGroup}>
              <Text style={styles.playerInfoLabel}>{getPDFText('planId')}</Text>
              <Text style={styles.playerInfoValue}>{workoutPlan.id}</Text>
            </View>
            
            <View style={styles.playerInfoGroup}>
              <Text style={styles.playerInfoLabel}>{getPDFText('totalExercises')}</Text>
              <Text style={styles.totalExercisesHighlight}>
                {workoutPlan.categories.reduce((total, cat) => total + cat.exercises.length, 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Categories and Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getPDFText('exercises')} ({workoutPlan.categories.reduce((total, cat) => total + cat.exercises.length, 0)})
          </Text>
          
          {workoutPlan.categories.map((categoryData, categoryIndex) => (
            <View key={categoryIndex} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>
                {categoryData.categoryName.toUpperCase()}
              </Text>
              <Text style={styles.categoryDays}>
                {getPDFText('days')}: {categoryData.days.join(', ')}
              </Text>
              
              <View style={styles.exerciseContainer}>
                {categoryData.exercises.map((exerciseData, exerciseIndex) => (
                  <View key={exerciseIndex} style={styles.exerciseItem}>
                    <Text style={styles.exerciseNumber}>{exerciseIndex + 1}</Text>
                    <View style={styles.exerciseContent}>
                      <Text style={styles.exerciseName}>{exerciseData.exercise.name}</Text>
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.exerciseDetailText}>
                          {getPDFText('sets')}: {exerciseData.sets}
                        </Text>
                        {exerciseData.reps && (
                          <Text style={styles.exerciseDetailText}>
                            {getPDFText('reps')}: {exerciseData.reps}
                          </Text>
                        )}
                        {exerciseData.weight && (
                          <Text style={styles.exerciseDetailText}>
                            {getPDFText('weight')}: {exerciseData.weight}
                          </Text>
                        )}
                      </View>
                      {exerciseData.exercise.description && (
                        <Text style={styles.exerciseDescription}>{exerciseData.exercise.description}</Text>
                      )}
                      {exerciseData.notes && (
                        <Text style={styles.exerciseNotes}>
                          {getPDFText('note')}: {exerciseData.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Notes */}
        {workoutPlan.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>{getPDFText('notes')}</Text>
            <Text style={styles.notesText}>{workoutPlan.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {gymSettings.name} | {gymSettings.location} | {gymSettings.contactPhone}
          </Text>
          <Text style={styles.footerDate}>
            {getPDFText('createdOn')}: {format(new Date(workoutPlan.createdAt), 'MMM dd, yyyy HH:mm')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};