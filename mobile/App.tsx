import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { ExpoRoot } from 'expo-router';

export default function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['Sending']);
  }, []);

  return <ExpoRoot context={require('./app')} />;
}
