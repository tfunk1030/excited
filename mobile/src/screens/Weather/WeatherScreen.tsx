import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, RefreshControl } from 'react-native';
import Card from '../../components/shared/Card';
import { ZoomableWeatherCard } from '../../components/shared/ZoomableWeatherCard';
import { theme } from '../../styles/theme';
import { useWeatherData } from '../../services/weatherService';
import { getWindDirection } from '../../utils/weather';
import type { MainTabScreenProps } from '../../navigation/types';

const WeatherScreen: React.FC<MainTabScreenProps<'Weather'>> = () => {
  const { weatherData, refresh, loading } = useWeatherData();

  const handleRefresh = React.useCallback(async () => {
    await refresh();
  }, [refresh]);

  if (!weatherData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.text.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Conditions</Text>
          <View style={styles.weatherGrid}>
            <ZoomableWeatherCard
              icon="thermometer"
              value={`${Math.round(weatherData.temperature)}°F`}
              label="Temperature"
            />
            <ZoomableWeatherCard
              icon="wind"
              value={`${Math.round(weatherData.windSpeed)}mph`}
              label={getWindDirection(weatherData.windDirection)}
            />
            <ZoomableWeatherCard
              icon="arrow-up"
              value={`${Math.round(weatherData.altitude)}'`}
              label="Altitude"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Card style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Feels Like</Text>
              <Text style={styles.detailValue}>{Math.round(weatherData.feelsLike)}°F</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{Math.round(weatherData.humidity)}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>{Math.round(weatherData.pressure)} hPa</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Air Density</Text>
              <Text style={styles.detailValue}>{weatherData.airDensity.toFixed(3)} kg/m³</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.md,
  },
  detailsCard: {
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
});

export default WeatherScreen;
