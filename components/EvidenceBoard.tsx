import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Link, User, Brain, HelpCircle, Calculator } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Badge } from './ui';
import { Evidence, InformationType } from '../types';

interface EvidenceBoardProps {
  evidence: Evidence[];
  onEvidencePress?: (evidence: Evidence) => void;
}

const typeIcons: Record<InformationType, React.ReactNode> = {
  fact: <FileText size={16} />,
  assumption: <HelpCircle size={16} />,
  user_preference: <User size={16} />,
  estimate: <Calculator size={16} />,
  uncertainty: <HelpCircle size={16} />,
  ai_analysis: <Brain size={16} />,
  user_input: <User size={16} />,
};

const typeLabels: Record<InformationType, string> = {
  fact: 'Fact',
  assumption: 'Assumption',
  user_preference: 'User Preference',
  estimate: 'Estimate',
  uncertainty: 'Uncertainty',
  ai_analysis: 'AI Analysis',
  user_input: 'User Input',
};

export function EvidenceBoard({ evidence, onEvidencePress }: EvidenceBoardProps) {
  const { theme } = useTheme();
  
  const sortedEvidence = [...evidence].sort((a, b) => {
    const order: InformationType[] = ['fact', 'user_input', 'estimate', 'assumption', 'ai_analysis', 'uncertainty'];
    return order.indexOf(a.type) - order.indexOf(b.type);
  });
  
  return (
    <Card title="Evidence Board" subtitle="Sources and information types">
      <View style={styles.container}>
        {sortedEvidence.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={48} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No evidence collected yet
            </Text>
          </View>
        ) : (
          sortedEvidence.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.evidenceItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => onEvidencePress?.(item)}
            >
              <View style={styles.evidenceHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type, theme) + '20' }]}>
                  <Text style={{ color: getTypeColor(item.type, theme) }}>
                    {typeIcons[item.type]}
                  </Text>
                </View>
                <Badge label={typeLabels[item.type]} type={item.type} size="sm" />
              </View>
              
              <Text style={[styles.evidenceContent, { color: theme.colors.text }]} numberOfLines={3}>
                {item.content}
              </Text>
              
              {item.source && (
                <View style={styles.sourceRow}>
                  <Link size={12} color={theme.colors.textTertiary} />
                  <Text style={[styles.sourceText, { color: theme.colors.textTertiary }]} numberOfLines={1}>
                    {item.source}
                  </Text>
                </View>
              )}
              
              {item.confidence && (
                <View style={styles.confidenceRow}>
                  <Text style={[styles.confidenceLabel, { color: theme.colors.textSecondary }]}>
                    Confidence:
                  </Text>
                  <Badge label={item.confidence} type={item.confidence} size="sm" />
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </Card>
  );
}

function getTypeColor(type: InformationType, theme: any): string {
  switch (type) {
    case 'fact':
      return theme.colors.fact;
    case 'assumption':
      return theme.colors.assumption;
    case 'user_preference':
      return theme.colors.preference;
    case 'estimate':
      return theme.colors.estimate;
    case 'uncertainty':
      return theme.colors.uncertainty;
    case 'ai_analysis':
      return theme.colors.aiAnalysis;
    case 'user_input':
      return theme.colors.userInput;
    default:
      return theme.colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  evidenceItem: {
    borderRadius: 12,
    padding: 16,
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  sourceText: {
    fontSize: 12,
    flex: 1,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  confidenceLabel: {
    fontSize: 12,
  },
});
