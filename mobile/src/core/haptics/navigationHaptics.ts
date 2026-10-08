import { Platform, Vibration } from 'react-native';

/** Light selection feedback when switching primary tabs. */
export function hapticTabSelection(): void {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(1);
    return;
  }
  Vibration.vibrate(8);
}
