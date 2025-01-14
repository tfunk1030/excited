import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/theme';

interface WindCompassProps {
  direction: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragMove: (event: any) => void;
}

export default function WindCompass({
  direction,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragMove,
}: WindCompassProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.directionText}>Wind: {direction}°</Text>
      <Text style={styles.hint}>Drag the blue handle to set wind direction</Text>
      
      <View 
        style={styles.compass}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
        onTouchMove={onDragMove}
      >
        <View style={styles.compassRings}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.ring,
                { width: 240 - i * 60, height: 240 - i * 60 },
              ]}
            />
          ))}
        </View>
        <View style={[styles.arrow, { transform: [{ rotate: `${direction}deg` }] }]}>
          <Ionicons name="arrow-up" size={48} color={theme.colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  directionText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  compass: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    position: 'relative',
  },
  compassRings: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});