import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Suppress user-facing error logging for optional endpoints with local fallbacks. */
    silentErrors?: boolean;
  }
}

import { API_TIMEOUT_MS } from '@/core/config/constants';
import { env } from '@/core/config/env';
import { handleError } from '@/core/errors/errorHandler';
import { AppError } from '@/core/errors/AppError';
import { logger } from '@/core/logging/logger';
import { networkManager } from '@/core/offline/network';
import { useAuthStore } from '@/stores/authStore';
import type { TokenPair } from '@/features/auth/types';
import { isLocalGuestUser } from '@/features/auth/utils/localGuestSession';

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function flushRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!networkManager.getIsConnected()) {
      return Promise.reject(AppError.offline());
    }

    const token = useAuthStore.getState().getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.debug('API request', {
      method: config.method,
      url: config.url,
    });

    return config;
  },
  (error) => {
    const silent = (error.config as InternalAxiosRequestConfig | undefined)?.silentErrors ?? false;
    return Promise.reject(handleError(error, 'api:request', { silent }));
  },
);

apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API response', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const silent = originalRequest?.silentErrors ?? false;
    const appError =
      error instanceof AppError ? error : handleError(error, 'api:response', { silent });

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (appError.code === 'UNAUTHORIZED' && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      const authState = useAuthStore.getState();
      if (isLocalGuestUser(authState.user)) {
        return Promise.reject(appError);
      }

      const refreshToken = authState.getRefreshToken();
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(appError);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) {
              reject(appError);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data: tokens } = await axios.post<TokenPair>(
          `${env.apiBaseUrl}/auth/refresh`,
          { refreshToken },
          { timeout: API_TIMEOUT_MS },
        );
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
        flushRefreshQueue(tokens.accessToken);
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        flushRefreshQueue(null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(handleError(refreshError, 'api:refresh'));
      } finally {
        isRefreshing = false;
      }
    }

    if (appError.code === 'UNAUTHORIZED') {
      if (!isLocalGuestUser(useAuthStore.getState().user)) {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(appError);
  },
);

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function apiPost<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.post<T>(url, body, config);
  return response.data;
}

export async function apiPatch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.patch<T>(url, body, config);
  return response.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}
