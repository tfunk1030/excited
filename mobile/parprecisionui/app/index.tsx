import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import WeatherCard from '@/components/weather/WeatherCard';
import type { WeatherData } from '@/types';
import theme from '@/constants/theme';

export default function CurrentConditionsScreen() {
  const [weatherData] = useState<WeatherData>({
    temperature: 79,
    feelsLike: 81,
    humidity: 77,
    pressure: 1005,
    altitude: 1066,
    airDensity: 1.159
  });

  return (
    <View style={styles.container}>
      <WeatherCard data={weatherData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2E',
    padding: 16,
  },
  header: {
    marginTop: 32,
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  menu: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252B3D',
    padding: 16,
    borderRadius: 12,
    height: 56,
  },
  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});