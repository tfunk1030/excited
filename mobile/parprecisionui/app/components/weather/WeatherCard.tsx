import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WeatherCardProps } from '@/types';
import theme from '@/constants/theme';

export default function WeatherCard({ data }: WeatherCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mainTemp}>
        <View style={styles.iconContainer}>
          <Ionicons name="thermometer-outline" size={48} color={theme.colors.text} />
        </View>
        <View>
          <Text style={styles.temperature}>{Math.round(data.temperature)}°F</Text>
          {data.feelsLike && (
            <Text style={styles.feelsLike}>Feels like {Math.round(data.feelsLike)}°F</Text>
          )}
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <View style={styles.conditionIcon}>
            <Ionicons name="water-outline" size={24} color={theme.colors.text} />
          </View>
          <Text style={styles.value}>{data.humidity}%</Text>
          <Text style={styles.label}>Humidity</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.conditionIcon}>
            <Ionicons name="trending-up-outline" size={24} color={theme.colors.text} />
          </View>
          <Text style={styles.value}>{data.altitude} ft</Text>
          <Text style={styles.label}>Altitude</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.conditionIcon}>
            <Ionicons name="speedometer-outline" size={24} color={theme.colors.text} />
          </View>
          <Text style={styles.value}>{data.pressure} hPa</Text>
          <Text style={styles.label}>Pressure</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.conditionIcon}>
            <Ionicons name="cloud-outline" size={24} color={theme.colors.text} />
          </View>
          <Text style={styles.value}>{data.airDensity.toFixed(3)} kg/m³</Text>
          <Text style={styles.label}>Air Density</Text>
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
  mainTemp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  feelsLike: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  gridItem: {
    width: '48%',
    alignItems: 'center',
  },
  conditionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
});