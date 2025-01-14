import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ClubSelectorProps } from '@/types';
import theme from '@/constants/theme';

const CLUBS = [
  { name: 'Driver', loft: '10.5°' },
  { name: '3W', loft: '15°' },
  { name: '5W', loft: '18°' },
  { name: '4i', loft: '21°' },
  { name: '5i', loft: '24°' },
  { name: '6i', loft: '27°' },
  { name: '7i', loft: '31°' },
  { name: '8i', loft: '35°' },
  { name: '9i', loft: '39°' },
  { name: 'PW', loft: '44°' },
  { name: 'SW', loft: '56°' },
];

export default function ClubSelector({ selectedClub, onClubSelect }: ClubSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Club</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CLUBS.map((club) => (
          <TouchableOpacity
            key={club.name}
            style={[
              styles.clubButton,
              selectedClub === club.name && styles.selectedClub,
            ]}
            onPress={() => onClubSelect(club.name)}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name="golf" 
                size={24} 
                color={selectedClub === club.name ? '#FFFFFF' : theme.colors.text} 
              />
            </View>
            <Text style={[
              styles.clubName,
              selectedClub === club.name && styles.selectedText,
            ]}>
              {club.name}
            </Text>
            <Text style={[
              styles.clubLoft,
              selectedClub === club.name && styles.selectedText,
            ]}>
              {club.loft}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  scrollContent: {
    gap: theme.spacing.sm,
  },
  clubButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    width: 100,
  },
  selectedClub: {
    backgroundColor: theme.colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  clubName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  clubLoft: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});