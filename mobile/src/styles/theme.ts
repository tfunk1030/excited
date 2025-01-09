export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    border: '#E5E5E5',
    success: '#34C759',
    error: '#FF3B30',
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.6)',
      inverse: '#FFFFFF',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 48,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 32,
      fontWeight: '700' as const,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

export type Theme = typeof theme;

// Type-safe font weights
export type FontWeight = 
  | '100' | '200' | '300' | '400' | '500' 
  | '600' | '700' | '800' | '900' | 'bold' 
  | 'normal';

// Helper function to ensure type-safe font weights
export const getFontWeight = (weight: FontWeight): FontWeight => weight;
