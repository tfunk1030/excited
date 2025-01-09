import React, { memo, useCallback } from 'react';
import { StyleSheet, View, Text, VirtualizedList } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { theme } from '../../styles/theme';

interface SwipeableClubAlternativesProps {
  alternatives: Array<{
    club: string;
    distance: number;
    reason?: string;
  }>;
  onSelectAlternative: (alternative: { club: string; distance: number }) => void;
}

interface SwipeableItemProps {
  club: string;
  distance: number;
  reason?: string;
  onSelect: () => void;
}

const SWIPE_THRESHOLD = 100;
const ITEM_HEIGHT = 80;

const SwipeableItem = memo<SwipeableItemProps>(({
  club,
  distance,
  reason,
  onSelect,
}) => {
  const translateX = useSharedValue(0);
  const isSwipingRight = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      isSwipingRight.value = false;
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      if (event.translationX > 0) {
        isSwipingRight.value = true;
      }
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD && isSwipingRight.value) {
        runOnJS(onSelect)();
      }
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.alternativeItem, animatedStyle]}>
        <View style={styles.alternativeContent}>
          <View style={styles.alternativeHeader}>
            <Text style={styles.clubName}>{club}</Text>
            <Text style={styles.distance}>{distance}y</Text>
          </View>
          {reason && (
            <Text style={styles.reason}>{reason}</Text>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.club === nextProps.club &&
    prevProps.distance === nextProps.distance &&
    prevProps.reason === nextProps.reason
  );
});

const getItem = (data: SwipeableClubAlternativesProps['alternatives'], index: number) => ({
  ...data[index],
  index,
});

const getItemCount = (data: SwipeableClubAlternativesProps['alternatives']) => data.length;

const keyExtractor = (item: ReturnType<typeof getItem>) => 
  `${item.club}-${item.index}`;

export const SwipeableClubAlternatives = memo<SwipeableClubAlternativesProps>(({
  alternatives,
  onSelectAlternative,
}) => {
  const renderItem = useCallback(({ item }: { item: ReturnType<typeof getItem> }) => (
    <SwipeableItem
      club={item.club}
      distance={item.distance}
      reason={item.reason}
      onSelect={() => onSelectAlternative(item)}
    />
  ), [onSelectAlternative]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alternatives</Text>
      <Text style={styles.hint}>Swipe right to select</Text>
      <VirtualizedList
        data={alternatives}
        renderItem={renderItem}
        getItem={getItem}
        getItemCount={getItemCount}
        keyExtractor={keyExtractor}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={3}
        initialNumToRender={4}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  if (prevProps.alternatives.length !== nextProps.alternatives.length) {
    return false;
  }
  return prevProps.alternatives.every((alt, index) => {
    const nextAlt = nextProps.alternatives[index];
    return (
      alt.club === nextAlt.club &&
      alt.distance === nextAlt.distance &&
      alt.reason === nextAlt.reason
    );
  });
});

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  alternativeItem: {
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alternativeContent: {
    padding: theme.spacing.md,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  clubName: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600' as const,
  },
  distance: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  reason: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
});

SwipeableItem.displayName = 'SwipeableItem';
SwipeableClubAlternatives.displayName = 'SwipeableClubAlternatives';
