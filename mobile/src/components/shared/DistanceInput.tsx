import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Vibration } from 'react-native';
import Card from './Card';
import { theme } from '../../styles/theme';

interface DistanceInputProps {
  onDistanceChange: (distance: number) => void;
}

export const DistanceInput: React.FC<DistanceInputProps> = ({
  onDistanceChange,
}) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const validateAndUpdate = (text: string) => {
    setValue(text);
    
    // Clear error when input is cleared
    if (!text) {
      setError(null);
      return;
    }

    const distance = parseInt(text, 10);

    // Validate numeric input
    if (isNaN(distance)) {
      setError('Please enter a valid number');
      Vibration.vibrate(100); // Short vibration for error
      return;
    }

    // Validate reasonable distance range (10-400 yards)
    if (distance < 10 || distance > 400) {
      setError('Distance should be between 10 and 400 yards');
      Vibration.vibrate(100);
      return;
    }

    // Clear error and update parent
    setError(null);
    onDistanceChange(distance);
    Vibration.vibrate(50); // Very short vibration for success
  };

  return (
    <Card style={styles.container}>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null
        ]}
        value={value}
        onChangeText={validateAndUpdate}
        placeholder="Enter target distance"
        placeholderTextColor={theme.colors.text.secondary}
        keyboardType="numeric"
        maxLength={3}
        returnKeyType="done"
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {!error && value && (
        <Text style={styles.unit}>yards</Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.md,
  },
  input: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    textAlign: 'center',
    padding: theme.spacing.md,
  },
  inputError: {
    color: theme.colors.error,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  unit: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});
