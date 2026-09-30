import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Dna, Target, Clock, AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Badge, ProgressBar } from './ui';
import { DecisionDNA } from '../types';

interface DecisionDNACardProps {
  dna: DecisionDNA;
  compact?: boolean;
  onEdit?: () => void;
}

export function DecisionDNACard({ dna, compact = false, onEdit }: DecisionDNACardProps) {
  const { theme } = useTheme();
  
  const completeness = calculateCompleteness(dna);
  
  return (
    <Card
      title="Decision DNA"
      subtitle="Your decision profile"
      action={onEdit ? { label: 'Edit', onPress: onEdit } : undefined}
      variant="elevated"
    >
      <View style={styles.container}>
        <View style={styles.completenessContainer}>
          <Text style={[styles.completenessLabel, { color: theme.colors.textSecondary }]}>
            Profile Completeness
          </Text>
          <ProgressBar progress={completeness} showLabel />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={16} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Goal</Text>
          </View>
          <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
            {dna.goal || 'Not defined'}
          </Text>
        </View>
        
        {dna.budget && (dna.budget.min || dna.budget.max) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Budget</Text>
            </View>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              {dna.budget.min && dna.budget.max
                ? `${dna.budget.currency} ${dna.budget.min} - ${dna.budget.max}`
                : dna.budget.max
                ? `Up to ${dna.budget.currency} ${dna.budget.max}`
                : `From ${dna.budget.currency} ${dna.budget.min}`}
            </Text>
          </View>
        )}
        
        {dna.timeConstraint && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={16} color={theme.colors.warning} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Time Constraint</Text>
            </View>
            <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
              {dna.timeConstraint}
            </Text>
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={16} color={getRiskColor(dna.riskTolerance, theme)} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Risk Tolerance</Text>
          </View>
          <Badge
            label={dna.riskTolerance.charAt(0).toUpperCase() + dna.riskTolerance.slice(1)}
            type={dna.riskTolerance}
          />
        </View>
        
        {dna.priorities.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Priorities</Text>
            <View style={styles.prioritiesContainer}>
              {dna.priorities.map((priority) => (
                <View key={priority.id} style={styles.priorityItem}>
                  <Text style={[styles.priorityName, { color: theme.colors.text }]}>
                    {priority.name}
                  </Text>
                  <Text style={[styles.priorityWeight, { color: theme.colors.primary }]}>
                    {priority.weight}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {!compact && (
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.sectionHeader}>
                <CheckCircle size={16} color={theme.colors.success} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Must Haves</Text>
              </View>
              {dna.mustHaves.length > 0 ? (
                dna.mustHaves.map((item, index) => (
                  <Text key={index} style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                    • {item}
                  </Text>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
                  None specified
                </Text>
              )}
            </View>
            
            <View style={styles.column}>
              <View style={styles.sectionHeader}>
                <XCircle size={16} color={theme.colors.error} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Deal Breakers</Text>
              </View>
              {dna.dealBreakers.length > 0 ? (
                dna.dealBreakers.map((item, index) => (
                  <Text key={index} style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                    • {item}
                  </Text>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
                  None specified
                </Text>
              )}
            </View>
          </View>
        )}
        
        {dna.unknownInformation.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={16} color={theme.colors.warning} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Unknowns</Text>
            </View>
            {dna.unknownInformation.map((item, index) => (
              <Text key={index} style={[styles.listItem, { color: theme.colors.textSecondary }]}>
                • {item}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}

function calculateCompleteness(dna: DecisionDNA): number {
  let score = 0;
  const weights: Record<string, number> = {
    goal: 20,
    budget: 15,
    priorities: 25,
    mustHaves: 10,
    dealBreakers: 10,
    knownInformation: 10,
    riskTolerance: 10,
  };
  
  if (dna.goal) score += weights.goal;
  if (dna.budget?.min || dna.budget?.max) score += weights.budget;
  if (dna.priorities.length > 0) score += weights.priorities;
  if (dna.mustHaves.length > 0) score += weights.mustHaves;
  if (dna.dealBreakers.length > 0) score += weights.dealBreakers;
  if (dna.knownInformation.length > 0) score += weights.knownInformation;
  score += weights.riskTolerance;
  
  return Math.min(score, 100);
}

function getRiskColor(tolerance: string, theme: any): string {
  switch (tolerance) {
    case 'high':
      return theme.colors.success;
    case 'medium':
      return theme.colors.warning;
    case 'low':
      return theme.colors.error;
    default:
      return theme.colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  completenessContainer: {
    marginBottom: 8,
  },
  completenessLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  prioritiesContainer: {
    gap: 8,
  },
  priorityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityName: {
    fontSize: 14,
  },
  priorityWeight: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  listItem: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
