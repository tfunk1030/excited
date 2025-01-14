import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../styles/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const Card = ({ children, style, ...props }: CardProps) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
});

export default Card;
