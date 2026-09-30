import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Badge } from './ui';
import { ConfidenceLevel } from '../types';

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  reasons: string[];
  showReasons?: boolean;
}

export function ConfidenceIndicator({ level, reasons, showReasons = true }: ConfidenceIndicatorProps) {
  const { theme } = useTheme();
  
  const getConfidenceColor = (): string => {
    switch (level) {
      case 'high':
        return theme.colors.success;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };
  
  const getConfidencePercentage = (): number => {
    switch (level) {
      case 'high':
        return 80;
      case 'medium':
        return 50;
      case 'low':
        return 25;
      default:
        return 50;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          AI Confidence
        </Text>
        <Badge label={level.charAt(0).toUpperCase() + level.slice(1)} type={level} />
      </View>
      
      <View style={styles.barContainer}>
        <View style={[styles.barBackground, { backgroundColor: theme.colors.surfaceAlt }]}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: getConfidenceColor(),
                width: `${getConfidencePercentage()}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.percentage, { color: getConfidenceColor() }]}>
          {getConfidencePercentage()}%
        </Text>
      </View>
      
      {showReasons && reasons.length > 0 && (
        <View style={styles.reasonsContainer}>
          <Text style={[styles.reasonsTitle, { color: theme.colors.textSecondary }]}>
            Why this confidence level?
          </Text>
          {reasons.map((reason, index) => (
            <Text key={index} style={[styles.reason, { color: theme.colors.textSecondary }]}>
              • {reason}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  reasonsContainer: {
    marginTop: 8,
    gap: 4,
  },
  reasonsTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    lineHeight: 18,
  },
});
