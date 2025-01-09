import React, { ReactNode } from 'react';
import { LongPressGestureHandler, LongPressGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Vibration } from 'react-native';

interface LongPressHandlerProps {
  children: ReactNode;
  onLongPress: () => void;
  enabled?: boolean;
  minDuration?: number;
}

export const LongPressHandler: React.FC<LongPressHandlerProps> = ({
  children,
  onLongPress,
  enabled = true,
  minDuration = 500,
}) => {
  const scale = useSharedValue(1);

  const handleLongPress = () => {
    Vibration.vibrate(50); // Light haptic feedback
    onLongPress();
  };

  const gestureHandler = useAnimatedGestureHandler<LongPressGestureHandlerGestureEvent>({
    onStart: () => {
      scale.value = withSpring(0.95);
    },
    onActive: () => {
      runOnJS(handleLongPress)();
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
    onFail: () => {
      scale.value = withSpring(1);
    },
    onCancel: () => {
      scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <LongPressGestureHandler
      onGestureEvent={gestureHandler}
      minDurationMs={minDuration}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </LongPressGestureHandler>
  );
};
