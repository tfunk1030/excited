import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Animated } from 'react-native';
import Card from '../../components/shared/Card';
import { ZoomableWeatherCard } from '../../components/shared/ZoomableWeatherCard';
import { ImpactRow, getImpactColor } from '../../components/shared/ImpactRow';
import { DirectionIndicator } from '../../components/shared/DirectionIndicator';
import { DistanceInput } from '../../components/shared/DistanceInput';
import { SwipeableClubAlternatives } from '../../components/shared/SwipeableClubAlternatives';
import { ShotScreenSkeleton } from '../../components/shared/ShotScreenSkeleton';
import { ClubDetailsModal } from '../../components/shared/ClubDetailsModal';
import { LongPressHandler } from '../../components/shared/LongPressHandler';
import { theme } from '../../styles/theme';
import { useWeatherData } from '../../services/weatherService';
import { useShotCalculator } from '../../services/shotService';
import { usePlayerProfile, Club } from '../../services/profileService';
import { useAnimatedUpdate } from '../../hooks/useAnimatedUpdate';
import { getWindDirection } from '../../utils/weather';
import type { MainTabScreenProps } from '../../navigation/types';

const ShotScreen: React.FC<MainTabScreenProps<'Shot'>> = () => {
  const { weatherData, refresh: refreshWeather, loading: weatherLoading } = useWeatherData();
  const { profile } = usePlayerProfile();
  const { calculate: calculateShot, result, loading: calculationLoading, selectClub } = useShotCalculator();
  const { animate, style } = useAnimatedUpdate();
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    animate();
  }, [animate, result]);

  const handleDistanceChange = React.useCallback((distance: number) => {
    if (weatherData && profile) {
      calculateShot(distance, profile, weatherData);
    }
  }, [calculateShot, weatherData, profile]);

  const handleRefresh = React.useCallback(async () => {
    await refreshWeather();
  }, [refreshWeather]);

  const handleSelectAlternative = React.useCallback((alternative: { club: string; distance: number }) => {
    if (selectClub) {
      selectClub(alternative.club);
    }
  }, [selectClub]);

  const handleLongPress = React.useCallback(() => {
    setModalVisible(true);
  }, []);

  // Show skeleton loader for initial data loading
  if (!weatherData || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <ShotScreenSkeleton />
      </SafeAreaView>
    );
  }

  const mappedAlternatives = result?.alternatives.map(alt => ({
    club: alt.club,
    distance: alt.adjustedDistance,
    reason: alt.reason,
  })) || [];

  const currentClub = result?.club as Club | undefined;
  const standardDistance = currentClub !== undefined ? profile.clubDistances[currentClub] : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={weatherLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.text.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <Animated.View style={style}>
          {/* Distance Input */}
          <DistanceInput onDistanceChange={handleDistanceChange} />

          {/* Weather Summary */}
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

          {/* Show skeleton loader during calculations */}
          {calculationLoading ? (
            <Card style={styles.loadingCard}>
              <ShotScreenSkeleton />
            </Card>
          ) : (
            <>
              {/* Environmental Impact */}
              {result?.environmentalFactors && (
                <Card style={styles.impactCard}>
                  <ImpactRow
                    label="Temperature"
                    value={result.environmentalFactors.temperature}
                    color={getImpactColor(result.environmentalFactors.temperature)}
                  />
                  <ImpactRow
                    label="Wind"
                    value={result.environmentalFactors.wind}
                    color={getImpactColor(result.environmentalFactors.wind)}
                  />
                  <ImpactRow
                    label="Altitude"
                    value={result.environmentalFactors.altitude}
                    color={getImpactColor(result.environmentalFactors.altitude)}
                  />
                </Card>
              )}

              {/* Club Selection */}
              {result && (
                <Card style={styles.recommendationCard}>
                  <View style={styles.primaryClub}>
                    <LongPressHandler onLongPress={handleLongPress}>
                      <View style={styles.clubHeader}>
                        <View style={styles.clubInfo}>
                          <DirectionIndicator 
                            angle={result.direction ? parseInt(result.direction, 10) : 0} 
                          />
                          <View>
                            <Text style={styles.clubName}>
                              {result.club}
                            </Text>
                            <Text style={styles.distance}>
                              {result.adjustedDistance}y
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LongPressHandler>
                    <SwipeableClubAlternatives 
                      alternatives={mappedAlternatives}
                      onSelectAlternative={handleSelectAlternative}
                    />
                  </View>
                </Card>
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* Club Details Modal */}
      {result && standardDistance !== undefined && (
        <ClubDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          details={{
            club: result.club,
            distance: standardDistance,
            adjustedDistance: result.adjustedDistance,
            environmentalFactors: result.environmentalFactors,
            confidence: 0.87, // TODO: Get from calculation
            reason: result.alternatives.find(alt => alt.club === result.club)?.reason,
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing.md,
  },
  loadingCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
  },
  impactCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
  },
  recommendationCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
  },
  primaryClub: {
    marginBottom: theme.spacing.md,
  },
  clubHeader: {
    marginBottom: theme.spacing.md,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubName: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  distance: {
    ...theme.typography.h3,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
  },
});

export default ShotScreen;
