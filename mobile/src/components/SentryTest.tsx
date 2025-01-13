import React from 'react';
import { View, Button } from 'react-native';
import * as Sentry from '@sentry/react-native';

export function SentryTest() {
  const throwJsError = () => {
    throw new Error('Test error button press');
  };

  const triggerNativeCrash = () => {
    Sentry.nativeCrash();
  };

  const sendMessage = () => {
    Sentry.captureMessage('Test message from app');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Throw JS Error" onPress={throwJsError} />
      <Button title="Trigger Native Crash" onPress={triggerNativeCrash} />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
}