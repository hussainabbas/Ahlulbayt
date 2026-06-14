import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { enableFreeze, enableScreens } from 'react-native-screens';

import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';

enableScreens(true);
enableFreeze(true);

// TrackPlayer service registration is deferred to setupTrackPlayer() — v4 is incompatible
// with RN New Architecture TurboModule interop at import time.

AppRegistry.registerComponent(appName, () => App);
