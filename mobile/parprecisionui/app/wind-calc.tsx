import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import WindCompass from '@/components/wind/WindCompass';
import WindSpeedControl from '@/components/wind/WindSpeedControl';
import YardageInput from '@/components/shared/YardageInput';
import theme from '@/constants/theme';

export default function WindCalculatorScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [windSpeed, setWindSpeed] = useState(10);
  const [windDirection, setWindDirection] = useState(0);
  const [targetYardage, setTargetYardage] = useState('177');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleCompassTouch = (event: any) => {
    if (!isDragging) return;
    const { locationX, locationY } = event.nativeEvent;
    const centerX = 120; // Half of compass width
    const centerY = 120; // Half of compass height
    const angle = Math.atan2(locationY - centerY, locationX - centerX);
    const degrees = (angle * 180 / Math.PI + 90 + 360) % 360;
    setWindDirection(Math.round(degrees));
  };

  const validateInputs = (): boolean => {
    const yardage = Number(targetYardage);
    if (!targetYardage || isNaN(yardage) || yardage <= 0) {
      setError('Please enter a valid target yardage');
      return false;
    }
    if (yardage > 300) {
      setError('Target yardage must be 300 or less');
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleCalculateWindEffect = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      // TODO: Implement wind effect calculation using yardage_model_enhanced.py
      // const result = await calculateWindEffect({
      //   yardage: Number(targetYardage),
      //   windSpeed,
      //   windDirection
      // });
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      setError('Failed to calculate wind effect. Please try again.');
      console.error('Wind calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WindCompass
        direction={windDirection}
        isDragging={isDragging}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDragMove={handleCompassTouch}
      />

      <WindSpeedControl
        speed={windSpeed}
        onSpeedChange={setWindSpeed}
      />

      <YardageInput
        value={targetYardage}
        onChangeText={(text) => {
          setTargetYardage(text);
          setError(undefined);
        }}
        error={error}
      />

      <TouchableOpacity 
        style={styles.calculateButton}
        onPress={handleCalculateWindEffect}
      >
        <Text style={styles.calculateButtonText}>Calculate Wind Effect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
});