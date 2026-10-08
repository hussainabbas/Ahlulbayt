import { Vibration } from 'react-native';

import type {
  GuideLearningMode,
  WorshipGuideId,
  WorshipGuideLastSession,
  WorshipGuideStep,
} from '../types';
import { WorshipGuideRepository } from './worshipGuideRepository';
import { useWorshipGuideReaderStore } from '../stores/readerStore';
import { useWorshipGuideProgressStore } from '../stores/progressStore';

export class StepProgressionEngine {
  static getSteps(guideId: WorshipGuideId, mode: GuideLearningMode): WorshipGuideStep[] {
    return WorshipGuideRepository.getSteps(guideId, mode);
  }

  static resolveStepIndex(guideId: WorshipGuideId, mode: GuideLearningMode, stepId?: string): number {
    const steps = this.getSteps(guideId, mode);
    if (!stepId) return 0;
    const index = steps.findIndex((s) => s.id === stepId);
    return index >= 0 ? index : 0;
  }

  static async onStepComplete(guideId: WorshipGuideId, step: WorshipGuideStep, mode: GuideLearningMode, guided: boolean) {
    const { setStepProgress, setLastSession } = useWorshipGuideProgressStore.getState();
    setStepProgress(guideId, step.id, mode, guided);
    const steps = this.getSteps(guideId, mode);
    const index = steps.findIndex((s) => s.id === step.id);
    setLastSession({
      guideId,
      stepId: step.id,
      stepIndex: index,
      mode,
      updatedAt: new Date().toISOString(),
    });
    if (useWorshipGuideReaderStore.getState().hapticsEnabled) {
      try {
        Vibration.vibrate(10);
      } catch {
        // unavailable
      }
    }
    const next = steps[index + 1];
    if (next?.audioAssetKey) {
      void this.preloadStepAudio(next);
    }
  }

  static async preloadStepAudio(step: WorshipGuideStep): Promise<void> {
    if (!step.audioAssetKey && !step.audioUrl) return;
    // Phase 2: RNFS cache to DocumentDirectory/worship-audio/
  }

  static getGlobalLastSession(): WorshipGuideLastSession | undefined {
    return useWorshipGuideProgressStore.getState().lastSession ?? undefined;
  }
}
