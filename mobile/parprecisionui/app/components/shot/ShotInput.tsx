import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import type { ShotInputProps } from '@/types';
import theme from '@/constants/theme';

export default function ShotInput({ targetDistance, onDistanceChange }: ShotInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Target Distance</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={50}
          maximumValue={300}
          value={targetDistance}
          onValueChange={onDistanceChange}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
          step={1}
        />
        <Text style={styles.value}>{Math.round(targetDistance)} yds</Text>
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
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  value: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    width: 70,
    textAlign: 'right',
  },
});