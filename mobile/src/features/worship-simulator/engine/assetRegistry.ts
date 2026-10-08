import { SIM_ASSET_CATALOG, type SimAssetKey, type SimAssetTheme } from '../illustrations/catalog';
import { BUNDLED_LOTTIE } from './bundledSimAssets';

const REGISTERED = new Set(SIM_ASSET_CATALOG.map((e) => e.key));

export function isAssetRegistered(key: string): boolean {
  return REGISTERED.has(key);
}

export function getBundledLottie(key: SimAssetKey, theme: SimAssetTheme): object | null {
  const bundleKey = `${key}:${theme}`;
  return BUNDLED_LOTTIE[bundleKey] ?? null;
}

export function listAssetKeys(): SimAssetKey[] {
  return SIM_ASSET_CATALOG.map((e) => e.key);
}

export function preloadAssetKeys(keys: (string | undefined)[]): SimAssetKey[] {
  return keys.filter((k): k is SimAssetKey => Boolean(k && isAssetRegistered(k)));
}

/** Preload Lottie JSON into memory (Metro already bundles requires). */
export async function preloadSimAssets(keys: SimAssetKey[], theme: SimAssetTheme): Promise<void> {
  for (const key of keys) {
    getBundledLottie(key, theme);
  }
}
