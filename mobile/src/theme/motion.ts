import { Easing } from 'react-native-reanimated';

export const duration = {
  instant: 80,
  fast: 120,
  normal: 200,
  slow: 320,
  slower: 480,
  ambient: 1200,
  stream: 80,
} as const;

export const easing = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.45, 0, 0.55, 1),
  solemn: Easing.bezier(0.4, 0, 0.2, 1),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1),
  linear: Easing.linear,
} as const;

export type MotionDuration = keyof typeof duration;
export type MotionEasing = keyof typeof easing;
