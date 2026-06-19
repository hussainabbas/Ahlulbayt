import { createNavigationContainerRef } from '@react-navigation/native';

import type { MainTabParamList, RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const MAIN_TAB_SCREENS = new Set<string>(['Home', 'Prayer', 'Quran', 'AiAssistant', 'Profile']);

type NotificationTarget =
  | {
      type: 'tab';
      screen: keyof MainTabParamList;
      params?: MainTabParamList[keyof MainTabParamList];
    }
  | {
      type: 'root';
      screen: keyof RootStackParamList;
      params?: RootStackParamList[keyof RootStackParamList];
    };

let pendingTarget: NotificationTarget | null = null;

function isMainTabScreen(route: string): route is keyof MainTabParamList {
  return MAIN_TAB_SCREENS.has(route);
}

function performNavigation(target: NotificationTarget): void {
  if (target.type === 'tab') {
    navigationRef.navigate('Main', {
      screen: target.screen,
      params: target.params,
    });
    return;
  }

  navigationRef.navigate(target.screen as never, target.params as never);
}

export function navigateFromNotification(
  screen: keyof RootStackParamList | keyof MainTabParamList,
  params?: RootStackParamList[keyof RootStackParamList] | MainTabParamList[keyof MainTabParamList],
): void {
  const target: NotificationTarget = isMainTabScreen(screen)
    ? {
        type: 'tab',
        screen,
        params: params as MainTabParamList[keyof MainTabParamList] | undefined,
      }
    : {
        type: 'root',
        screen: screen as keyof RootStackParamList,
        params: params as RootStackParamList[keyof RootStackParamList] | undefined,
      };

  if (!navigationRef.isReady()) {
    pendingTarget = target;
    return;
  }

  pendingTarget = null;
  performNavigation(target);
}

/** Call from NavigationContainer onReady to complete deferred notification taps. */
export function flushPendingNotificationNavigation(): void {
  if (!pendingTarget || !navigationRef.isReady()) return;
  const target = pendingTarget;
  pendingTarget = null;
  performNavigation(target);
}

export function resetRootRoute(screen: keyof RootStackParamList): void {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({ index: 0, routes: [{ name: screen }] });
}
