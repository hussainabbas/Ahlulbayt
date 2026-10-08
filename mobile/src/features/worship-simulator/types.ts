/** Interactive Animated Worship Simulator — types & state machine contracts. */

export type SalahPose =
  | 'standing_neutral'
  | 'takbir'
  | 'standing_qiyam'
  | 'qunoot_hands_raised'
  | 'ruku'
  | 'sujud'
  | 'jalsa'
  | 'tashahhud_sitting'
  | 'completion_dhikr';

export type WuduPose =
  | 'wash_hands'
  | 'wash_face'
  | 'wash_arm_right'
  | 'wash_arm_left'
  | 'masah_head'
  | 'masah_feet';

export type GhuslPose =
  | 'ghusl_niyyah'
  | 'ghusl_head'
  | 'ghusl_right'
  | 'ghusl_left'
  | 'ghusl_immersion';

export type WorshipPose = SalahPose | WuduPose | GhuslPose;

export type BodyZone =
  | 'head'
  | 'face'
  | 'right_arm'
  | 'left_arm'
  | 'torso'
  | 'right_side'
  | 'left_side'
  | 'feet'
  | 'hands';

export interface PostureHint {
  id: string;
  correct: boolean;
  label: { en: string; ur: string; ar: string };
}

export interface AnimationTransition {
  from: WorshipPose;
  to: WorshipPose;
  durationMs: number;
  easing?: 'easeInOut' | 'linear';
}

export interface SimulatorStepMeta {
  pose: WorshipPose;
  animationAssetKey?: string;
  pauseDurationMs?: number;
  audioAssetKey?: string;
  highlightZones?: BodyZone[];
  postureHints?: PostureHint[];
}

export interface AudioSubtitleCue {
  startMs: number;
  endMs: number;
  text: string;
  locale: 'ar' | 'ur' | 'en';
}

export interface SimulatorAudioTrack {
  assetKey: string;
  durationMs: number;
  cues: AudioSubtitleCue[];
}

export interface SimulatorSessionState {
  pose: WorshipPose;
  isPaused: boolean;
  isTransitioning: boolean;
  activeSubtitle: string | null;
  qunootHoldRemainingMs: number | null;
}

export interface SimulatorCapableStep {
  animationPose?: string;
  animationAssetKey?: string;
  pauseDurationMs?: number;
  audioAssetKey?: string;
  visualHint?: string;
}
