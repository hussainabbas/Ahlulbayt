import { Platform } from 'react-native';
import CompassHeading from 'react-native-compass-heading';

import { logger } from '@/core/logging/logger';

import { normalizeAngle } from '../engine/qiblaCalculator';

type HeadingListener = (heading: number, accuracy: number) => void;

let active = false;
let listener: HeadingListener | null = null;
let unsubscribe: (() => void) | null = null;

const DEGREE_UPDATE_RATE = 2;

export function startCompass(onHeading: HeadingListener): () => void {
  listener = onHeading;

  if (active) {
    return stopCompass;
  }

  try {
    CompassHeading.start(DEGREE_UPDATE_RATE, ({ heading, accuracy }) => {
      listener?.(normalizeAngle(heading), accuracy ?? 0);
    });
    active = true;
  } catch (error) {
    logger.warn('Compass unavailable', {
      error: error instanceof Error ? error.message : String(error),
    });
    listener?.(0, -1);
  }

  unsubscribe = stopCompass;
  return stopCompass;
}

export function stopCompass(): void {
  if (active) {
    try {
      CompassHeading.stop();
    } catch {
      // ignore
    }
    active = false;
  }
  listener = null;
  unsubscribe = null;
}

export function mapAccuracy(raw: number): 'high' | 'medium' | 'low' | 'unavailable' {
  if (raw < 0) return 'unavailable';
  if (Platform.OS === 'ios') {
    if (raw <= 15) return 'high';
    if (raw <= 30) return 'medium';
    return 'low';
  }
  if (raw <= 20) return 'high';
  if (raw <= 45) return 'medium';
  return 'low';
}
