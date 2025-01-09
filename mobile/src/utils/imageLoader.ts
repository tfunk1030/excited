import { Image } from 'react-native';
import { Platform } from 'react-native';
import FastImage from 'react-native-fast-image';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageLoaderOptions {
  priority?: 'low' | 'normal' | 'high';
  cache?: 'immutable' | 'web' | 'cacheOnly';
  dimensions?: ImageDimensions;
  placeholder?: string;
}

const DEFAULT_OPTIONS: ImageLoaderOptions = {
  priority: 'normal',
  cache: 'immutable',
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const IMAGE_CACHE = new Map<string, { timestamp: number; dimensions?: ImageDimensions }>();

/**
 * Preload an array of images into the cache
 */
export const preloadImages = async (
  urls: string[],
  options: ImageLoaderOptions = DEFAULT_OPTIONS
): Promise<void> => {
  if (Platform.OS === 'web') {
    await Promise.all(
      urls.map(url => Image.prefetch(url))
    );
  } else {
    FastImage.preload(
      urls.map(uri => ({
        uri,
        priority: FastImage.priority[options.priority || 'normal'],
        cache: FastImage.cacheControl[options.cache || 'immutable'],
      }))
    );
  }
};

/**
 * Get image dimensions while respecting cache
 */
export const getImageDimensions = async (
  url: string
): Promise<ImageDimensions> => {
  const cached = IMAGE_CACHE.get(url);
  if (cached?.dimensions) {
    if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.dimensions;
    }
    IMAGE_CACHE.delete(url);
  }

  return new Promise((resolve, reject) => {
    Image.getSize(
      url,
      (width, height) => {
        const dimensions = { width, height };
        IMAGE_CACHE.set(url, {
          timestamp: Date.now(),
          dimensions,
        });
        resolve(dimensions);
      },
      reject
    );
  });
};

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 */
export const calculateScaledDimensions = (
  originalDimensions: ImageDimensions,
  maxWidth: number,
  maxHeight: number
): ImageDimensions => {
  const { width: originalWidth, height: originalHeight } = originalDimensions;
  
  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;
  const scale = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  };
};

/**
 * Clear expired items from the image cache
 */
export const cleanImageCache = (): void => {
  const now = Date.now();
  for (const [url, { timestamp }] of IMAGE_CACHE.entries()) {
    if (now - timestamp > CACHE_EXPIRY) {
      IMAGE_CACHE.delete(url);
    }
  }
};

/**
 * Get FastImage priority from options
 */
const getFastImagePriority = (
  priority: ImageLoaderOptions['priority']
): number => {
  switch (priority) {
    case 'low':
      return FastImage.priority.low;
    case 'high':
      return FastImage.priority.high;
    default:
      return FastImage.priority.normal;
  }
};

/**
 * Get FastImage cache control from options
 */
const getFastImageCacheControl = (
  cache: ImageLoaderOptions['cache']
): number => {
  switch (cache) {
    case 'web':
      return FastImage.cacheControl.web;
    case 'cacheOnly':
      return FastImage.cacheControl.cacheOnly;
    default:
      return FastImage.cacheControl.immutable;
  }
};

/**
 * Get optimized image props based on platform and options
 */
export const getImageProps = (
  url: string,
  options: ImageLoaderOptions = DEFAULT_OPTIONS
) => {
  if (Platform.OS === 'web') {
    return {
      source: { uri: url },
      ...(options.dimensions && {
        style: {
          width: options.dimensions.width,
          height: options.dimensions.height,
        },
      }),
    };
  }

  return {
    source: {
      uri: url,
      priority: getFastImagePriority(options.priority),
      cache: getFastImageCacheControl(options.cache),
    },
    ...(options.dimensions && {
      style: {
        width: options.dimensions.width,
        height: options.dimensions.height,
      },
    }),
  };
};

// Clean cache periodically
setInterval(cleanImageCache, CACHE_EXPIRY);
