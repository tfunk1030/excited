import { getCurrentWeather, getWeatherForecast, clearWeatherCache } from '../weatherAPI';
import { networkCache } from '../../utils/networkCache';
import { performanceMonitor } from '../../utils/performanceMonitor';

// Mock dependencies
jest.mock('../../utils/networkCache');
jest.mock('../../utils/performanceMonitor');

describe('Weather API', () => {
  const mockWeatherResponse = {
    main: {
      temp: 20,
      humidity: 65,
      pressure: 1013,
    },
    wind: {
      speed: 5,
      deg: 180,
    },
  };

  const mockAltitudeResponse = {
    results: [{ elevation: 100 }],
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  describe('getCurrentWeather', () => {
    it('should fetch and cache weather data', async () => {
      // Mock fetch responses
      (global.fetch as jest.Mock)
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockWeatherResponse),
            status: 200,
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAltitudeResponse),
            status: 200,
          })
        );

      // Mock cache miss then cache
      (networkCache.withCache as jest.Mock).mockImplementation(
        async (key, request) => request()
      );

      const result = await getCurrentWeather(40.7128, -74.006);

      // Verify result structure
      expect(result).toEqual({
        temperature: 20,
        humidity: 65,
        pressure: 1013,
        windSpeed: 5,
        windDirection: 180,
        altitude: 100,
        airDensity: expect.any(Number),
      });

      // Verify cache key format
      expect(networkCache.withCache).toHaveBeenCalledWith(
        'weather:40.7128,-74.006',
        expect.any(Function),
        expect.any(Number)
      );

      // Verify performance monitoring
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'weather_api_request',
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found',
          status: 404,
        })
      );

      await expect(getCurrentWeather(40.7128, -74.006)).rejects.toThrow(
        'Weather API error: Not Found'
      );

      // Verify error metrics were recorded
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'weather_api_error',
        expect.any(Number),
        expect.any(Object)
      );
    });

    it('should return cached data when available', async () => {
      const cachedData = {
        temperature: 25,
        humidity: 70,
        pressure: 1015,
        windSpeed: 3,
        windDirection: 90,
        altitude: 50,
        airDensity: 1.2,
      };

      // Mock cache hit
      (networkCache.withCache as jest.Mock).mockResolvedValue(cachedData);

      const result = await getCurrentWeather(40.7128, -74.006);

      // Verify cached data is returned
      expect(result).toEqual(cachedData);

      // Verify fetch was not called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('getWeatherForecast', () => {
    const mockForecastResponse = {
      list: [mockWeatherResponse, mockWeatherResponse],
    };

    it('should fetch and cache forecast data', async () => {
      // Mock fetch responses
      (global.fetch as jest.Mock)
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockForecastResponse),
            status: 200,
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAltitudeResponse),
            status: 200,
          })
        );

      // Mock cache miss then cache
      (networkCache.withCache as jest.Mock).mockImplementation(
        async (key, request) => request()
      );

      const result = await getWeatherForecast(40.7128, -74.006, 2);

      // Verify result structure
      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(item).toEqual({
          temperature: 20,
          humidity: 65,
          pressure: 1013,
          windSpeed: 5,
          windDirection: 180,
          altitude: 100,
          airDensity: expect.any(Number),
        });
      });

      // Verify cache key format
      expect(networkCache.withCache).toHaveBeenCalledWith(
        'forecast:40.7128,-74.006:2',
        expect.any(Function),
        expect.any(Number)
      );
    });

    it('should handle forecast API errors', async () => {
      // Mock API error
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Server Error',
          status: 500,
        })
      );

      await expect(getWeatherForecast(40.7128, -74.006, 2)).rejects.toThrow(
        'Forecast API error: Server Error'
      );

      // Verify error metrics were recorded
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'weather_api_error',
        expect.any(Number),
        expect.any(Object)
      );
    });
  });

  describe('clearWeatherCache', () => {
    it('should clear cache and record metric', async () => {
      await clearWeatherCache();

      // Verify cache was cleared
      expect(networkCache.clear).toHaveBeenCalled();

      // Verify metric was recorded
      expect(performanceMonitor.recordMetric).toHaveBeenCalledWith(
        'weather_cache_clear',
        1
      );
    });
  });
});
