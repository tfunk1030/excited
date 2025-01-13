export const theme = {
  colors: {
    primary: '#4B7BF5',
    background: '#1A1D24',
    card: '#242830',
    border: '#2F333D',
    shadow: '#000000',
    error: '#FF4444',
    text: {
      primary: '#FFFFFF',
      secondary: '#8A8D94',
      inverse: '#FFFFFF',
      accent: {
        positive: '#4CAF50',
        negative: '#F44336',
      }
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
      fontWeight: '700',
    },
    h2: {
      fontSize: 32,
      fontWeight: '600',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
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
