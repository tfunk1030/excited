import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/shared/Card';
import { theme } from '../../styles/theme';
import { usePlayerProfile } from '../../services/profileService';
import type { MainTabScreenProps } from '../../navigation/types';

const SettingsScreen: React.FC<MainTabScreenProps<'Settings'>> = () => {
  const navigation = useNavigation();
  const { profile } = usePlayerProfile();

  const handleClubManagement = () => {
    navigation.navigate('ClubManagement');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Card style={styles.card}>
            <Text style={styles.label}>Skill Level</Text>
            <Text style={styles.value}>{profile?.skillLevel || 'Not set'}</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment</Text>
          <TouchableOpacity onPress={handleClubManagement}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Club Management</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <Card style={styles.card}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  card: {
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  chevron: {
    ...theme.typography.h2,
    color: theme.colors.text.secondary,
  },
});

export default SettingsScreen;
