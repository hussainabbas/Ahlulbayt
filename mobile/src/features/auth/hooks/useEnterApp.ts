import { useCallback } from 'react';

import { resetRootRoute } from '@/navigation/navigationRef';

import type { AuthResponse } from '../types';

type AuthResult = AuthResponse | { verified: true } | null | undefined;

function isAuthSession(result: AuthResult): result is AuthResponse {
  return Boolean(result && 'tokens' in result && 'user' in result);
}

/** Navigate to the main app after a successful sign-in or guest session. */
export function useEnterApp() {
  return useCallback((result: AuthResult) => {
    if (!isAuthSession(result)) return false;
    resetRootRoute('Main');
    return true;
  }, []);
}
