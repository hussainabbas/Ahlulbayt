import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { GuideContentLocale } from './types';

interface GuidedReaderToolbarProps {
  contentLocale: GuideContentLocale;
  onContentLocaleChange: (locale: GuideContentLocale) => void;
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
}

const LOCALES: GuideContentLocale[] = ['en', 'ur', 'ar'];

const LOCALE_LABELS: Record<GuideContentLocale, string> = {
  en: 'EN',
  ur: 'UR',
  ar: 'AR',
};

export function GuidedReaderToolbar({
  contentLocale,
  onContentLocaleChange,
  onDecreaseFont,
  onIncreaseFont,
}: GuidedReaderToolbarProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text variant="caption" color="tertiary">
        {t('guided.reader.textSize')}
      </Text>
      <View style={styles.actions}>
        {LOCALES.map((loc) => (
          <LocaleChip
            key={loc}
            label={LOCALE_LABELS[loc]}
            active={contentLocale === loc}
            onPress={() => onContentLocaleChange(loc)}
          />
        ))}
        <ToolbarButton label="A−" onPress={onDecreaseFont} />
        <ToolbarButton label="A+" onPress={onIncreaseFont} />
      </View>
    </View>
  );
}

function LocaleChip({
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
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: active
            ? theme.colors.accentPrimaryMuted
            : pressed
              ? theme.colors.surfaceElevated
              : theme.colors.backgroundPrimary,
          borderColor: active ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Text variant="caption" color={active ? 'accent' : 'secondary'} weight="600">
        {label}
      </Text>
    </Pressable>
  );
}

function ToolbarButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: pressed ? theme.colors.surfaceElevated : theme.colors.backgroundPrimary,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Text variant="caption" color="secondary" weight="600">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
