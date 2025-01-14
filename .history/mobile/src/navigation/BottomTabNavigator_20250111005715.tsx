import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList, MainTabScreenProps } from './types';
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

const WrappedShotScreen = (props: MainTabScreenProps<'Shot'>) => (
  <React.Suspense fallback={<LoadingScreen />}>
    <ShotScreen {...props} />
  </React.Suspense>
);

const WrappedWeatherScreen = (props: MainTabScreenProps<'Weather'>) => (
  <React.Suspense fallback={<LoadingScreen />}>
    <WeatherScreen {...props} />
  </React.Suspense>
);

const WrappedSettingsScreen = (props: MainTabScreenProps<'Settings'>) => (
  <React.Suspense fallback={<LoadingScreen />}>
    <SettingsScreen {...props} />
  </React.Suspense>
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
