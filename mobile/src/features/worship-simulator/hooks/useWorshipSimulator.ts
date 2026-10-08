import { useCallback, useEffect, useState } from 'react';

import { useTheme } from '@/theme/ThemeContext';

import { worshipAnimationMachine } from '../engine/animationStateMachine';
import { preloadAssetKeys, preloadSimAssets } from '../engine/assetRegistry';
import type { SimAssetKey } from '../illustrations/catalog';
import type { SimulatorCapableStep, WorshipPose } from '../types';

export function useWorshipSimulator(steps: SimulatorCapableStep[]) {
  const { theme } = useTheme();
  const [pose, setPose] = useState<WorshipPose>('standing_neutral');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationAssetKey, setAnimationAssetKey] = useState<string | undefined>();
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

      setAnimationAssetKey(step.animationAssetKey);

      const keys = preloadAssetKeys([
        step.animationAssetKey,
        steps[index + 1]?.animationAssetKey,
      ]);
      const simTheme = theme.isDark ? 'dark' : 'light';
      await preloadSimAssets(keys as SimAssetKey[], simTheme);

      await worshipAnimationMachine.transitionToStep(step);
      setSubtitle(null);
    },
    [steps, theme.isDark],
  );

  const reset = useCallback(() => {
    worshipAnimationMachine.reset();
    setAnimationAssetKey(undefined);
  }, []);

  return { pose, isTransitioning, animationAssetKey, subtitle, goToStep, reset };
}
