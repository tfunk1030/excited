import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { DraggableClubList } from '../../components/shared/DraggableClubList';
import { usePlayerProfile } from '../../services/profileService';
import { theme } from '../../styles/theme';

const ClubManagementScreen: React.FC = () => {
  const { profile, reorderClubs } = usePlayerProfile();

  const handleReorder = (fromIndex: number, toIndex: number) => {
    reorderClubs(fromIndex, toIndex);
  };

  const clubs = profile.clubOrder.map(club => ({
    club,
    distance: profile.clubDistances[club] || 0,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <DraggableClubList
          clubs={clubs}
          onReorder={handleReorder}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
});

export default ClubManagementScreen;
