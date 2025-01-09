import React, { Suspense } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { RootStackParamList } from './src/navigation/types';
import { theme } from './src/styles/theme';

// Lazy load screens
const BottomTabNavigator = React.lazy(() => import('./src/navigation/BottomTabNavigator'));
const ClubManagementScreen = React.lazy(() => import('./src/screens/Settings/ClubManagementScreen'));

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Suspense fallback={<LoadingScreen />}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.text.primary,
                headerTitleStyle: theme.typography.h3,
              }}
            >
              <Stack.Screen
                name="Main"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ClubManagement"
                component={ClubManagementScreen}
                options={{ title: 'Club Management' }}
              />
            </Stack.Navigator>
          </Suspense>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default App;
