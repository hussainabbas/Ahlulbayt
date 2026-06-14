import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { Card } from '@/components/ui/Card';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { AdhanSettingsPanel } from '@/features/adhan/components/AdhanSettingsPanel';
import { PremiumStatusCard } from '@/features/monetization/components/PremiumStatusCard';
import { NotificationSettingsPanel } from '@/features/notifications/components/NotificationSettingsPanel';
import {
  SUPPORTED_LOCALES,
  THEME_MODES,
  type SupportedLocale,
  type ThemeMode,
} from '@/core/config/constants';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

const settingsSchema = z.object({
  themeMode: z.enum(THEME_MODES),
  locale: z.enum(SUPPORTED_LOCALES),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export function SettingsScreen() {
  const { t, locale, setLocale } = useLocale();
  const { themeMode, setThemeMode } = useTheme();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('settings.title') });
  }, [navigation, t]);

  const { control, setValue, watch } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      themeMode,
      locale,
    },
  });

  const currentTheme = watch('themeMode');
  const currentLocale = watch('locale');

  const themeOptions = [
    { value: 'system' as ThemeMode, label: t('settings.themeSystem') },
    { value: 'light' as ThemeMode, label: t('settings.themeLight') },
    { value: 'dark' as ThemeMode, label: t('settings.themeDark') },
  ];

  const localeOptions = [
    { value: 'en' as SupportedLocale, label: t('settings.languageEn') },
    { value: 'ar' as SupportedLocale, label: t('settings.languageAr') },
    { value: 'ur' as SupportedLocale, label: t('settings.languageUr') },
  ];

  return (
    <Screen scroll>
      <ScreenHeader title={t('settings.title')} />

      <PremiumStatusCard />

      <Card variant="inset" style={styles.sectionCard}>
        <Text variant="label" color="secondary">
          {t('settings.appearance')}
        </Text>
        <Text variant="headingSm" style={styles.fieldLabel}>
          {t('settings.theme')}
        </Text>
        <Controller
          control={control}
          name="themeMode"
          render={() => (
            <RadioGroup
              options={themeOptions}
              value={currentTheme}
              onChange={(value) => {
                setValue('themeMode', value);
                setThemeMode(value);
              }}
            />
          )}
        />

        <Text variant="headingSm" style={styles.fieldLabel}>
          {t('settings.language')}
        </Text>
        <Controller
          control={control}
          name="locale"
          render={() => (
            <RadioGroup
              options={localeOptions}
              value={currentLocale}
              onChange={(value) => {
                setValue('locale', value);
                void setLocale(value);
              }}
            />
          )}
        />
      </Card>

      <NotificationSettingsPanel />

      <View style={styles.section}>
        <Text variant="label" color="secondary">
          {t('adhan.title')}
        </Text>
        <AdhanSettingsPanel />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    marginTop: layout.sectionGap,
    gap: layout.blockGap,
  },
  fieldLabel: {
    marginTop: layout.blockGap,
  },
  section: {
    gap: layout.blockGap,
    marginTop: layout.sectionGap,
    marginBottom: layout.sectionGap,
  },
});
