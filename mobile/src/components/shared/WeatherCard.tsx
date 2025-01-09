import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../styles/theme';

interface WeatherCardProps {
  icon: string;
  value: string;
  label: string;
}

const WeatherCard = memo<WeatherCardProps>(({
  icon,
  value,
  label,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.icon === nextProps.icon &&
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '30%',
  },
  iconContainer: {
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  value: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;
