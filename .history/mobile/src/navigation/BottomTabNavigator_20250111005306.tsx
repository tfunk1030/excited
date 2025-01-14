import React, { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList, MainTabScreenProps } from './types';
import { theme } from '../styles/theme';

// Lazy load screens
const ShotScreen = React.lazy(() => import('../screens/Shot/ShotScreen'));
const WeatherScreen = React.lazy(() => import('../screens/Weather/WeatherScreen'));
const SettingsScreen = React.lazy(() => import('../screens/Settings/SettingsScreen'));

const Tab = createBottomTabNavigator<MainTabParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const ScreenWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

const WrappedShotScreen = () => (
  <ScreenWrapper>
    <ShotScreen />
  </ScreenWrapper>
);

const WrappedWeatherScreen = () => (
  <ScreenWrapper>
    <WeatherScreen />
  </ScreenWrapper>
);

const WrappedSettingsScreen = () => (
  <ScreenWrapper>
    <SettingsScreen />
  </ScreenWrapper>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: theme.typography.h3,
      }}
    >
      <Tab.Screen
        name="Shot"
        component={WrappedShotScreen}
        options={{
          title: 'Shot Calculator',
          tabBarLabel: 'Shot',
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WrappedWeatherScreen}
        options={{
          title: 'Weather',
          tabBarLabel: 'Weather',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={WrappedSettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default BottomTabNavigator;
