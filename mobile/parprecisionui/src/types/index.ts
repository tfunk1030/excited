// Club types
export type Club = '3-Wood' | '5-Wood' | '4-Iron' | '5-Iron' | '6-Iron' | '7-Iron' | '8-Iron' | '9-Iron' | 'PW' | 'SW';

// Weather and conditions
export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  altitude: number;
  humidity?: number;
  pressure?: number;
  airDensity?: number;
}

// Shot calculations
export interface ShotCalculation {
  targetYardage: number;
  adjustedYardage: number;
  club: Club;
  conditions: WeatherData;
  adjustments?: {
    temperature?: number;
    altitude?: number;
    windEffect?: number;
    totalAdjustment: number;
  };
}

// API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Settings
export interface UnitPreferences {
  distance: 'yards' | 'meters';
  temperature: 'celsius' | 'fahrenheit';
  altitude: 'feet' | 'meters';
}

export interface ClubSettings {
  name: string;
  normalDistance: number;
  loft: number;
}

// Navigation
export type RootStackParamList = {
  index: undefined;
  weather: undefined;
  'shot-calculator': undefined;
  'wind-calc': undefined;
  settings: undefined;
};

// Theme
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  border: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '500';
  };
  h2: {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '500';
  };
  h3: {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '500';
  };
  body: {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '500';
  };
  caption: {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '500';
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

// Environment
export interface Environment {
  APP_ENV: 'development' | 'staging' | 'production';
  APP_API_URL: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}