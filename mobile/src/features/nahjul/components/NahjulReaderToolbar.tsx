import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import {
  NAHJUL_CONTENT_LOCALES,
  NAHJUL_LOCALE_LABELS,
} from '../hooks/useNahjulReader';
import type { NahjulTranslationLayer } from '../types';

interface NahjulReaderToolbarProps {
  bookmarked: boolean;
  translationLayer: NahjulTranslationLayer;
  onToggleBookmark: () => void;
  onToggleDisplay: () => void;
  onTranslationLayerChange: (layer: NahjulTranslationLayer) => void;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  displayLabel: string;
}

export function NahjulReaderToolbar(props: NahjulReaderToolbarProps) {
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
      <ToolbarButton
        label={props.bookmarked ? '★' : '☆'}
        active={props.bookmarked}
        onPress={props.onToggleBookmark}
        accessibilityLabel={t('nahjul.reader.bookmark')}
      />
      <ToolbarButton label={props.displayLabel} onPress={props.onToggleDisplay} />
      <View style={styles.localeGroup}>
        {NAHJUL_CONTENT_LOCALES.map((locale) => (
          <LocaleChip
            key={locale}
            label={NAHJUL_LOCALE_LABELS[locale]}
            active={props.translationLayer === locale}
            onPress={() => props.onTranslationLayerChange(locale)}
          />
        ))}
      </View>
      <ToolbarButton label="A−" onPress={props.onDecreaseFont} />
      <ToolbarButton label="A+" onPress={props.onIncreaseFont} />
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
        styles.localeChip,
        {
          backgroundColor: active
            ? theme.colors.accentPrimaryMuted
            : pressed
              ? theme.colors.surfaceElevated
              : 'transparent',
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

function ToolbarButton({
  label,
  onPress,
  active,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  accessibilityLabel?: string;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: active
            ? theme.colors.accentPrimaryMuted
            : pressed
              ? theme.colors.surfaceElevated
              : 'transparent',
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Text variant="caption" color={active ? 'accent' : 'secondary'}>
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
    flexWrap: 'wrap',
    gap: 6,
    padding: 6,
    borderWidth: 1,
    marginBottom: 12,
  },
  localeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localeChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: 'center',
  },
});
