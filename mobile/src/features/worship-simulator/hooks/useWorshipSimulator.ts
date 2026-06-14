import { useCallback, useEffect, useState } from 'react';

import { worshipAnimationMachine } from '../engine/animationStateMachine';
import { worshipAudioSync } from '../engine/audioSyncEngine';
import { preloadAssetKeys } from '../engine/assetRegistry';
import type { SimulatorCapableStep, WorshipPose } from '../types';

export function useWorshipSimulator(steps: SimulatorCapableStep[]) {
  const [pose, setPose] = useState<WorshipPose>('standing_neutral');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [subtitle, setSubtitle] = useState<string | null>(null);

  useEffect(() => {
    return worshipAnimationMachine.subscribe((nextPose, transitioning) => {
      setPose(nextPose);
      setIsTransitioning(transitioning);
    });
  }, []);

  const goToStep = useCallback(
    async (index: number) => {
      const step = steps[index];
      if (!step) return;

      const keys = preloadAssetKeys([
        step.animationAssetKey,
        steps[index + 1]?.animationAssetKey,
      ]);
      await Promise.all(keys.map((k) => worshipAudioSync.preload(k)));

      await worshipAnimationMachine.transitionToStep(step);
      setSubtitle(null);
    },
    [steps],
  );

  const reset = useCallback(() => {
    worshipAnimationMachine.reset();
    worshipAudioSync.stop();
  }, []);

  return { pose, isTransitioning, subtitle, goToStep, reset };
}
