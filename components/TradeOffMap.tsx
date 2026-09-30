import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Badge } from './ui';
import { TradeOff, Option } from '../types';

interface TradeOffMapProps {
  tradeOffs: TradeOff[];
  options: Option[];
}

export function TradeOffMap({ tradeOffs, options }: TradeOffMapProps) {
  const { theme } = useTheme();
  
  const getOptionName = (optionId: string): string => {
    const option = options.find((o) => o.id === optionId);
    return option?.name || 'Unknown Option';
  };
  
  return (
    <Card title="Trade-Off Map" subtitle="What you gain and sacrifice">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {tradeOffs.map((tradeOff) => (
            <View
              key={tradeOff.optionId}
              style={[styles.tradeOffCard, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.optionName, { color: theme.colors.text }]}>
                {getOptionName(tradeOff.optionId)}
              </Text>
              
              {tradeOff.gains.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <ArrowUpRight size={16} color={theme.colors.success} />
                    <Text style={[styles.sectionTitle, { color: theme.colors.success }]}>
                      Gains
                    </Text>
                  </View>
                  {tradeOff.gains.map((gain, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
                      <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>
                        {gain}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {tradeOff.losses.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <ArrowDownRight size={16} color={theme.colors.error} />
                    <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>
                      Sacrifices
                    </Text>
                  </View>
                  {tradeOff.losses.map((loss, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={[styles.dot, { backgroundColor: theme.colors.error }]} />
                      <Text style={[styles.itemText, { color: theme.colors.textSecondary }]}>
                        {loss}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {tradeOff.gains.length === 0 && tradeOff.losses.length === 0 && (
                <View style={styles.neutralState}>
                  <Minus size={20} color={theme.colors.textTertiary} />
                  <Text style={[styles.neutralText, { color: theme.colors.textTertiary }]}>
                    Balanced option
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
  },
  tradeOffCard: {
    minWidth: 200,
    maxWidth: 280,
    borderRadius: 12,
    padding: 16,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  itemText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  neutralState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  neutralText: {
    fontSize: 13,
  },
});
