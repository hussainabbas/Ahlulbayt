import { isAxiosError } from 'axios';

import { logger } from '@/core/logging/logger';

import { AppError, type AppErrorCode } from './AppError';

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new AppError('NETWORK_TIMEOUT', 'Request timed out', {
        isRetryable: true,
        cause: error,
      });
    }

    if (!error.response) {
      return AppError.offline();
    }

    const status = error.response.status;
    const message =
      (error.response.data as { message?: string })?.message ??
      error.message ??
      'Request failed';

    if (status === 401) {
      return new AppError('UNAUTHORIZED', message, { statusCode: 401, cause: error });
    }
    if (status === 403) {
      return new AppError('FORBIDDEN', message, { statusCode: 403, cause: error });
    }
    if (status === 404) {
      return new AppError('NOT_FOUND', message, { statusCode: 404, cause: error });
    }
    if (status >= 400 && status < 500) {
      return new AppError('VALIDATION', message, { statusCode: status, cause: error });
    }
    if (status >= 500) {
      return new AppError('SERVER', message, {
        statusCode: status,
        isRetryable: true,
        cause: error,
      });
    }
  }

  return AppError.fromUnknown(error);
}

const EXPECTED_NETWORK_CODES: ReadonlySet<AppErrorCode> = new Set([
  'NETWORK_OFFLINE',
  'NETWORK_TIMEOUT',
]);

export type HandleErrorOptions = {
  /** Optional endpoints with local fallbacks — avoid user-facing error toasts. */
  silent?: boolean;
};

export function handleError(
  error: unknown,
  scope: string,
  options?: HandleErrorOptions,
): AppError {
  const appError = normalizeError(error);
  const context = {
    code: appError.code,
    statusCode: appError.statusCode,
  };

  if (EXPECTED_NETWORK_CODES.has(appError.code) || options?.silent) {
    logger.debug(`[${scope}] ${appError.message}`, context);
  } else {
    logger.error(`[${scope}] ${appError.message}`, appError, context);
  }

  return appError;
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  return normalizeError(error).message || fallback;
}
