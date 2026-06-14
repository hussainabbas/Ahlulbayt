import { Platform, Vibration } from 'react-native';

let enabled = true;

export const tasbihHaptics = {
  setEnabled(value: boolean) {
    enabled = value;
  },

  isEnabled() {
    return enabled;
  },

  /** Single tap feedback */
  tap() {
    if (!enabled) return;
    if (Platform.OS === 'ios') {
      Vibration.vibrate(1);
    } else {
      Vibration.vibrate(12);
    }
  },

  /** Phase boundary reached */
  phaseComplete() {
    if (!enabled) return;
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 20, 40, 20]);
    } else {
      Vibration.vibrate([0, 30, 50, 30]);
    }
  },

  /** Full Fatima Zahra cycle complete */
  cycleComplete() {
    if (!enabled) return;
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 25, 50, 25, 50, 25, 50, 25]);
    } else {
      Vibration.vibrate([0, 40, 60, 40, 80, 40]);
    }
  },

  /** Daily goal achieved */
  goalReached() {
    if (!enabled) return;
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 30, 70, 30, 70, 30]);
    } else {
      Vibration.vibrate([0, 50, 80, 50, 100, 50]);
    }
  },
};
