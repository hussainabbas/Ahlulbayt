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
import { calculateKaffara } from '../engine/kaffaraCalculator';
import type { KaffaraBreakType, KaffaraInvalidator } from '../types';

const BREAK_TYPES: KaffaraBreakType[] = ['intentional', 'forgetful', 'coerced'];
const INVALIDATORS: KaffaraInvalidator[] = ['food_drink', 'sexual', 'other'];

export function KaffaraCalculatorScreen() {
  const { t } = useLocale();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [breakType, setBreakType] = useState<KaffaraBreakType>('intentional');
  const [invalidator, setInvalidator] = useState<KaffaraInvalidator>('food_drink');
  const [daysBroken, setDaysBroken] = useState(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('fasting.kaffara.title'),
      headerStyle: { backgroundColor: theme.colors.backgroundPrimary },
      headerTintColor: theme.colors.accentPrimary,
      headerShadowVisible: false,
    });
  }, [navigation, t, theme]);

  const result = useMemo(
    () =>
      calculateKaffara({
        breakType,
        invalidator,
        daysBroken,
        isRamadan: true,
      }),
    [breakType, invalidator, daysBroken],
  );

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
          {t('fasting.kaffara.subtitle')}
        </Text>

        <FiqhDisclaimerBanner />

        <Card variant="inset" style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('fasting.kaffara.breakType')}
          </Text>
          <View style={styles.chips}>
            {BREAK_TYPES.map((type) => (
              <Chip
                key={type}
                label={t(`fasting.kaffara.breakTypes.${type}`)}
                active={breakType === type}
                onPress={() => setBreakType(type)}
              />
            ))}
          </View>
        </Card>

        <Card variant="inset" style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('fasting.kaffara.invalidator')}
          </Text>
          <View style={styles.chips}>
            {INVALIDATORS.map((type) => (
              <Chip
                key={type}
                label={t(`fasting.kaffara.invalidators.${type}`)}
                active={invalidator === type}
                onPress={() => setInvalidator(type)}
              />
            ))}
          </View>
        </Card>

        <Card variant="inset" style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('fasting.kaffara.daysBroken')}
          </Text>
          <View style={styles.chips}>
            {[1, 2, 3, 5].map((n) => (
              <Chip
                key={n}
                label={String(n)}
                active={daysBroken === n}
                onPress={() => setDaysBroken(n)}
              />
            ))}
          </View>
        </Card>

        <Card variant="inset" style={styles.section}>
          <Text variant="overline" color="secondary">
            {t('fasting.kaffara.result')}
          </Text>
          {result.obligations.map((obligation) => (
            <View key={obligation.id} style={styles.obligation}>
              <Text variant="bodySm" weight="600">
                {t(obligation.summaryKey)}
                {obligation.quantity != null && obligation.unitKey
                  ? ` (${obligation.quantity} ${t(obligation.unitKey)})`
                  : ''}
              </Text>
              <Text variant="caption" color="secondary">
                {t(obligation.detailKey)}
              </Text>
              {obligation.unverified ? (
                <Text variant="caption" color="tertiary">
                  {t('fasting.calculators.unverified')}
                </Text>
              ) : null}
            </View>
          ))}
          {result.consultMarja ? (
            <Text variant="caption" color="accent">
              {t('fasting.calculators.consultMarja')}
            </Text>
          ) : null}
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
  obligation: {
    gap: 4,
    marginTop: layout.listGap,
  },
});
