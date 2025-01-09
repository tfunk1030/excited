import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimatedUpdate = () => {
  const animation = useRef(new Animated.Value(0)).current;

  const animate = useCallback(() => {
    animation.setValue(0);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  return {
    animate,
    style: {
      opacity: animation,
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.95, 1],
          }),
        },
      ],
    },
  };
};
