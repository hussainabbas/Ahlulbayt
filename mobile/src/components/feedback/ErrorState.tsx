import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { getErrorMessage } from '@/core/errors/errorHandler';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface ErrorStateProps {
  error?: unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ErrorState({
  error,
  title,
  message,
  onRetry,
  retryLabel,
  style,
}: ErrorStateProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  const resolvedTitle = title ?? t('common.error');
  const resolvedMessage = message ?? (error ? getErrorMessage(error) : t('common.errorHint'));

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconRing,
          {
            backgroundColor: theme.colors.error + '18',
            borderColor: theme.colors.error + '40',
          },
        ]}
      >
        <Text variant="headingMd" style={{ color: theme.colors.error }}>
          !
        </Text>
      </View>
      <Text variant="headingSm" style={styles.title}>
        {resolvedTitle}
      </Text>
      <Text variant="bodySm" color="secondary" style={styles.message}>
        {resolvedMessage}
      </Text>
      {onRetry ? (
        <Button
          label={retryLabel ?? t('common.retry')}
          onPress={onRetry}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  iconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  button: {
    marginTop: 12,
    minWidth: 160,
  },
});
