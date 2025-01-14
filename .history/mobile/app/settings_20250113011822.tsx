import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface Settings {
  units: {
    distance: 'yards' | 'meters';
    temperature: 'fahrenheit' | 'celsius';
    elevation: 'feet' | 'meters';
  };
  notifications: {
    weather: boolean;
    tips: boolean;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    units: {
      distance: 'yards',
      temperature: 'fahrenheit',
      elevation: 'feet',
    },
    notifications: {
      weather: true,
      tips: true,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Units</Text>
          
          <View style={styles.settingGroup}>
            <View style={styles.settingRow}>
              <Ionicons name="resize" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Distance</Text>
              <TouchableOpacity 
                style={[
                  styles.unitToggle,
                  settings.units.distance === 'yards' && styles.unitToggleActive
                ]}
              >
                <Text style={styles.unitToggleText}>Yards</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.unitToggle,
                  settings.units.distance === 'meters' && styles.unitToggleActive
                ]}
              >
                <Text style={styles.unitToggleText}>Meters</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="thermometer" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Temperature</Text>
              <TouchableOpacity 
                style={[
                  styles.unitToggle,
                  settings.units.temperature === 'fahrenheit' && styles.unitToggleActive
                ]}
              >
                <Text style={styles.unitToggleText}>°F</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.unitToggle,
                  settings.units.temperature === 'celsius' && styles.unitToggleActive
                ]}
              >
                <Text style={styles.unitToggleText}>°C</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="trending-up" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Elevation</Text>
              <TouchableOpacity 
                style={[
                  styles.unitToggle,
                  settings.units.elevation === 'feet' && styles.unitToggleActive
                ]}
              >
                <Text style={styles.unitToggleText}>Feet</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.unitToggle,
                  settings.units.elevation === 'meters' && styles.unitToggleActive
                ]}
              >
                <Text style={styles.unitToggleText}>Meters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          
          <View style={styles.settingGroup}>
            <View style={styles.settingRow}>
              <Ionicons name="cloudy" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Weather Updates</Text>
              <Switch
                value={settings.notifications.weather}
                onValueChange={(value) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, weather: value }
                  }))
                }
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="bulb" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.label}>Golf Tips</Text>
              <Switch
                value={settings.notifications.tips}
                onValueChange={(value) => 
                  setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, tips: value }
                  }))
                }
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Ionicons name="log-out" size={24} color={theme.colors.error} />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  settingGroup: {
    gap: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  unitToggle: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.xs,
    backgroundColor: theme.colors.border,
  },
  unitToggleActive: {
    backgroundColor: theme.colors.primary,
  },
  unitToggleText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  signOutButtonText: {
    ...theme.typography.button,
    color: theme.colors.error,
  },
}); 