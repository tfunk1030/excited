import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { theme } from '../src/styles/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            ...theme.typography.h2,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Club Selection',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
} 