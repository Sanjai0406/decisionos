import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FileText, Target, AlertTriangle, HelpCircle, TrendingUp, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Badge, Button } from './ui';
import { Decision } from '../types';

interface DecisionSnapshotProps {
  decision: Decision;
  onShare?: () => void;
  onExport?: () => void;
}

export function DecisionSnapshot({ decision, onShare, onExport }: DecisionSnapshotProps) {
  const { theme } = useTheme();
  
  return (
    <Card title="Decision Snapshot" variant="elevated">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Decision
            </Text>
          </View>
          <Text style={[styles.decisionTitle, { color: theme.colors.text }]}>
            {decision.title}
          </Text>
          <Text style={[styles.decisionGoal, { color: theme.colors.textSecondary }]}>
            Goal: {decision.dna.goal}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={20} color={theme.colors.success} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Top Priorities
            </Text>
          </View>
          <View style={styles.prioritiesList}>
            {decision.dna.priorities.slice(0, 5).map((priority) => (
              <View key={priority.id} style={styles.priorityRow}>
                <Text style={[styles.priorityName, { color: theme.colors.text }]}>
                  {priority.name}
                </Text>
                <Badge label={`${priority.weight}%`} variant="primary" size="sm" />
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color={theme.colors.info} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Options Considered
            </Text>
          </View>
          <View style={styles.optionsList}>
            {decision.options.map((option, index) => (
              <View key={option.id} style={styles.optionItem}>
                <View style={[styles.optionNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.optionNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.optionName, { color: theme.colors.text }]}>
                  {option.name}
                </Text>
                {option.price && (
                  <Text style={[styles.optionPrice, { color: theme.colors.primary }]}>
                    {option.currency} {option.price.toLocaleString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
        
        {decision.tradeOffs.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={theme.colors.warning} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Key Trade-Offs
                </Text>
              </View>
              {decision.tradeOffs.map((tradeOff) => {
                const option = decision.options.find((o) => o.id === tradeOff.optionId);
                return (
                  <View key={tradeOff.optionId} style={styles.tradeOffItem}>
                    <Text style={[styles.tradeOffOption, { color: theme.colors.text }]}>
                      {option?.name}:
                    </Text>
                    {tradeOff.gains.length > 0 && (
                      <Text style={[styles.tradeOffGains, { color: theme.colors.success }]}>
                        + {tradeOff.gains.join(', ')}
                      </Text>
                    )}
                    {tradeOff.losses.length > 0 && (
                      <Text style={[styles.tradeOffLosses, { color: theme.colors.error }]}>
                        - {tradeOff.losses.join(', ')}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
        
        {decision.risks.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={20} color={theme.colors.error} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Major Risks
                </Text>
              </View>
              {decision.risks.slice(0, 5).map((risk) => (
                <View key={risk.id} style={styles.riskItem}>
                  <Badge label={risk.category} type={risk.category} size="sm" />
                  <Text style={[styles.riskTitle, { color: theme.colors.text }]}>
                    {risk.title}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
        
        {decision.dna.unknownInformation.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <HelpCircle size={20} color={theme.colors.warning} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Unknowns
                </Text>
              </View>
              {decision.dna.unknownInformation.map((unknown, index) => (
                <Text key={index} style={[styles.unknownItem, { color: theme.colors.textSecondary }]}>
                  • {unknown}
                </Text>
              ))}
            </View>
          </>
        )}
        
        {decision.confidenceReasons.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Confidence: <Badge label={decision.confidence} type={decision.confidence} />
              </Text>
              <Text style={[styles.confidenceNote, { color: theme.colors.textSecondary }]}>
                {decision.confidenceReasons.join('. ')}
              </Text>
            </View>
          </>
        )}
        
        <View style={styles.actions}>
          {onShare && (
            <Button title="Share" onPress={onShare} variant="outline" style={styles.actionButton} />
          )}
          {onExport && (
            <Button title="Export" onPress={onExport} variant="secondary" style={styles.actionButton} />
          )}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  decisionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  decisionGoal: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  prioritiesList: {
    gap: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityName: {
    fontSize: 14,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  optionName: {
    fontSize: 14,
    flex: 1,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  tradeOffItem: {
    marginBottom: 12,
  },
  tradeOffOption: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tradeOffGains: {
    fontSize: 13,
    marginLeft: 8,
  },
  tradeOffLosses: {
    fontSize: 13,
    marginLeft: 8,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 13,
    flex: 1,
  },
  unknownItem: {
    fontSize: 13,
    lineHeight: 20,
  },
  confidenceNote: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});
