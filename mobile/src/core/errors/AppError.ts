export type AppErrorCode =
  | 'NETWORK_OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly statusCode?: number;
  readonly isRetryable: boolean;
  readonly context?: Record<string, unknown>;

  constructor(
    code: AppErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      isRetryable?: boolean;
      context?: Record<string, unknown>;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.isRetryable = options?.isRetryable ?? false;
    this.context = options?.context;
  }

  static offline(message = 'No internet connection'): AppError {
    return new AppError('NETWORK_OFFLINE', message, { isRetryable: true });
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }
    if (error instanceof Error) {
      return new AppError('UNKNOWN', error.message, { cause: error });
    }
    return new AppError('UNKNOWN', 'An unexpected error occurred');
  }
}
