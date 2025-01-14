export type Club = 
  | 'Driver'
  | '3-Wood'
  | '5-Wood'
  | '4-Iron'
  | '5-Iron'
  | '6-Iron'
  | '7-Iron'
  | '8-Iron'
  | '9-Iron'
  | 'PW'
  | 'SW';

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  altitude: number;
}

export interface ShotCalculation {
  targetYardage: number;
  adjustedYardage: number;
  club: Club;
  conditions: WeatherData;
}

export interface ApiResponse {
  success: boolean;
  data?: ShotCalculation;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}