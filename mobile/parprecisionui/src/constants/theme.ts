import { Theme } from '../types';

const theme: Theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    background: '#1A1F2E',
    surface: '#252B3D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    error: '#FF5252',
    success: '#4CAF50',
    border: '#404859',
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
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export default theme;