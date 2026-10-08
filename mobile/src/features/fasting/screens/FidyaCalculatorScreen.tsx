import { useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReferenceList } from '@/components/references/ReferenceList';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { FiqhDisclaimerBanner } from '../components/FiqhDisclaimerBanner';
import { calculateFidya } from '../engine/fidyaCalculator';
import { FIDYA_DEFAULT_GRAMS_PER_DAY } from '../data/jafariRulings';

const DAY_OPTIONS = [1, 7, 10, 30];

export function FidyaCalculatorScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [missedDays, setMissedDays] = useState(30);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('fasting.fidya.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const result = useMemo(() => calculateFidya({ missedDays }), [missedDays]);

  return (
    <Screen padded={false} safeTop={false} safeBottom={false}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: layout.screenPaddingX,
            paddingBottom: insets.bottom + layout.blockGap,
          },
        ]}
      >
        <Text variant="bodySm" color="secondary">
          {t('fasting.fidya.subtitle')}
        </Text>

        <FiqhDisclaimerBanner />

        <Card variant="inset" style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('fasting.fidya.missedDays')}
          </Text>
          <View style={styles.chips}>
            {DAY_OPTIONS.map((n) => (
              <Chip
                key={n}
                label={String(n)}
                active={missedDays === n}
                onPress={() => setMissedDays(n)}
              />
            ))}
          </View>
        </Card>

        <Card variant="inset" style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('fasting.fidya.result')}
          </Text>
          <Text variant="headingMd" color="accent">
            {result.totalKg} kg
          </Text>
          <Text variant="bodySm" color="secondary">
            {t(result.summaryKey, {
              days: result.missedDays,
              grams: result.perDayGrams,
              total: result.totalGrams,
            })}
          </Text>
          <Text variant="caption" color="tertiary">
            {t(result.detailKey, { defaultGrams: FIDYA_DEFAULT_GRAMS_PER_DAY })}
          </Text>
          <Text variant="caption" color="accent">
            {t('fasting.calculators.consultMarja')}
          </Text>
        </Card>

        <ReferenceList references={result.citations} compact />
      </ScrollView>
    </Screen>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Text
      variant="caption"
      weight="600"
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.colors.accentPrimary : theme.colors.surfaceMuted,
          color: active ? theme.colors.textInverse : theme.colors.textSecondary,
        },
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: layout.sectionGap,
    paddingTop: layout.blockGap,
  },
  section: {
    gap: layout.listGap,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
