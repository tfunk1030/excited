import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Weather() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Current Conditions</Text>
      
      <View style={styles.temperatureCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="thermometer" size={32} color={theme.colors.text.secondary} />
        </View>
        <View style={styles.temperatureContent}>
          <Text style={styles.temperature}>77.5°F</Text>
          <Text style={styles.feelsLike}>Feels like 79.5°F</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <View style={styles.gridItemHeader}>
            <Ionicons name="water" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.gridItemTitle}>Humidity</Text>
          </View>
          <Text style={styles.gridItemValue}>57%</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.gridItemHeader}>
            <Ionicons name="trending-up" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.gridItemTitle}>Altitude</Text>
          </View>
          <Text style={styles.gridItemValue}>766 ft</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.gridItemHeader}>
            <Ionicons name="speedometer" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.gridItemTitle}>Pressure</Text>
          </View>
          <Text style={styles.gridItemValue}>1005 hPa</Text>
        </View>

        <View style={styles.gridItem}>
          <View style={styles.gridItemHeader}>
            <Ionicons name="analytics" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.gridItemTitle}>Air Density</Text>
          </View>
          <Text style={styles.gridItemValue}>1.165 kg/m³</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  temperatureCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  temperatureContent: {
    flex: 1,
  },
  temperature: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  feelsLike: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  gridItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    width: '47%',
    flex: 1,
    minWidth: 150,
  },
  gridItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  gridItemTitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  gridItemValue: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
}); 