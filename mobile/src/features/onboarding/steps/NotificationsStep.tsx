import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAdhanStore } from '@/stores/adhanStore';

import { OnboardingShell } from '../components/OnboardingShell';
import { requestNotificationPermission } from '../services/permissions';
import { AdhanNotificationService } from '@/features/adhan/services/adhanNotificationService';

interface NotificationsStepProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function NotificationsStep({ onContinue, onBack, onSkip }: NotificationsStepProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const notificationsGranted = useOnboardingStore((s) => s.notificationsGranted);
  const setNotificationsGranted = useOnboardingStore((s) => s.setNotificationsGranted);

  const handleContinue = async () => {
    if (notificationsGranted) {
      onContinue();
      return;
    }
    const granted = await requestNotificationPermission();
    setNotificationsGranted(granted);
    if (granted) {
      useAdhanStore.getState().setMasterEnabled(true);
      await AdhanNotificationService.initialize(
        useAdhanStore.getState().silentModeOverride,
      );
      onContinue();
    }
  };

  return (
    <OnboardingShell
      step="notifications"
      title={t('onboarding.notifications.title')}
      subtitle={t('onboarding.notifications.subtitle')}
      onContinue={handleContinue}
      onBack={onBack}
      onSkip={onSkip}
      continueLabel={
        notificationsGranted
          ? t('onboarding.continue')
          : t('onboarding.notifications.enable')
      }
      footerNote={t('onboarding.notifications.footer')}
    >
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Text variant="displayMd">◉</Text>
        </View>
        <View style={[styles.preview, { borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.surfaceElevated }]}>
          <Text variant="overline" color="secondary">
            {t('onboarding.notifications.previewLabel')}
          </Text>
          <Text variant="headingSm" style={styles.previewTitle}>
            {t('onboarding.notifications.previewTitle')}
          </Text>
          <Text variant="bodySm" color="secondary">
            {t('onboarding.notifications.previewBody')}
          </Text>
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 28,
    marginTop: 8,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  preview: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  previewTitle: {
    marginTop: 4,
  },
});
