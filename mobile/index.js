import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { enableFreeze, enableScreens } from 'react-native-screens';

import notifee from '@notifee/react-native';
import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';
import { handleBackgroundNotificationEvent } from './src/features/notifications/platform/notificationRouter';

enableScreens(true);
enableFreeze(true);

notifee.onBackgroundEvent(async (event) => {
  await handleBackgroundNotificationEvent(event);
});

// TrackPlayer service registration is deferred to setupTrackPlayer() — v4 is incompatible
// with RN New Architecture TurboModule interop at import time.

AppRegistry.registerComponent(appName, () => App);
