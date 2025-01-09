import React, { ReactNode } from 'react';
import { TapGestureHandler, TapGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Vibration } from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface DoubleTapHandlerProps {
  children: ReactNode;
  onDoubleTap: () => void;
  enabled?: boolean;
}

type GestureContext = {
  startTime: number;
};

export const DoubleTapHandler: React.FC<DoubleTapHandlerProps> = ({
  children,
  onDoubleTap,
  enabled = true,
}) => {
  const lastTap = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleDoubleTap = () => {
    Vibration.vibrate(50); // Light haptic feedback
    onDoubleTap();
  };

  const tapGestureHandler = useAnimatedGestureHandler<TapGestureHandlerGestureEvent, GestureContext>({
    onStart: (_, context) => {
      scale.value = withSpring(0.95);
      context.startTime = Date.now();
    },
    onActive: (_, context) => {
      const now = Date.now();
      if (now - lastTap.value < 300) {
        runOnJS(handleDoubleTap)();
        lastTap.value = 0;
      } else {
        lastTap.value = context.startTime;
      }
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

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <TapGestureHandler
      onGestureEvent={tapGestureHandler}
      numberOfTaps={2}
      maxDelayMs={300}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
};
