import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helperText,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  leftIcon,
  rightIcon,
  style,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
}: InputProps) {
  const { theme } = useTheme();
  const [isSecureVisible, setIsSecureVisible] = useState(false);
  
  const borderColor = error
    ? theme.colors.error
    : value
    ? theme.colors.primary
    : theme.colors.border;
  
  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          {
            borderColor,
            backgroundColor: editable ? theme.colors.card : theme.colors.surfaceAlt,
          },
          multiline && { alignItems: 'flex-start', paddingVertical: 12 },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          style={[
            styles.input,
            {
              color: editable ? theme.colors.text : theme.colors.textSecondary,
            },
            multiline && { minHeight: numberOfLines * 24 },
          ]}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            style={styles.iconRight}
          >
            {isSecureVisible ? (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            { color: error ? theme.colors.error : theme.colors.textSecondary },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
