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

export function resetRootRoute(screen: keyof RootStackParamList): void {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({ index: 0, routes: [{ name: screen }] });
}
