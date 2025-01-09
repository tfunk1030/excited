import React, { useEffect, useState, memo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
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
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const loadDimensions = async () => {
      try {
        setLoading(true);
        const originalDimensions = await getImageDimensions(source);
        
        if (maxWidth || maxHeight) {
          const scaledDimensions = calculateScaledDimensions(
            originalDimensions,
            maxWidth || originalDimensions.width,
            maxHeight || originalDimensions.height
          );
          setDimensions(scaledDimensions);
        } else {
          setDimensions(originalDimensions);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load image');
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    loadDimensions();
  }, [source, maxWidth, maxHeight, onError]);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    const error = new Error('Failed to load image');
    setError(error);
    onError?.(error);
  };

  if (error) {
    return (
      <View style={[styles.errorContainer, style]}>
        <FastImage
          source={require('../../assets/images/image-error.png')}
          style={styles.errorIcon}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  }

  const imageProps = getImageProps(source, {
    ...options,
    dimensions,
  });

  return (
    <View style={[styles.container, style]}>
      <FastImage
        {...imageProps}
        onLoad={handleLoad}
        onError={handleError}
        resizeMode={FastImage.resizeMode.cover}
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
