import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateFromNotification(
  screen: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList],
): void {
  if (!navigationRef.isReady()) return;
  navigationRef.navigate(screen as never, params as never);
}
