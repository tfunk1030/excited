import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface ShotData {
  distance: number;
  elevation: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export default function ShotCalculator() {
  const [shotData, setShotData] = useState<ShotData>({
    distance: 150,
    elevation: 0,
    temperature: 72,
    humidity: 45,
    windSpeed: 5,
    windDirection: 'headwind',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shot Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Ionicons name="resize" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>{shotData.distance}y</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Ionicons name="trending-up" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Elevation</Text>
              <Text style={styles.value}>{shotData.elevation}ft</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weather Conditions</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Ionicons name="thermometer" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Temperature</Text>
              <Text style={styles.value}>{shotData.temperature}°F</Text>
            </View>
            
            <View style={styles.inputRow}>
              <Ionicons name="water" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Humidity</Text>
              <Text style={styles.value}>{shotData.humidity}%</Text>
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="speedometer" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Wind Speed</Text>
              <Text style={styles.value}>{shotData.windSpeed} mph</Text>
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="compass" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Wind Direction</Text>
              <Text style={styles.value}>{shotData.windDirection}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.calculateButton}>
          <Text style={styles.calculateButtonText}>Calculate Shot</Text>
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
  calculateButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  calculateButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
}); 