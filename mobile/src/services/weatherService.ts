import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import Config from 'react-native-config';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  altitude: number;
  windSpeed: number;
  windDirection: number;
  airDensity: number;
}

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
}

const WEATHER_API_KEY = Config.OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const calculateAirDensity = (
  temperature: number,
  pressure: number,
  altitude: number
): number => {
  // Standard temperature lapse rate (°C/m)
  const lapseRate = 0.0065;
  
  // Convert temperature to Kelvin
  const tempK = temperature + 273.15;
  
  // Standard atmospheric pressure at sea level (Pa)
  const p0 = 101325;
  
  // Gas constant for air (J/(kg·K))
  const R = 287.05;
  
  // Gravitational acceleration (m/s²)
  const g = 9.80665;
  
  // Calculate air density using the barometric formula
  const density = (pressure * 100) / (R * tempK) * 
    Math.exp((-g * altitude) / (R * tempK));
  
  return density;
};

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, altitude } = location.coords;

      // Fetch weather data
      const response = await fetch(
        `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data: WeatherResponse = await response.json();

      // Calculate air density
      const airDensity = calculateAirDensity(
        data.main.temp,
        data.main.pressure,
        altitude || 0
      );

      setWeatherData({
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        altitude: altitude || 0,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        airDensity,
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();

    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  return {
    weatherData,
    loading,
    error,
    refresh: fetchWeatherData,
  };
};
