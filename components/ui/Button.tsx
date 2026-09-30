import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const { theme } = useTheme();
  
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    if (fullWidth) {
      base.width = '100%';
    }
    
    // Size
    if (size === 'sm') {
      base.paddingVertical = 8;
      base.paddingHorizontal = 16;
    } else if (size === 'lg') {
      base.paddingVertical = 16;
      base.paddingHorizontal = 32;
    } else {
      base.paddingVertical = 12;
      base.paddingHorizontal = 24;
    }
    
    // Variant
    if (variant === 'primary') {
      base.backgroundColor = disabled ? theme.colors.border : theme.colors.primary;
    } else if (variant === 'secondary') {
      base.backgroundColor = disabled ? theme.colors.surfaceAlt : theme.colors.secondary;
    } else if (variant === 'outline') {
      base.backgroundColor = 'transparent';
      base.borderWidth = 1;
      base.borderColor = disabled ? theme.colors.border : theme.colors.primary;
    } else if (variant === 'danger') {
      base.backgroundColor = disabled ? theme.colors.border : theme.colors.error;
    }
    
    return base;
  };
  
  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: '600',
    };
    
    if (size === 'sm') {
      base.fontSize = 14;
    } else if (size === 'lg') {
      base.fontSize = 18;
    } else {
      base.fontSize = 16;
    }
    
    if (variant === 'primary' || variant === 'secondary' || variant === 'danger') {
      base.color = theme.colors.textInverse;
    } else {
      base.color = disabled ? theme.colors.textTertiary : theme.colors.primary;
    }
    
    return base;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.textInverse}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text style={[getTextStyle(), icon ? { marginHorizontal: 8 } : {}, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}
