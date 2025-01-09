export const TOMORROW_API_KEY = 'jG9onLuVeiR4NWlVIO85EWWLCtQ2Uzqv';
export const OPENWEATHER_API_KEY = '8b89ef2959c1de5c835ac05cb77ced7f';
export const MAPS_API_KEY = 'AIzaSyD_x1zz-HTYkDWacEk1WPya0LgDUCo3jUw';

export const API_ENDPOINTS = {
  tomorrow: {
    base: 'https://api.tomorrow.io/v4',
    weather: '/weather/realtime',
  },
  openweather: {
    base: 'https://api.openweathermap.org/data/2.5',
    weather: '/weather',
  },
  elevation: {
    base: 'https://maps.googleapis.com/maps/api',
    elevation: '/elevation/json',
  },
};

export type WeatherProvider = 'tomorrow' | 'openweather';

export interface WeatherError extends Error {
  provider: WeatherProvider;
}

export class WeatherAPIError extends Error implements WeatherError {
  provider: WeatherProvider;

  constructor(message: string, provider: WeatherProvider) {
    super(message);
    this.provider = provider;
    this.name = 'WeatherAPIError';
  }
}

export interface ElevationResponse {
  results: Array<{
    elevation: number;
    location: {
      lat: number;
      lng: number;
    };
    resolution: number;
  }>;
  status: string;
}

export interface ElevationError extends Error {
  status?: string;
  code?: string;
}

export class ElevationAPIError extends Error implements ElevationError {
  status?: string;
  code?: string;

  constructor(message: string, status?: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ElevationAPIError';
  }
}
