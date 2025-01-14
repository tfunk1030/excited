import React, { Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ShotScreen = React.lazy(() => import('../screens/Shot/ShotScreen'));
const WeatherScreen = React.lazy(() => import('../screens/Weather/WeatherScreen'));
const SettingsScreen = React.lazy(() => import('../screens/Settings/SettingsScreen'));

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const withSuspense = (Component: React.LazyExoticComponent<any>) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
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
        component={withSuspense(ShotScreen)}
        options={{
          title: 'Shot Calculator',
          tabBarLabel: 'Shot',
        }}
      />
      <Tab.Screen
        name="Weather"
        component={withSuspense(WeatherScreen)}
        options={{
          title: 'Weather',
          tabBarLabel: 'Weather',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={withSuspense(SettingsScreen)}
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
