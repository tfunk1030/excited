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
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Shot"
        options={{
          title: 'Shot Calculator',
          tabBarLabel: 'Shot',
        }}
        children={(props) => {
          const Screen = React.lazy(() => import('../screens/Shot/ShotScreen'));
          return (
            <React.Suspense fallback={<LoadingScreen />}>
              <Screen {...props} />
            </React.Suspense>
          );
        }}
      />
      <Tab.Screen
        name="Weather"
        options={{
          title: 'Weather',
          tabBarLabel: 'Weather',
        }}
        children={(props) => {
          const Screen = React.lazy(() => import('../screens/Weather/WeatherScreen'));
          return (
            <React.Suspense fallback={<LoadingScreen />}>
              <Screen {...props} />
            </React.Suspense>
          );
        }}
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
        children={(props) => {
          const Screen = React.lazy(() => import('../screens/Settings/SettingsScreen'));
          return (
            <React.Suspense fallback={<LoadingScreen />}>
              <Screen {...props} />
            </React.Suspense>
          );
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
