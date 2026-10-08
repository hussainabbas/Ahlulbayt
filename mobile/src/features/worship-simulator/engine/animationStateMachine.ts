import type { SimulatorCapableStep, WorshipPose } from '../types';
import { QUNOOT_DEFAULT_PAUSE_MS, resolvePose, transitionDurationMs } from '../constants/poses';

export class AnimationStateMachine {
  private pose: WorshipPose = 'standing_neutral';
  private listeners = new Set<(pose: WorshipPose, transitioning: boolean) => void>();

  getPose(): WorshipPose {
    return this.pose;
  }

  subscribe(listener: (pose: WorshipPose, transitioning: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(transitioning: boolean) {
    for (const listener of this.listeners) {
      listener(this.pose, transitioning);
    }
  }

  async transitionToStep(step: SimulatorCapableStep & { kind?: string }): Promise<void> {
    const nextPose = resolvePose(step);
    const duration = transitionDurationMs(nextPose);
    this.emit(true);

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        this.pose = nextPose;
        this.emit(false);
        resolve();
      }, duration);
    });

    if (nextPose === 'qunoot_hands_raised') {
      const hold = step.pauseDurationMs ?? QUNOOT_DEFAULT_PAUSE_MS;
      await new Promise<void>((r) => setTimeout(r, hold));
    }
  }

  reset(): void {
    this.pose = 'standing_neutral';
    this.emit(false);
  }
}

export const worshipAnimationMachine = new AnimationStateMachine();
