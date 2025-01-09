import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import WeatherCard from './WeatherCard';

interface ZoomableWeatherCardProps {
  icon: string;
  value: string;
  label: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 1.5;

export const ZoomableWeatherCard = memo<ZoomableWeatherCardProps>(({
  icon,
  value,
  label,
}) => {
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      scale.value = Math.min(Math.max(event.scale, MIN_SCALE), MAX_SCALE);
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <WeatherCard
          icon={icon}
          value={value}
          label={label}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.icon === nextProps.icon &&
    prevProps.value === nextProps.value &&
    prevProps.label === nextProps.label
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ZoomableWeatherCard.displayName = 'ZoomableWeatherCard';
