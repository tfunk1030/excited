import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from './Card';
import { SkeletonLoader } from './SkeletonLoader';
import { theme } from '../../styles/theme';

export const ShotScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Distance Input Skeleton */}
      <Card style={styles.distanceCard}>
        <SkeletonLoader height={40} />
      </Card>

      {/* Weather Grid Skeleton */}
      <View style={styles.weatherGrid}>
        {[1, 2, 3].map((key) => (
          <Card key={key} style={styles.weatherCard}>
            <SkeletonLoader height={24} width={40} style={styles.weatherIcon} />
            <SkeletonLoader height={20} width={60} style={styles.weatherValue} />
            <SkeletonLoader height={16} width={80} />
          </Card>
        ))}
      </View>

      {/* Environmental Impact Skeleton */}
      <Card style={styles.impactCard}>
        {[1, 2, 3].map((key) => (
          <View key={key} style={styles.impactRow}>
            <SkeletonLoader height={16} width={100} />
            <SkeletonLoader height={16} width={60} />
          </View>
        ))}
      </Card>

      {/* Club Selection Skeleton */}
      <Card style={styles.recommendationCard}>
        <View style={styles.clubHeader}>
          <SkeletonLoader height={32} width={40} style={styles.directionIcon} />
          <View style={styles.clubInfo}>
            <SkeletonLoader height={24} width={120} />
            <SkeletonLoader height={20} width={80} style={styles.distance} />
          </View>
        </View>
        <View style={styles.alternatives}>
          {[1, 2].map((key) => (
            <View key={key} style={styles.alternativeRow}>
              <SkeletonLoader height={20} width={100} />
              <SkeletonLoader height={16} width={150} style={styles.reason} />
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  distanceCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  weatherCard: {
    padding: theme.spacing.md,
    width: '30%',
    alignItems: 'center',
  },
  weatherIcon: {
    marginBottom: theme.spacing.sm,
  },
  weatherValue: {
    marginBottom: theme.spacing.xs,
  },
  impactCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  recommendationCard: {
    padding: theme.spacing.md,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  directionIcon: {
    marginRight: theme.spacing.md,
  },
  clubInfo: {
    flex: 1,
  },
  distance: {
    marginTop: theme.spacing.xs,
  },
  alternatives: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  alternativeRow: {
    marginBottom: theme.spacing.md,
  },
  reason: {
    marginTop: theme.spacing.xs,
  },
});
