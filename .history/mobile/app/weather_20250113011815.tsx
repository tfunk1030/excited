import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface WindData {
  speed: number;
  direction: string;
  gust: number;
  temperature: number;
  humidity: number;
  pressure: number;
}

export default function Weather() {
  const [windData, setWindData] = useState<WindData>({
    speed: 8,
    direction: 'NW',
    gust: 12,
    temperature: 72,
    humidity: 45,
    pressure: 30.1,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Wind</Text>
          
          <View style={styles.windCompass}>
            <Ionicons name="compass-outline" size={150} color={theme.colors.primary} />
            <View style={styles.windInfo}>
              <Text style={styles.windSpeed}>{windData.speed}</Text>
              <Text style={styles.windUnit}>mph</Text>
              <Text style={styles.windDirection}>{windData.direction}</Text>
            </View>
          </View>

          <View style={styles.windDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="trending-up" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Gust</Text>
              <Text style={styles.detailValue}>{windData.gust} mph</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weather Conditions</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Ionicons name="thermometer" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Temperature</Text>
              <Text style={styles.value}>{windData.temperature}°F</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Ionicons name="water" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Humidity</Text>
              <Text style={styles.value}>{windData.humidity}%</Text>
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="speedometer" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Pressure</Text>
              <Text style={styles.value}>{windData.pressure} inHg</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={theme.colors.text.inverse} />
          <Text style={styles.refreshButtonText}>Refresh Weather</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  windCompass: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
  },
  windInfo: {
    position: 'absolute',
    alignItems: 'center',
  },
  windSpeed: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  windUnit: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  windDirection: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  windDetails: {
    marginTop: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  inputGroup: {
    gap: theme.spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  refreshButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
}); 