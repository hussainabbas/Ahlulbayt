import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface DailyLifeReaderToolbarProps {
  onDecreaseFont: () => void;
  onIncreaseFont: () => void;
  showTranslationToggle: boolean;
  translationLayer: 'en' | 'ur';
  onToggleTranslation: () => void;
}

export function DailyLifeReaderToolbar({
  onDecreaseFont,
  onIncreaseFont,
  showTranslationToggle,
  translationLayer,
  onToggleTranslation,
}: DailyLifeReaderToolbarProps) {
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
        {t('dailyLifeDuas.reader.textSize')}
      </Text>
      <View style={styles.actions}>
        {showTranslationToggle ? (
          <ToolbarButton label={translationLayer === 'en' ? 'EN' : 'UR'} onPress={onToggleTranslation} />
        ) : null}
        <ToolbarButton label="A−" onPress={onDecreaseFont} />
        <ToolbarButton label="A+" onPress={onIncreaseFont} />
      </View>
    </View>
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
