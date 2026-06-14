import { apiPost, apiGet } from '@/core/api/client';

import type { AuthResponse, AuthUser, OtpPurpose, TokenPair } from '../types';

export const authApi = {
  register: (body: { email: string; password: string; displayName?: string; locale?: string }) =>
    apiPost<AuthResponse, typeof body>('/auth/register', body),

  login: (body: { email: string; password: string }) =>
    apiPost<AuthResponse, typeof body>('/auth/login', body),

  guest: () => apiPost<AuthResponse>('/auth/guest'),

  google: (idToken: string) => apiPost<AuthResponse, { idToken: string }>('/auth/google', { idToken }),

  apple: (identityToken: string, fullName?: string) =>
    apiPost<AuthResponse, { identityToken: string; fullName?: string }>('/auth/apple', {
      identityToken,
      fullName,
    }),

  refresh: (refreshToken: string) =>
    apiPost<TokenPair, { refreshToken: string }>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    apiPost<void, { refreshToken: string }>('/auth/logout', { refreshToken }),

  me: () => apiGet<AuthUser>('/auth/me'),

  forgotPassword: (email: string) =>
    apiPost<{ message: string }, { email: string }>('/auth/password/forgot', { email }),

  resetPassword: (token: string, password: string) =>
    apiPost<{ message: string }, { token: string; password: string }>('/auth/password/reset', {
      token,
      password,
    }),

  sendOtp: (email: string, purpose: OtpPurpose) =>
    apiPost<{ message: string }, { email: string; purpose: OtpPurpose }>('/auth/otp/send', {
      email,
      purpose,
    }),

  verifyOtp: (email: string, code: string, purpose: OtpPurpose) =>
    apiPost<AuthResponse | { verified: true }, { email: string; code: string; purpose: OtpPurpose }>(
      '/auth/otp/verify',
      { email, code, purpose },
    ),
} as const;
