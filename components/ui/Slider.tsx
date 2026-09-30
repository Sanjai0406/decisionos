import React from 'react';
import { View, Text, StyleSheet, Slider } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
  disabled?: boolean;
}

export function CustomSlider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  showValue = true,
  unit = '%',
  disabled = false,
}: CustomSliderProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {label}
          </Text>
          {showValue && (
            <Text style={[styles.value, { color: theme.colors.primary }]}>
              {value}{unit}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: theme.colors.surfaceAlt }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
              width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
            },
          ]}
        />
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
              left: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`,
            },
          ]}
        />
      </View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        disabled={disabled}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="transparent"
        style={styles.slider}
      />
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
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  track: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -6,
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  slider: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
  },
});
