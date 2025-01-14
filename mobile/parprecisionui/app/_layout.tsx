import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A1F2E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerStyle: {
            backgroundColor: '#1A1F2E',
          },
          drawerActiveTintColor: '#4CAF50',
          drawerInactiveTintColor: '#B0B0B0',
          drawerLabelStyle: {
            marginLeft: -16,
          },
          drawerItemStyle: {
            borderRadius: 0,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Current Conditions',
            drawerLabel: 'Current Conditions',
            drawerIcon: ({ color }) => (
              <Ionicons name="cloud-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="shot-calculator"
          options={{
            title: 'Shot Calculator',
            drawerLabel: 'Shot Calculator',
            drawerIcon: ({ color }) => (
              <Ionicons name="calculator-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="wind-calc"
          options={{
            title: 'Wind Calculator',
            drawerLabel: 'Wind Calc',
            drawerIcon: ({ color }) => (
              <Ionicons name="compass-outline" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
