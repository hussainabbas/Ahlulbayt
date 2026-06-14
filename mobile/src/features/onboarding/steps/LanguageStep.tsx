import { ScrollView } from 'react-native';

import { Text } from '@/components/ui/Text';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/core/config/constants';
import { useLocale } from '@/i18n/useLocale';

import { OnboardingShell } from '../components/OnboardingShell';
import { SelectionCard } from '../components/SelectionCard';

interface LanguageStepProps {
  onContinue: () => void;
  onBack: () => void;
}

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  ar: 'العربية',
  ur: 'اردو',
};

const LOCALE_NATIVE: Record<SupportedLocale, string> = {
  en: 'English',
  ar: 'Arabic · RTL',
  ur: 'Urdu · RTL',
};

export function LanguageStep({ onContinue, onBack }: LanguageStepProps) {
  const { t, locale, setLocale } = useLocale();

  return (
    <OnboardingShell
      step="language"
      title={t('onboarding.language.title')}
      subtitle={t('onboarding.language.subtitle')}
      onContinue={onContinue}
      onBack={onBack}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {SUPPORTED_LOCALES.map((code) => (
          <SelectionCard
            key={code}
            title={LOCALE_LABELS[code]}
            subtitle={LOCALE_NATIVE[code]}
            selected={locale === code}
            onPress={() => void setLocale(code)}
            leading={
              <Text variant="headingMd" color={locale === code ? 'accent' : 'secondary'}>
                {code === 'en' ? 'A' : code === 'ar' ? 'ع' : 'ا'}
              </Text>
            }
          />
        ))}
      </ScrollView>
    </OnboardingShell>
  );
}
