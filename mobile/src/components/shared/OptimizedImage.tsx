import React, { useEffect, useState, memo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import {
  getImageProps,
  getImageDimensions,
  calculateScaledDimensions,
  ImageLoaderOptions,
} from '../../utils/imageLoader';
import { theme } from '../../styles/theme';

interface OptimizedImageProps {
  source: string;
  maxWidth?: number;
  maxHeight?: number;
  style?: any;
  options?: ImageLoaderOptions;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  source,
  maxWidth,
  maxHeight,
  style,
  options = {},
  onLoad,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = (err: Error) => {
    setError(err);
    setLoading(false);
    onError?.(err);
  };

  if (error) {
    return (
      <View style={[styles.errorContainer, style]}>
        <Image
          source={require('../../assets/images/image-error.png')}
          style={styles.errorIcon}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={style}
        placeholder={options.placeholder}
        contentFit="cover"
        transition={200}
        onLoad={handleLoad}
        onError={handleError}
      />
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingContainer: {
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  errorIcon: {
    width: '50%',
    height: '50%',
  },
});

OptimizedImage.displayName = 'OptimizedImage';
