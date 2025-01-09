import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from './weatherService';

const CACHE_KEYS = {
  WEATHER: 'weather_data',
  ELEVATION: 'elevation_data',
};

const CACHE_DURATION = {
  WEATHER: 15 * 60 * 1000, // 15 minutes
  ELEVATION: 24 * 60 * 60 * 1000, // 24 hours
};

const DISTANCE_THRESHOLD = 0.5; // 0.5 km

interface Location {
  latitude: number;
  longitude: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  location: Location;
}

const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const isCacheValid = <T>(
  cache: CacheEntry<T> | null,
  location: Location,
  duration: number
): boolean => {
  if (!cache) return false;

  const now = Date.now();
  const age = now - cache.timestamp;
  const distance = calculateDistance(cache.location, location);

  return age < duration && distance < DISTANCE_THRESHOLD;
};

export const getCachedWeatherData = async (
  location: Location
): Promise<WeatherData | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.WEATHER);
    if (!cached) return null;

    const cacheEntry: CacheEntry<WeatherData> = JSON.parse(cached);
    if (!isCacheValid(cacheEntry, location, CACHE_DURATION.WEATHER)) {
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('Error reading weather cache:', error);
    return null;
  }
};

export const setCachedWeatherData = async (
  location: Location,
  data: WeatherData
): Promise<void> => {
  try {
    const cacheEntry: CacheEntry<WeatherData> = {
      data,
      timestamp: Date.now(),
      location,
    };
    await AsyncStorage.setItem(CACHE_KEYS.WEATHER, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error writing weather cache:', error);
  }
};

export const getCachedElevationData = async (
  location: Location
): Promise<number | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.ELEVATION);
    if (!cached) return null;

    const cacheEntry: CacheEntry<number> = JSON.parse(cached);
    if (!isCacheValid(cacheEntry, location, CACHE_DURATION.ELEVATION)) {
      return null;
    }

    return cacheEntry.data;
  } catch (error) {
    console.error('Error reading elevation cache:', error);
    return null;
  }
};

export const setCachedElevationData = async (
  location: Location,
  elevation: number
): Promise<void> => {
  try {
    const cacheEntry: CacheEntry<number> = {
      data: elevation,
      timestamp: Date.now(),
      location,
    };
    await AsyncStorage.setItem(CACHE_KEYS.ELEVATION, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error writing elevation cache:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([CACHE_KEYS.WEATHER, CACHE_KEYS.ELEVATION]);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
