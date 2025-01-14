import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ResultDisplayProps } from '@/types';
import theme from '@/constants/theme';

const ADJUSTMENT_ICONS = {
  temperature: 'thermometer-outline',
  altitude: 'trending-up-outline',
  humidity: 'water-outline',
  airDensity: 'speedometer-outline',
} as const;

export default function ResultDisplay({ calculation }: ResultDisplayProps) {
  const totalAdjustment = calculation.adjustments.reduce((sum, adj) => sum + adj.effect, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Playing Distance</Text>
        <Text style={styles.distance}>{Math.round(calculation.adjustedDistance)} yds</Text>
      </View>

      <View style={styles.adjustments}>
        {calculation.adjustments.map((adjustment) => (
          <View key={adjustment.type} style={styles.adjustmentRow}>
            <View style={styles.adjustmentInfo}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={ADJUSTMENT_ICONS[adjustment.type]}
                  size={24}
                  color={theme.colors.text}
                />
              </View>
              <View>
                <Text style={styles.adjustmentType}>
                  {adjustment.type.charAt(0).toUpperCase() + adjustment.type.slice(1)}
                </Text>
                <Text style={styles.adjustmentValue}>
                  {adjustment.type === 'airDensity'
                    ? `${adjustment.value.toFixed(3)} kg/m³`
                    : adjustment.type === 'temperature'
                    ? `${Math.round(adjustment.value)}°F`
                    : `${Math.round(adjustment.value)}`}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.adjustmentEffect,
                { color: adjustment.effect >= 0 ? theme.colors.success : theme.colors.error },
              ]}
            >
              {adjustment.effect >= 0 ? '+' : ''}{Math.round(adjustment.effect)} yds
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Adjustment</Text>
          <Text
            style={[
              styles.totalValue,
              { color: totalAdjustment >= 0 ? theme.colors.success : theme.colors.error },
            ]}
          >
            {totalAdjustment >= 0 ? '+' : ''}{Math.round(totalAdjustment)} yds
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  distance: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text,
  },
  adjustments: {
    gap: theme.spacing.md,
  },
  adjustmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  adjustmentType: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  adjustmentValue: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  adjustmentEffect: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
});