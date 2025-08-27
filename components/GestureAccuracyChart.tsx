import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GestureAccuracyChartProps {
  accuracy: number;
}

export function GestureAccuracyChart({ accuracy }: GestureAccuracyChartProps) {
  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return '#10B981';
    if (acc >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const getAccuracyLabel = (acc: number) => {
    if (acc >= 90) return 'Excellent';
    if (acc >= 75) return 'Good';
    if (acc >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${accuracy}%`,
                backgroundColor: getAccuracyColor(accuracy)
              }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>{accuracy}%</Text>
      </View>
      
      <View style={styles.details}>
        <Text style={[styles.accuracyLabel, { color: getAccuracyColor(accuracy) }]}>
          {getAccuracyLabel(accuracy)}
        </Text>
        <Text style={styles.description}>
          Based on your recent gesture recognition performance
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  details: {
    alignItems: 'center',
  },
  accuracyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});