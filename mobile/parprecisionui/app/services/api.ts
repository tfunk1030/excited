import type { WeatherData, ApiResponse } from '@/types';

const API_BASE_URL = process.env.APP_API_URL || 'https://api.parprecisionui.com';

export async function fetchWeatherData(latitude: number, longitude: number): Promise<ApiResponse<WeatherData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch weather data');
    }

    return {
      success: true,
      data: {
        temperature: data.temperature,
        feelsLike: data.feels_like,
        humidity: data.humidity,
        pressure: data.pressure,
        altitude: data.altitude,
        airDensity: data.air_density,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function calculateShotAdjustments(
  targetDistance: number,
  weatherData: WeatherData
): Promise<ApiResponse<{
  adjustedDistance: number;
  adjustments: Array<{
    type: string;
    value: number;
    effect: number;
  }>;
}>> {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        targetDistance,
        weatherData,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to calculate shot adjustments');
    }

    return {
      success: true,
      data: {
        adjustedDistance: data.adjustedDistance,
        adjustments: data.adjustments,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function getClubRecommendation(
  distance: number
): Promise<ApiResponse<{ club: string; confidence: number }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend-club?distance=${distance}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get club recommendation');
    }

    return {
      success: true,
      data: {
        club: data.club,
        confidence: data.confidence,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}