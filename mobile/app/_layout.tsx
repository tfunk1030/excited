import { useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme, TouchableOpacity } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { theme } from '../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { Menu } from '../src/components/Menu';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const navigationTheme = {
    dark: colorScheme === 'dark',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text.primary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Menu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            ...theme.typography.h2,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.secondary,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={{ marginLeft: theme.spacing.md }}
            >
              <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Last Shot',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="golf" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: 'Weather',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cloudy" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="shot-calc"
          options={{
            title: 'Shot Calc',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calculator" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
} 