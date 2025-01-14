// Theme types
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

// Club types
export interface Club {
  name: string;
  normalDistance: number;
  loft: number;
}

// Weather types
export interface WeatherData {
  temperature: number;
  feelsLike?: number;
  humidity: number;
  pressure: number;
  altitude: number;
  airDensity: number;
}

export interface WeatherCardProps {
  data: WeatherData;
}

// Shot Calculator types
export interface ShotAdjustment {
  type: 'temperature' | 'altitude' | 'humidity' | 'airDensity';
  value: number;
  effect: number;
}

export interface ShotCalculation {
  targetDistance: number;
  adjustedDistance: number;
  adjustments: ShotAdjustment[];
  recommendedClub?: string;
}

// Component Props
export interface ShotInputProps {
  targetDistance: number;
  onDistanceChange: (distance: number) => void;
}

export interface ClubSelectorProps {
  selectedClub?: string;
  onClubSelect: (club: string) => void;
}

export interface ResultDisplayProps {
  calculation: ShotCalculation;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Navigation types
export type RootStackParamList = {
  index: undefined;
  'shot-calculator': undefined;
  'wind-calc': undefined;
  settings: undefined;
};