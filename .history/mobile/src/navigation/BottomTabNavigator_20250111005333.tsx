import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { theme } from '../styles/theme';

const ShotScreen = React.lazy(() => import('../screens/Shot/ShotScreen'));
const WeatherScreen = React.lazy(() => import('../screens/Weather/WeatherScreen'));
const SettingsScreen = React.lazy(() => import('../screens/Settings/SettingsScreen'));

const Tab = createBottomTabNavigator<MainTabParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
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
        {(props) => (
          <React.Suspense fallback={<LoadingScreen />}>
            <ShotScreen {...props} />
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
        {(props) => (
          <React.Suspense fallback={<LoadingScreen />}>
            <WeatherScreen {...props} />
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
        {(props) => (
          <React.Suspense fallback={<LoadingScreen />}>
            <SettingsScreen {...props} />
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
