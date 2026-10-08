import { Platform } from 'react-native';
import {
  initialWindowMetrics,
  useSafeAreaInsets,
  type EdgeInsets,
} from 'react-native-safe-area-context';

/** BootSplash / first frame can report zero insets; fall back to launch metrics. */
export function useEffectiveSafeInsets(): EdgeInsets {
  const insets = useSafeAreaInsets();
  const initial = initialWindowMetrics?.insets;

  if (!initial || Platform.OS !== 'ios') {
    return insets;
  }

  return {
    top: insets.top > 0 ? insets.top : initial.top,
    right: insets.right > 0 ? insets.right : initial.right,
    bottom: insets.bottom > 0 ? insets.bottom : initial.bottom,
    left: insets.left > 0 ? insets.left : initial.left,
  };
}
