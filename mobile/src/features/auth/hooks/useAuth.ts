import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { env } from '@/core/config/env';
import { AppError } from '@/core/errors/AppError';
import { getErrorMessage, normalizeError } from '@/core/errors/errorHandler';
import { networkManager } from '@/core/offline/network';
import { useLocale } from '@/i18n/useLocale';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';

import { authApi } from '../services/authApi';
import type { AuthResponse } from '../types';
import { createLocalGuestUser } from '../utils/localGuestSession';

GoogleSignin.configure({
  webClientId: env.googleWebClientId || undefined,
  iosClientId: env.googleIosClientId || undefined,
});

export function useAuth() {
  const { t } = useLocale();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLocalGuestAuth = useAuthStore((s) => s.setLocalGuestAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void GoogleSignin.configure({
      webClientId: env.googleWebClientId || undefined,
      iosClientId: env.googleIosClientId || undefined,
    });
  }, []);

  const handleAuthResponse = useCallback(
    (response: AuthResponse) => {
      setAuth(response);
      setError(null);
      return response;
    },
    [setAuth],
  );

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    (email: string, password: string) =>
      run(async () => handleAuthResponse(await authApi.login({ email, password }))),
    [handleAuthResponse, run],
  );

  const register = useCallback(
    (email: string, password: string, displayName?: string) =>
      run(async () => handleAuthResponse(await authApi.register({ email, password, displayName }))),
    [handleAuthResponse, run],
  );

  const handleLocalGuestAuth = useCallback(() => {
    const { locale, marja } = useSettingsStore.getState();
    const user = createLocalGuestUser({ locale, marja });
    setLocalGuestAuth(user);
    setError(null);
    return { user, tokens: { accessToken: '', refreshToken: '', expiresIn: 0 } } satisfies AuthResponse;
  }, [setLocalGuestAuth]);

  const continueAsGuest = useCallback(
    () =>
      run(async () => {
        if (!networkManager.getIsConnected()) {
          return handleLocalGuestAuth();
        }

        try {
          return handleAuthResponse(await authApi.guest());
        } catch (err) {
          const code = normalizeError(err).code;
          if (
            code === 'NETWORK_OFFLINE' ||
            code === 'NETWORK_TIMEOUT' ||
            code === 'SERVER' ||
            code === 'NOT_FOUND'
          ) {
            return handleLocalGuestAuth();
          }
          throw err;
        }
      }),
    [handleAuthResponse, handleLocalGuestAuth, run],
  );

  const loginWithGoogle = useCallback(
    () =>
      run(async () => {
        if (!env.googleWebClientId) {
          throw new AppError('VALIDATION', t('auth.errors.googleNotConfigured'));
        }

        if (Platform.OS === 'android') {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }

        try {
          const result = await GoogleSignin.signIn();
          const idToken = result.data?.idToken;
          if (!idToken) {
            throw new AppError('VALIDATION', t('auth.errors.googleCancelled'));
          }
          return handleAuthResponse(await authApi.google(idToken));
        } catch (err) {
          const code = (err as { code?: string })?.code;
          if (code === statusCodes.SIGN_IN_CANCELLED) {
            throw new AppError('VALIDATION', t('auth.errors.googleCancelled'));
          }
          if (code === statusCodes.IN_PROGRESS) {
            throw new AppError('VALIDATION', t('auth.errors.googleInProgress'));
          }
          if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw new AppError('VALIDATION', t('auth.errors.googlePlayServices'));
          }
          throw err;
        }
      }),
    [handleAuthResponse, run, t],
  );

  const loginWithApple = useCallback(
    () =>
      run(async () => {
        if (Platform.OS !== 'ios') return null;
        const credential = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        if (!credential.identityToken) {
          throw new AppError('VALIDATION', t('auth.errors.appleCancelled'));
        }
        const fullName = credential.fullName
          ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
          : undefined;
        return handleAuthResponse(await authApi.apple(credential.identityToken, fullName));
      }),
    [handleAuthResponse, run, t],
  );

  const forgotPassword = useCallback(
    (email: string) => run(() => authApi.forgotPassword(email)),
    [run],
  );

  const resetPassword = useCallback(
    (token: string, password: string) => run(() => authApi.resetPassword(token, password)),
    [run],
  );

  const sendOtp = useCallback(
    (email: string, purpose: 'email_verify' | 'login' | 'password_reset') =>
      run(() => authApi.sendOtp(email, purpose)),
    [run],
  );

  const verifyOtp = useCallback(
    (email: string, code: string, purpose: 'email_verify' | 'login' | 'password_reset') =>
      run(async () => {
        const res = await authApi.verifyOtp(email, code, purpose);
        if ('tokens' in res) {
          return handleAuthResponse(res);
        }
        return res;
      }),
    [handleAuthResponse, run],
  );

  const signOut = useCallback(async () => {
    const refreshToken = useAuthStore.getState().getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // ignore logout failures
      }
    }
    try {
      await GoogleSignin.signOut();
    } catch {
      // ignore
    }
    clearAuth();
  }, [clearAuth]);

  return {
    user,
    isGuest,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    continueAsGuest,
    loginWithGoogle,
    loginWithApple,
    forgotPassword,
    resetPassword,
    sendOtp,
    verifyOtp,
    signOut,
    clearError: () => setError(null),
  };
}
