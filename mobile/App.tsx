import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

// Initialize Sentry
Sentry.init({
  dsn: "https://b8db55279db348ebc52298b98f93d713@o4508523532451840.ingest.us.sentry.io/4508632565219328",
  debug: __DEV__,
  enableAutoSessionTracking: true,
});

function App() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

// Wrap the app with Sentry's error boundary
export default Sentry.wrap(App);
