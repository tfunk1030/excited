import React, { useCallback, memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { VirtualizedList } from 'react-native';
import { theme } from '../../styles/theme';
import { Club } from '../../services/profileService';

interface DraggableClubListProps {
  clubs: Array<{
    club: Club;
    distance: number;
  }>;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

interface DraggableItemProps {
  club: Club;
  distance: number;
  index: number;
  itemHeight: number;
  activeIndex: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  onDragEnd: (index: number) => void;
}

const ITEM_HEIGHT = 60;

const DraggableItem = memo<DraggableItemProps>(({
  club,
  distance,
  index,
  itemHeight,
  activeIndex,
  y,
  onDragEnd,
}) => {
  const isActive = useSharedValue(false);
  const offsetY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      isActive.value = true;
      activeIndex.value = index;
      offsetY.value = y.value;
    },
    onActive: (event) => {
      const newY = offsetY.value + event.translationY;
      y.value = newY;
      
      // Calculate new index based on position
      const newIndex = Math.round(newY / itemHeight);
      if (newIndex !== activeIndex.value) {
        activeIndex.value = newIndex;
      }
    },
    onEnd: () => {
      isActive.value = false;
      runOnJS(onDragEnd)(Math.round(y.value / itemHeight));
      y.value = withSpring(index * itemHeight);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isActive.value ? 1 : 0;
    const scale = withSpring(isActive.value ? 1.05 : 1);
    const translateY = y.value;

    return {
      zIndex,
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club}</Text>
          <Text style={styles.distance}>{distance}y</Text>
        </View>
        <View style={styles.dragHandle} />
      </Animated.View>
    </PanGestureHandler>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.club === nextProps.club &&
    prevProps.distance === nextProps.distance &&
    prevProps.index === nextProps.index &&
    prevProps.itemHeight === nextProps.itemHeight
  );
});

const getItem = (data: Array<{ club: Club; distance: number }>, index: number) => ({
  ...data[index],
  index,
});

const getItemCount = (data: Array<{ club: Club; distance: number }>) => data.length;

const keyExtractor = (item: { club: Club; distance: number; index: number }) => 
  `${item.club}-${item.index}`;

export const DraggableClubList = memo<DraggableClubListProps>(({
  clubs,
  onReorder,
}) => {
  const activeIndex = useSharedValue(-1);
  const y = useSharedValue(0);

  const handleDragEnd = useCallback((toIndex: number) => {
    const fromIndex = activeIndex.value;
    if (fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0) {
      onReorder(fromIndex, toIndex);
    }
    activeIndex.value = -1;
  }, [activeIndex, onReorder]);

  const renderItem = useCallback(({ item }: { item: ReturnType<typeof getItem> }) => (
    <DraggableItem
      {...item}
      itemHeight={ITEM_HEIGHT}
      activeIndex={activeIndex}
      y={y}
      onDragEnd={handleDragEnd}
    />
  ), [activeIndex, y, handleDragEnd]);

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={clubs}
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
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  if (prevProps.clubs.length !== nextProps.clubs.length) {
    return false;
  }
  return prevProps.clubs.every((club, index) => {
    const nextClub = nextProps.clubs[index];
    return (
      club.club === nextClub.club &&
      club.distance === nextClub.distance
    );
  });
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  item: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubName: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
  },
  distance: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  dragHandle: {
    width: 20,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
});

DraggableItem.displayName = 'DraggableItem';
DraggableClubList.displayName = 'DraggableClubList';
