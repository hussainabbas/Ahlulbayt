import { Platform } from 'react-native';

import { logger } from '@/core/logging/logger';
import { getString, setString } from '@/core/storage/mmkv';

export type AppIconName = 'Default' | 'Muharram';

const STORAGE_KEY = 'dynamic-app-icon-active';
const ICONS: AppIconName[] = ['Default', 'Muharram'];

let changeIconModule: typeof import('react-native-change-icon') | null | undefined;

function getChangeIconModule() {
  if (changeIconModule !== undefined) return changeIconModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    changeIconModule = require('react-native-change-icon') as typeof import('react-native-change-icon');
  } catch {
    changeIconModule = null;
    logger.warn('react-native-change-icon unavailable — dynamic icons disabled');
  }
  return changeIconModule;
}

export function getActiveAppIconName(): AppIconName | null {
  const stored = getString(STORAGE_KEY);
  if (stored === 'Default' || stored === 'Muharram') return stored;
  return null;
}

export async function setAppIcon(name: AppIconName): Promise<void> {
  const mod = getChangeIconModule();
  if (!mod) return;

  const current = getActiveAppIconName();
  if (current === name) return;

  try {
    if (name === 'Default') {
      await mod.resetIcon();
    } else {
      await mod.changeIcon(name);
    }
    setString(STORAGE_KEY, name);
    logger.info('App icon updated', { name, platform: Platform.OS });
  } catch (error) {
    logger.warn('Failed to change app icon', error, { name });
  }
}

export async function syncAppIconForMuharram(active: boolean): Promise<void> {
  await setAppIcon(active ? 'Muharram' : 'Default');
}

export function isDynamicAppIconSupported(): boolean {
  return getChangeIconModule() != null && ICONS.length > 0;
}
