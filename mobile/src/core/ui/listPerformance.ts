import type { FlatListProps } from 'react-native';

/** Shared FlatList tuning for 60 FPS scrolling on mid-range devices. */
export const FLAT_LIST_PERFORMANCE: Pick<
  FlatListProps<unknown>,
  'windowSize' | 'initialNumToRender' | 'maxToRenderPerBatch' | 'updateCellsBatchingPeriod' | 'removeClippedSubviews'
> = {
  windowSize: 7,
  initialNumToRender: 12,
  maxToRenderPerBatch: 8,
  updateCellsBatchingPeriod: 50,
  removeClippedSubviews: true,
};

export const SURAH_ROW_HEIGHT = 72;

export function surahRowLayout(_: unknown, index: number) {
  return {
    length: SURAH_ROW_HEIGHT,
    offset: SURAH_ROW_HEIGHT * index,
    index,
  };
}
