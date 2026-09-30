import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, ExternalLink, Trash2, Edit3 } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Badge, ProgressBar } from './ui';
import { Option, Priority } from '../types';

interface OptionCardProps {
  option: Option;
  priorities: Priority[];
  isSelected?: boolean;
  showScores?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function OptionCard({
  option,
  priorities,
  isSelected = false,
  showScores = true,
  onSelect,
  onEdit,
  onDelete,
}: OptionCardProps) {
  const { theme } = useTheme();
  
  const totalScore = calculateTotalScore(option, priorities);
  
  return (
    <Card
      variant={isSelected ? 'elevated' : 'outlined'}
      style={[
        styles.container,
        isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
      ]}
    >
      <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
        <View style={styles.header}>
          {option.imageUrl ? (
            <Image
              source={{ uri: option.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceAlt }]}>
              <Star size={24} color={theme.colors.textTertiary} />
            </View>
          )}
          
          <View style={styles.headerContent}>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
              {option.name}
            </Text>
            {option.price !== undefined && (
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                {option.currency || '$'} {option.price.toLocaleString()}
              </Text>
            )}
            {option.source && (
              <View style={styles.sourceRow}>
                <Badge
                  label={option.sourceType || 'manual'}
                  size="sm"
                />
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Edit3 size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Trash2 size={18} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {showScores && Object.keys(option.scores).length > 0 && (
          <View style={styles.scoresContainer}>
            <View style={styles.totalScoreRow}>
              <Text style={[styles.totalScoreLabel, { color: theme.colors.text }]}>
                Overall Match
              </Text>
              <Text style={[styles.totalScoreValue, { color: theme.colors.primary }]}>
                {totalScore.toFixed(1)}/10
              </Text>
            </View>
            
            <ProgressBar
              progress={totalScore * 10}
              color={theme.colors.primary}
              height={6}
            />
            
            <View style={styles.scoreDetails}>
              {priorities.slice(0, 3).map((priority) => (
                <View key={priority.id} style={styles.scoreRow}>
                  <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
                    {priority.name}
                  </Text>
                  <View style={styles.scoreValue}>
                    <Text style={[styles.scoreNumber, { color: theme.colors.text }]}>
                      {option.scores[priority.id] || 0}/10
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {option.description && (
          <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {option.description}
          </Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}

function calculateTotalScore(option: Option, priorities: Priority[]): number {
  if (priorities.length === 0) return 0;
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  priorities.forEach((priority) => {
    const score = option.scores[priority.id] || 0;
    weightedSum += score * priority.weight;
    totalWeight += priority.weight;
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  sourceRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  scoresContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  totalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalScoreValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  scoreDetails: {
    marginTop: 12,
    gap: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 13,
  },
  scoreValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  },
});
