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
        getComponent={() => 
          import('../screens/Shot/ShotScreen').then(module => module.default)
        }
      />
      <Tab.Screen
        name="Weather"
        options={{
          title: 'Weather',
          tabBarLabel: 'Weather',
        }}
        getComponent={() => 
          import('../screens/Weather/WeatherScreen').then(module => module.default)
        }
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
        getComponent={() => 
          import('../screens/Settings/SettingsScreen').then(module => module.default)
        }
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
