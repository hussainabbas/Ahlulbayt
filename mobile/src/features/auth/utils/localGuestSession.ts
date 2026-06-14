import { getString, setString } from '@/core/storage/mmkv';
import { StorageKeys } from '@/core/storage/keys';

import type { AuthUser } from '../types';

function createGuestId(): string {
  const id = `local-guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  setString(StorageKeys.LOCAL_GUEST_ID, id);
  return id;
}

export function getOrCreateLocalGuestId(): string {
  return getString(StorageKeys.LOCAL_GUEST_ID) ?? createGuestId();
}

export function isLocalGuestUser(user: AuthUser | null | undefined): boolean {
  return Boolean(user?.isGuest && user.id.startsWith('local-guest-'));
}

export function createLocalGuestUser(options: {
  locale: string;
  marja: string;
}): AuthUser {
  return {
    id: getOrCreateLocalGuestId(),
    email: null,
    emailVerified: false,
    displayName: 'Guest',
    avatarUrl: null,
    locale: options.locale,
    tier: 'free',
    marja: options.marja,
    isGuest: true,
  };
}
