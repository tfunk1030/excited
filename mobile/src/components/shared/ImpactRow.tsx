import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../styles/theme';

interface ImpactRowProps {
  label: string;
  value: number;
  color: string;
}

export const getImpactColor = (value: number): string => {
  if (value === 0) return theme.colors.text.secondary;
  return value > 0 ? theme.colors.success : theme.colors.error;
};

export const ImpactRow = memo<ImpactRowProps>(({
  label,
  value,
  color,
}) => {
  const formattedValue = `${value >= 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{formattedValue}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.label === nextProps.label &&
    prevProps.value === nextProps.value &&
    prevProps.color === nextProps.color
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  value: {
    ...theme.typography.body,
    fontWeight: '600' as const,
  },
});

ImpactRow.displayName = 'ImpactRow';
