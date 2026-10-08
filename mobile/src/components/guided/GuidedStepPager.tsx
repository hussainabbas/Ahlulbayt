import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

interface GuidedStepPagerProps<T> {
  steps: T[];
  stepIndex: number;
  enabled: boolean;
  canSwipeForward: boolean;
  onStepIndexChange: (index: number) => void;
  keyExtractor: (item: T, index: number) => string;
  renderStep: (item: T, index: number) => ReactNode;
}

export function GuidedStepPager<T>({
  steps,
  stepIndex,
  enabled,
  canSwipeForward,
  onStepIndexChange,
  keyExtractor,
  renderStep,
}: GuidedStepPagerProps<T>) {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<T>>(null);
  const pageWidth = width;

  useEffect(() => {
    if (!enabled) return;
    listRef.current?.scrollToIndex({ index: stepIndex, animated: true });
  }, [stepIndex, enabled]);

  const getItemLayout = useCallback(
    (_: ArrayLike<T> | null | undefined, index: number) => ({
      length: pageWidth,
      offset: pageWidth * index,
      index,
    }),
    [pageWidth],
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const rawIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      const nextIndex = Math.min(Math.max(rawIndex, 0), steps.length - 1);

      if (nextIndex > stepIndex && !canSwipeForward) {
        listRef.current?.scrollToIndex({ index: stepIndex, animated: true });
        return;
      }

      if (nextIndex !== stepIndex) {
        onStepIndexChange(nextIndex);
      }
    },
    [canSwipeForward, onStepIndexChange, pageWidth, stepIndex, steps.length],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => (
      <View style={[styles.page, { width: pageWidth }]}>
        {renderStep(item, index)}
      </View>
    ),
    [pageWidth, renderStep],
  );

  if (!enabled || steps.length === 0) {
    return null;
  }

  return (
    <FlatList
      ref={listRef}
      data={steps}
      horizontal
      pagingEnabled
      bounces={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialScrollIndex={stepIndex}
      onMomentumScrollEnd={onMomentumScrollEnd}
      scrollEventThrottle={16}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      onScrollToIndexFailed={(info) => {
        listRef.current?.scrollToOffset({
          offset: info.averageItemLength * info.index,
          animated: false,
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
  },
});
