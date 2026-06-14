/** Offline asset keys → bundle paths. Lottie/Rive files added in phase 2. */
const SALAH_ASSETS: Record<string, { placeholder: true }> = {
  'sim/salah/takbir': { placeholder: true },
  'sim/salah/qiyam': { placeholder: true },
  'sim/salah/qunoot': { placeholder: true },
  'sim/salah/ruku': { placeholder: true },
  'sim/salah/sujud': { placeholder: true },
  'sim/salah/jalsa': { placeholder: true },
  'sim/salah/tashahhud': { placeholder: true },
  'sim/salah/completion': { placeholder: true },
};

const WUDU_ASSETS: Record<string, { placeholder: true }> = {
  'sim/wudu/hands': { placeholder: true },
  'sim/wudu/face': { placeholder: true },
  'sim/wudu/arm': { placeholder: true },
  'sim/wudu/masah_head': { placeholder: true },
  'sim/wudu/masah_feet': { placeholder: true },
};

export function isAssetRegistered(key: string): boolean {
  return key in SALAH_ASSETS || key in WUDU_ASSETS;
}

export function preloadAssetKeys(keys: (string | undefined)[]): string[] {
  return keys.filter((k): k is string => Boolean(k && isAssetRegistered(k)));
}
