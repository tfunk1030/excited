import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface Club {
  name: string;
  distance: number;
  loft: number;
}

export default function Settings() {
  const [newClub, setNewClub] = useState<Club>({
    name: '',
    distance: 0,
    loft: 0,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Unit Preferences</Text>

          <View style={styles.settingGroup}>
            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <Ionicons name="resize" size={24} color={theme.colors.text.secondary} />
                <Text style={styles.settingLabel}>Distance Unit</Text>
              </View>
              <View style={styles.toggleGroup}>
                <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                  <Text style={styles.toggleText}>Yards</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleButton}>
                  <Text style={styles.toggleText}>Meters</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <Ionicons name="thermometer" size={24} color={theme.colors.text.secondary} />
                <Text style={styles.settingLabel}>Temperature Unit</Text>
              </View>
              <View style={styles.toggleGroup}>
                <TouchableOpacity style={styles.toggleButton}>
                  <Text style={styles.toggleText}>Celsius</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                  <Text style={styles.toggleText}>Fahrenheit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <Ionicons name="trending-up" size={24} color={theme.colors.text.secondary} />
                <Text style={styles.settingLabel}>Altitude Unit</Text>
              </View>
              <View style={styles.toggleGroup}>
                <TouchableOpacity style={styles.toggleButton}>
                  <Text style={styles.toggleText}>Meters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                  <Text style={styles.toggleText}>Feet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Club Management</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Club Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Driver"
              placeholderTextColor={theme.colors.text.secondary}
              value={newClub.name}
              onChangeText={(text) => setNewClub(prev => ({ ...prev, name: text }))}
            />

            <Text style={styles.inputLabel}>Normal Distance (yards)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              value={newClub.distance.toString()}
              onChangeText={(text) => setNewClub(prev => ({ ...prev, distance: parseInt(text) || 0 }))}
            />

            <Text style={styles.inputLabel}>Loft (degrees)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              value={newClub.loft.toString()}
              onChangeText={(text) => setNewClub(prev => ({ ...prev, loft: parseInt(text) || 0 }))}
            />

            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Club</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  settingGroup: {
    gap: theme.spacing.lg,
  },
  settingRow: {
    gap: theme.spacing.md,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  settingLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.xs,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    ...theme.typography.button,
    color: theme.colors.text.primary,
  },
  inputGroup: {
    gap: theme.spacing.md,
  },
  inputLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    ...theme.typography.body,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  addButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
}); 