import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock the navigation container
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the safe area provider
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the bottom tab navigator
jest.mock('../src/navigation/BottomTabNavigator', () => 'BottomTabNavigator');

describe('App', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    // Add assertions here once we have testIDs in place
  });
});
