import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
}

export function Card({
  children,
  title,
  subtitle,
  action,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
}: CardProps) {
  const { theme } = useTheme();
  
  const getCardStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    };
    
    if (variant === 'elevated') {
      return { ...base, ...theme.shadows.md };
    }
    if (variant === 'outlined') {
      return { ...base, borderWidth: 1, borderColor: theme.colors.border };
    }
    return { ...base, ...theme.shadows.sm };
  };
  
  const getPaddingStyle = (): ViewStyle => {
    if (padding === 'none') return {};
    if (padding === 'sm') return { padding: theme.spacing.sm };
    if (padding === 'lg') return { padding: theme.spacing.lg };
    return { padding: theme.spacing.md };
  };
  
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : undefined}
    >
      {(title || action) && (
        <View style={[styles.header, { padding: theme.spacing.md }]}>
          <View>
            {title && (
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
          {action && (
            <TouchableOpacity onPress={action.onPress}>
              <Text style={[styles.action, { color: theme.colors.primary }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={getPaddingStyle()}>{children}</View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  action: {
    fontSize: 14,
    fontWeight: '500',
  },
});
