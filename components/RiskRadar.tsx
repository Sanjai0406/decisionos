import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AlertTriangle, Shield, TrendingUp, Clock, Lock, Package, GitBranch } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Badge } from './ui';
import { Risk, RiskCategory } from '../types';

interface RiskRadarProps {
  risks: Risk[];
  onRiskPress?: (risk: Risk) => void;
}

const categoryIcons: Record<RiskCategory, React.ReactNode> = {
  financial: <TrendingUp size={16} />,
  compatibility: <GitBranch size={16} />,
  reliability: <Shield size={16} />,
  time: <Clock size={16} />,
  privacy: <Lock size={16} />,
  lock_in: <Lock size={16} />,
  availability: <Package size={16} />,
  opportunity_cost: <AlertTriangle size={16} />,
};

const categoryLabels: Record<RiskCategory, string> = {
  financial: 'Financial',
  compatibility: 'Compatibility',
  reliability: 'Reliability',
  time: 'Time',
  privacy: 'Privacy',
  lock_in: 'Lock-in',
  availability: 'Availability',
  opportunity_cost: 'Opportunity Cost',
};

export function RiskRadar({ risks, onRiskPress }: RiskRadarProps) {
  const { theme } = useTheme();
  
  const risksByCategory = risks.reduce((acc, risk) => {
    if (!acc[risk.category]) {
      acc[risk.category] = [];
    }
    acc[risk.category].push(risk);
    return acc;
  }, {} as Record<RiskCategory, Risk[]>);
  
  const categoryScores = Object.entries(risksByCategory).map(([category, categoryRisks]) => {
    const avgImpact = categoryRisks.reduce((sum, r) => {
      const impactValue = r.impact === 'high' ? 3 : r.impact === 'medium' ? 2 : 1;
      return sum + impactValue;
    }, 0) / categoryRisks.length;
    
    return {
      category: category as RiskCategory,
      count: categoryRisks.length,
      avgImpact,
      risks: categoryRisks,
    };
  });
  
  return (
    <Card title="Risk Radar" subtitle="Potential risks identified">
      <View style={styles.container}>
        {categoryScores.length === 0 ? (
          <View style={styles.emptyState}>
            <Shield size={48} color={theme.colors.success} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No significant risks identified
            </Text>
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            {categoryScores.map(({ category, count, avgImpact, risks: categoryRisks }) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: getRiskColor(avgImpact, theme) + '20' }]}>
                    <Text style={{ color: getRiskColor(avgImpact, theme) }}>
                      {categoryIcons[category as RiskCategory]}
                    </Text>
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                      {categoryLabels[category as RiskCategory]}
                    </Text>
                    <Text style={[styles.categoryCount, { color: theme.colors.textSecondary }]}>
                      {count} risk{count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Badge
                    label={avgImpact >= 2.5 ? 'High' : avgImpact >= 1.5 ? 'Medium' : 'Low'}
                    type={avgImpact >= 2.5 ? 'high' : avgImpact >= 1.5 ? 'medium' : 'low'}
                    size="sm"
                  />
                </View>
                
                {categoryRisks.slice(0, 2).map((risk) => (
                  <TouchableOpacity
                    key={risk.id}
                    style={styles.riskItem}
                    onPress={() => onRiskPress?.(risk)}
                  >
                    <Text style={[styles.riskTitle, { color: theme.colors.text }]} numberOfLines={1}>
                      {risk.title}
                    </Text>
                    <Badge label={risk.uncertainty} type={risk.uncertainty} size="sm" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}

function getRiskColor(avgImpact: number, theme: any): string {
  if (avgImpact >= 2.5) return theme.colors.error;
  if (avgImpact >= 1.5) return theme.colors.warning;
  return theme.colors.success;
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryItem: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 12,
  },
  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 48,
  },
  riskTitle: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
});
