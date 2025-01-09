import { networkCache } from '../utils/networkCache';
import { performanceMonitor } from '../utils/performanceMonitor';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  altitude: number;
  airDensity: number;
}

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
}

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Cache TTLs
const WEATHER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const FORECAST_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Calculate air density based on temperature, pressure, and altitude
 */
function calculateAirDensity(
  temperature: number,
  pressure: number,
  altitude: number
): number {
  const R = 287.05; // Gas constant for air
  const g = 9.81; // Gravity acceleration
  const T = temperature + 273.15; // Convert to Kelvin
  const P = pressure * 100; // Convert hPa to Pa

  // Barometric formula
  const P0 = P * Math.exp((g * altitude) / (R * T));
  const density = P0 / (R * T);

  return density;
}

/**
 * Get current weather data for a location
 */
export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const cacheKey = `weather:${lat},${lon}`;

  return networkCache.withCache(
    cacheKey,
    async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(
          `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }

        const data: WeatherResponse = await response.json();
        const duration = Date.now() - startTime;

        // Record performance metrics
        performanceMonitor.recordMetric('weather_api_request', duration, {
          endpoint: 'current',
          status: response.status,
        });

        // Get altitude from geolocation
        const altitude = await getAltitude(lat, lon);

        return {
          temperature: data.main.temp,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
          windDirection: data.wind.deg,
          altitude,
          airDensity: calculateAirDensity(
            data.main.temp,
            data.main.pressure,
            altitude
          ),
        };
      } catch (error) {
        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric('weather_api_error', duration, {
          endpoint: 'current',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      }
    },
    WEATHER_CACHE_TTL
  );
}

/**
 * Get altitude data for a location
 */
async function getAltitude(lat: number, lon: number): Promise<number> {
  const cacheKey = `altitude:${lat},${lon}`;

  return networkCache.withCache(
    cacheKey,
    async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(
          `https://api.opentopodata.org/v1/srtm30m?locations=${lat},${lon}`
        );

        if (!response.ok) {
          throw new Error(`Altitude API error: ${response.statusText}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;

        performanceMonitor.recordMetric('altitude_api_request', duration, {
          status: response.status,
        });

        return data.results[0].elevation;
      } catch (error) {
        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric('altitude_api_error', duration, {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        // Return a default altitude if API fails
        return 0;
      }
    },
    24 * 60 * 60 * 1000 // Cache altitude for 24 hours
  );
}

/**
 * Get weather forecast for a location
 */
export async function getWeatherForecast(
  lat: number,
  lon: number,
  days: number = 5
): Promise<WeatherData[]> {
  const cacheKey = `forecast:${lat},${lon}:${days}`;

  return networkCache.withCache(
    cacheKey,
    async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(
          `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=${days * 8}`
        );

        if (!response.ok) {
          throw new Error(`Forecast API error: ${response.statusText}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;

        performanceMonitor.recordMetric('weather_api_request', duration, {
          endpoint: 'forecast',
          status: response.status,
        });

        // Get altitude once for the location
        const altitude = await getAltitude(lat, lon);

        return data.list.map((item: WeatherResponse) => ({
          temperature: item.main.temp,
          humidity: item.main.humidity,
          pressure: item.main.pressure,
          windSpeed: item.wind.speed,
          windDirection: item.wind.deg,
          altitude,
          airDensity: calculateAirDensity(
            item.main.temp,
            item.main.pressure,
            altitude
          ),
        }));
      } catch (error) {
        const duration = Date.now() - startTime;
        performanceMonitor.recordMetric('weather_api_error', duration, {
          endpoint: 'forecast',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      }
    },
    FORECAST_CACHE_TTL
  );
}

/**
 * Clear weather cache
 */
export async function clearWeatherCache(): Promise<void> {
  await networkCache.clear();
  performanceMonitor.recordMetric('weather_cache_clear', 1);
}
