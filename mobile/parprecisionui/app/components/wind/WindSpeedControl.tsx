import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

interface WindSpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export default function WindSpeedControl({ speed, onSpeedChange }: WindSpeedControlProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wind Speed</Text>
      <View style={styles.speedControl}>
        <TouchableOpacity
          style={styles.speedButton}
          onPress={() => onSpeedChange(Math.max(0, speed - 1))}
        >
          <Ionicons name="remove" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.speedValue}>{speed} mph</Text>
        <TouchableOpacity
          style={styles.speedButton}
          onPress={() => onSpeedChange(speed + 1)}
        >
          <Ionicons name="add" size={24} color={theme.colors.text} />
        </TouchableOpacity>
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
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.sm,
  },
  speedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  speedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedValue: {
    color: theme.colors.text,
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
  },
});