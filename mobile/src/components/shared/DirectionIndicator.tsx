import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../../styles/theme';

interface DirectionIndicatorProps {
  angle: number;
  size?: number;
  color?: string;
}

export const DirectionIndicator = memo<DirectionIndicatorProps>(({
  angle,
  size = 24,
  color = theme.colors.primary,
}) => {
  const arrowStyle = useMemo(() => ({
    width: 0,
    height: 0,
    borderLeftWidth: size / 2,
    borderRightWidth: size / 2,
    borderBottomWidth: size,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
  }), [size, color]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = withSpring(angle, {
      damping: 15,
      stiffness: 150,
    });

    return {
      transform: [
        { rotate: `${rotation}deg` },
      ],
    };
  }, [angle]);

  const containerStyle = useMemo(() => ({
    width: size,
    height: size,
  }), [size]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.arrow, arrowStyle, animatedStyle]} />
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.angle === nextProps.angle &&
    prevProps.size === nextProps.size &&
    prevProps.color === nextProps.color
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
  },
});

DirectionIndicator.displayName = 'DirectionIndicator';
