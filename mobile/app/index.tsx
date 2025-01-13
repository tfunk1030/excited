import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClubDetailsModal } from '../src/components/shared/ClubDetailsModal';
import { AlternativeClub } from '../src/components/shared/AlternativeClub';
import { theme } from '../src/styles/theme';

export default function Index() {
  const [selectedClub, setSelectedClub] = useState<{
    club: string;
    distance: number;
    adjustedDistance: number;
    environmentalFactors: {
      temperature: number;
      wind: number;
      altitude: number;
    };
    confidence: number;
    reason?: string;
  } | null>(null);

  // Example data - replace with your actual data source
  const alternativeClubs = [
    { club: '7 Iron', distance: 150, reason: 'More control in wind' },
    { club: '6 Iron', distance: 165, reason: 'Better for uphill lie' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        {alternativeClubs.map((club, index) => (
          <AlternativeClub
            key={index}
            club={club.club}
            distance={club.distance}
            reason={club.reason}
          />
        ))}
      </View>

      {selectedClub && (
        <ClubDetailsModal
          visible={!!selectedClub}
          onClose={() => setSelectedClub(null)}
          details={selectedClub}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  main: {
    flex: 1,
    padding: theme.spacing.md,
  },
}); 