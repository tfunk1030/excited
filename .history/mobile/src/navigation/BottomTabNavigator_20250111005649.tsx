import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const ShotScreen = React.lazy(() => 
  import('../screens/Shot/ShotScreen').then(module => ({
    default: module.default
  }))
);

const WeatherScreen = React.lazy(() => 
  import('../screens/Weather/WeatherScreen').then(module => ({
    default: module.default
  }))
);

const SettingsScreen = React.lazy(() => 
  import('../screens/Settings/SettingsScreen').then(module => ({
    default: module.default
  }))
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
        options={{
          title: 'Shot Calculator',
          tabBarLabel: 'Shot',
        }}
      >
        {() => (
          <React.Suspense fallback={<LoadingScreen />}>
            <ShotScreen />
          </React.Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Weather"
        options={{
          title: 'Weather',
          tabBarLabel: 'Weather',
        }}
      >
        {() => (
          <React.Suspense fallback={<LoadingScreen />}>
            <WeatherScreen />
          </React.Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      >
        {() => (
          <React.Suspense fallback={<LoadingScreen />}>
            <SettingsScreen />
          </React.Suspense>
        )}
      </Tab.Screen>
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
