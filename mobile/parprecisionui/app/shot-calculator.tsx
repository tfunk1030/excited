import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import WeatherCard from '@/components/weather/WeatherCard';
import ShotInput from '@/components/shot/ShotInput';
import ClubSelector from '@/components/shot/ClubSelector';
import ResultDisplay from '@/components/shot/ResultDisplay';
import type { WeatherData, ShotCalculation } from '@/types';
import theme from '@/constants/theme';

export default function ShotCalculatorScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 75,
    feelsLike: 77,
    humidity: 80,
    pressure: 1009,
    altitude: 806,
    airDensity: 1.159
  });

  const [calculation, setCalculation] = useState<ShotCalculation>({
    targetDistance: 150,
    adjustedDistance: 165,
    adjustments: [
      { type: 'temperature', value: 75, effect: 8 },
      { type: 'altitude', value: 806, effect: 7 },
      { type: 'humidity', value: 80, effect: 1 },
      { type: 'airDensity', value: 1.159, effect: -1 }
    ],
    recommendedClub: '8i'
  });

  useEffect(() => {
    // TODO: Fetch real weather data
    // For now using mock data
  }, []);

  const handleDistanceChange = async (distance: number) => {
    if (distance <= 0 || distance > 300) {
      // Show error: Distance must be between 1 and 300 yards
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call yardage_model_enhanced.py with:
      // - distance
      // - weatherData
      // For now, just update the target distance
      setCalculation((prev: ShotCalculation) => ({
        ...prev,
        targetDistance: distance,
        adjustedDistance: distance + 15, // Mock adjustment
      }));
    } catch (error) {
      // Show error: Calculation failed
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClubSelect = (club: string) => {
    if (!club) {
      // Show error: Club selection required
      return;
    }

    setCalculation((prev: ShotCalculation) => ({
      ...prev,
      recommendedClub: club
    }));
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
      <WeatherCard data={weatherData} />
      <ShotInput
        targetDistance={calculation.targetDistance}
        onDistanceChange={handleDistanceChange}
      />
      <ResultDisplay calculation={calculation} />
      <ClubSelector
        selectedClub={calculation.recommendedClub}
        onClubSelect={handleClubSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});