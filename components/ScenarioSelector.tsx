import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TrendingUp, TrendingDown, Minus, DollarSign, Zap, Clock, Timer } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './ui';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario?: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
}

const scenarioIcons: Record<string, React.ReactNode> = {
  best_case: <TrendingUp size={16} />,
  expected: <Minus size={16} />,
  worst_case: <TrendingDown size={16} />,
  budget: <DollarSign size={16} />,
  performance: <Zap size={16} />,
  long_term: <Clock size={16} />,
  short_term: <Timer size={16} />,
};

const scenarioLabels: Record<string, string> = {
  best_case: 'Best Case',
  expected: 'Expected',
  worst_case: 'Worst Case',
  budget: 'Budget-Constrained',
  performance: 'Performance-First',
  long_term: 'Long-Term',
  short_term: 'Short-Term',
};

export function ScenarioSelector({ scenarios, selectedScenario, onSelectScenario }: ScenarioSelectorProps) {
  const { theme } = useTheme();
  
  const defaultScenarios: Scenario[] = [
    { id: 'best', name: 'Best Case', type: 'best_case', adjustments: {}, description: 'Optimistic assumptions' },
    { id: 'expected', name: 'Expected', type: 'expected', adjustments: {}, description: 'Most likely outcome' },
    { id: 'worst', name: 'Worst Case', type: 'worst_case', adjustments: {}, description: 'Pessimistic assumptions' },
    { id: 'budget', name: 'Budget', type: 'budget', adjustments: {}, description: 'Budget-focused' },
    { id: 'performance', name: 'Performance', type: 'performance', adjustments: {}, description: 'Performance-focused' },
    { id: 'long_term', name: 'Long-Term', type: 'long_term', adjustments: {}, description: 'Long-term value' },
  ];
  
  const allScenarios = scenarios.length > 0 ? scenarios : defaultScenarios;
  
  return (
    <Card title="Scenario Simulator" subtitle="Explore different scenarios">
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.scenariosRow}>
            {allScenarios.map((scenario) => {
              const isSelected = selectedScenario?.id === scenario.id;
              return (
                <TouchableOpacity
                  key={scenario.id}
                  style={[
                    styles.scenarioButton,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => onSelectScenario(scenario)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceAlt }]}>
                    <Text style={{ color: isSelected ? theme.colors.textInverse : theme.colors.textSecondary }}>
                      {scenarioIcons[scenario.type] || <Minus size={16} />}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.scenarioLabel,
                      { color: isSelected ? theme.colors.textInverse : theme.colors.text },
                    ]}
                  >
                    {scenario.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        
        {selectedScenario && (
          <View style={[styles.descriptionBox, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.descriptionTitle, { color: theme.colors.text }]}>
              {selectedScenario.name} Scenario
            </Text>
            <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
              {selectedScenario.description}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  scenariosRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  scenarioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  descriptionBox: {
    padding: 16,
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
