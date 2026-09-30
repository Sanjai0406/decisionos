import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { InformationType, ConfidenceLevel, RiskCategory } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  type?: InformationType | ConfidenceLevel | RiskCategory;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const typeColors: Record<string, string> = {
  fact: 'info',
  assumption: 'warning',
  user_preference: 'primary',
  estimate: 'success',
  uncertainty: 'error',
  ai_analysis: 'primary',
  user_input: 'success',
  high: 'success',
  medium: 'warning',
  low: 'error',
  financial: 'warning',
  compatibility: 'info',
  reliability: 'warning',
  time: 'info',
  privacy: 'error',
  lock_in: 'warning',
  availability: 'info',
  opportunity_cost: 'primary',
};

export function Badge({ label, variant = 'default', type, size = 'md', style }: BadgeProps) {
  const { theme } = useTheme();
  
  const getVariant = (): string => {
    if (type && typeColors[type]) {
      return typeColors[type];
    }
    return variant;
  };
  
  const actualVariant = getVariant();
  
  const getBackgroundColor = (): string => {
    switch (actualVariant) {
      case 'primary':
        return theme.colors.primaryLight + '20';
      case 'success':
        return theme.colors.success + '20';
      case 'warning':
        return theme.colors.warning + '20';
      case 'error':
        return theme.colors.error + '20';
      case 'info':
        return theme.colors.info + '20';
      default:
        return theme.colors.surfaceAlt;
    }
  };
  
  const getTextColor = (): string => {
    switch (actualVariant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };
  
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 6 : 10,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: getTextColor(),
            fontSize: size === 'sm' ? 10 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});
