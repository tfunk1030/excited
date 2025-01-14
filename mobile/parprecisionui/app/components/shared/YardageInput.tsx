import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

interface YardageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
}

export default function YardageInput({ 
  value, 
  onChangeText, 
  label = 'Target Yardage',
  error
}: YardageInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        placeholder="Enter target yardage"
        placeholderTextColor={theme.colors.textSecondary}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
  },
});