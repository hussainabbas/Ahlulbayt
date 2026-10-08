import type { SalahPose, WorshipPose } from '../types';

/** Default transition duration per pose change (ms). */
export const POSE_TRANSITION_MS: Record<string, number> = {
  default: 500,
  qunoot_hands_raised: 700,
  sujud: 450,
  jalsa: 350,
  completion_dhikr: 600,
};

/** Maps prayer-academy step kinds to default simulator poses. */
export const STEP_KIND_TO_POSE: Record<string, SalahPose> = {
  niyyah: 'standing_neutral',
  takbir: 'takbir',
  qiyam: 'standing_qiyam',
  recitation: 'standing_qiyam',
  qunoot: 'qunoot_hands_raised',
  ruku: 'ruku',
  sujud: 'sujud',
  jalsa: 'jalsa',
  tashahhud: 'tashahhud_sitting',
  completion: 'completion_dhikr',
  tasbihat: 'standing_qiyam',
};

export const QUNOOT_DEFAULT_PAUSE_MS = 4000;

export function resolvePose(step: {
  kind?: string;
  animationPose?: string;
  visualHint?: string;
}): WorshipPose {
  if (step.animationPose) return step.animationPose as WorshipPose;
  if (step.visualHint) {
    const map: Record<string, WorshipPose> = {
      wash_face: 'wash_face',
      wash_arm_right: 'wash_arm_right',
      wash_arm_left: 'wash_arm_left',
      masah_head: 'masah_head',
      masah_feet: 'masah_feet',
      ghusl_head: 'ghusl_head',
      ghusl_body: 'ghusl_right',
    };
    if (map[step.visualHint]) return map[step.visualHint]!;
  }
  if (step.kind && step.kind in STEP_KIND_TO_POSE) {
    return STEP_KIND_TO_POSE[step.kind]!;
  }
  return 'standing_neutral';
}

export function transitionDurationMs(pose: WorshipPose): number {
  return POSE_TRANSITION_MS[pose] ?? POSE_TRANSITION_MS.default!;
}
