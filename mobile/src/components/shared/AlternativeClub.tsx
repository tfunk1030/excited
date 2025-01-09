import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

interface AlternativeClubProps {
  club: string;
  distance: number;
  reason: string;
}

export const AlternativeClub: React.FC<AlternativeClubProps> = ({
  club,
  distance,
  reason,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.clubInfo}>
        <Text style={styles.club}>{club}</Text>
        <Text style={styles.distance}>{distance}y</Text>
      </View>
      <Text style={styles.reason}>{reason}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.xs,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  club: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
    marginRight: theme.spacing.sm,
  },
  distance: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  reason: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
});
