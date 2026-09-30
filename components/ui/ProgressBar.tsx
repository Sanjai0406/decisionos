import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  color,
  height = 8,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const { theme } = useTheme();
  
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {label || 'Progress'}
          </Text>
          <Text style={[styles.value, { color: theme.colors.textSecondary }]}>
            {clampedProgress}%
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height,
              backgroundColor: color || theme.colors.primary,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    fontSize: 12,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
