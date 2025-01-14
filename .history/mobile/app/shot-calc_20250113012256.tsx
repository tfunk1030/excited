import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function ShotCalculator() {
  const [targetDistance, setTargetDistance] = useState(150);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shot Calculator</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Target Distance</Text>
        <View style={styles.distanceContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={300}
            value={targetDistance}
            onValueChange={setTargetDistance}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <Text style={styles.distanceValue}>{targetDistance} yds</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shot Adjustments</Text>
        
        <View style={styles.adjustmentRow}>
          <View style={styles.adjustmentIcon}>
            <Ionicons name="analytics" size={24} color={theme.colors.text.secondary} />
          </View>
          <View style={styles.adjustmentContent}>
            <View style={styles.adjustmentHeader}>
              <Text style={styles.adjustmentLabel}>Air Density</Text>
              <Text style={styles.adjustmentSubtext}>1.165 kg/m³</Text>
            </View>
            <Text style={[styles.adjustmentValue, styles.negative]}>-1 yds</Text>
          </View>
        </View>

        <View style={styles.adjustmentRow}>
          <View style={styles.adjustmentIcon}>
            <Ionicons name="trending-up" size={24} color={theme.colors.text.secondary} />
          </View>
          <View style={styles.adjustmentContent}>
            <View style={styles.adjustmentHeader}>
              <Text style={styles.adjustmentLabel}>Altitude</Text>
              <Text style={styles.adjustmentSubtext}>766 ft</Text>
            </View>
            <Text style={[styles.adjustmentValue, styles.positive]}>+6 yds</Text>
          </View>
        </View>

        <View style={styles.adjustmentRow}>
          <View style={styles.adjustmentIcon}>
            <Ionicons name="thermometer" size={24} color={theme.colors.text.secondary} />
          </View>
          <View style={styles.adjustmentContent}>
            <View style={styles.adjustmentHeader}>
              <Text style={styles.adjustmentLabel}>Temperature</Text>
              <Text style={styles.adjustmentSubtext}>77.5°F</Text>
            </View>
            <Text style={[styles.adjustmentValue, styles.positive]}>+9 yds</Text>
          </View>
        </View>

        <View style={styles.adjustmentRow}>
          <View style={styles.adjustmentIcon}>
            <Ionicons name="water" size={24} color={theme.colors.text.secondary} />
          </View>
          <View style={styles.adjustmentContent}>
            <View style={styles.adjustmentHeader}>
              <Text style={styles.adjustmentLabel}>Humidity</Text>
              <Text style={styles.adjustmentSubtext}>57%</Text>
            </View>
            <Text style={[styles.adjustmentValue, styles.positive]}>+0 yds</Text>
          </View>
        </View>

        <View style={styles.totalAdjustment}>
          <Text style={styles.totalLabel}>Total Adjustment</Text>
          <Text style={[styles.totalValue, styles.positive]}>+14 yds</Text>
        </View>

        <View style={styles.playingDistance}>
          <Text style={styles.playingDistanceLabel}>Playing Distance</Text>
          <Text style={styles.playingDistanceValue}>164 yds</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended Club</Text>
        <View style={styles.clubRow}>
          <View style={styles.clubIcon}>
            <Ionicons name="golf" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.clubInfo}>
            <Text style={styles.clubName}>8i</Text>
            <Text style={styles.clubDistance}>Normal carry: 165 yds</Text>
          </View>
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
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  distanceValue: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    width: 100,
    textAlign: 'right',
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  adjustmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  adjustmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  adjustmentContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustmentHeader: {
    flex: 1,
  },
  adjustmentLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  adjustmentSubtext: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  adjustmentValue: {
    ...theme.typography.body,
    fontWeight: '600',
    textAlign: 'right',
    width: 70,
  },
  positive: {
    color: theme.colors.text.accent.positive,
  },
  negative: {
    color: theme.colors.text.accent.negative,
  },
  totalAdjustment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  totalLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  totalValue: {
    ...theme.typography.h3,
  },
  playingDistance: {
    marginTop: theme.spacing.md,
  },
  playingDistanceLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  playingDistanceValue: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
  },
  clubDistance: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
}); 