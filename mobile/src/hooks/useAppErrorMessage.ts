import { useTranslation } from 'react-i18next';

import { AppError } from '@/core/errors/AppError';

export function useAppErrorMessage() {
  const { t } = useTranslation();

  return (error: unknown): string => {
    if (error instanceof AppError) {
      switch (error.code) {
        case 'NETWORK_OFFLINE':
          return t('errors.networkOffline');
        case 'NETWORK_TIMEOUT':
          return t('errors.networkTimeout');
        case 'UNAUTHORIZED':
          return t('errors.unauthorized');
        case 'SERVER':
          return t('errors.server');
        default:
          return error.message;
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return t('common.error');
  };
}
