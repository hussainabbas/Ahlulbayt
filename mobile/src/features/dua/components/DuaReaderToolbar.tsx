import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface DuaReaderToolbarProps {
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onToggleDisplay: () => void;
  onToggleTranslation: () => void;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  displayLabel: string;
  translationLabel: string;
}

export function DuaReaderToolbar({
  bookmarked,
  onToggleBookmark,
  onToggleDisplay,
  onToggleTranslation,
  onIncreaseFont,
  onDecreaseFont,
  displayLabel,
  translationLabel,
}: DuaReaderToolbarProps) {
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
        label={bookmarked ? '★' : '☆'}
        active={bookmarked}
        onPress={onToggleBookmark}
        accessibilityLabel={t('dua.reader.bookmark')}
      />
      <ToolbarButton label={displayLabel} onPress={onToggleDisplay} />
      <ToolbarButton label={translationLabel} onPress={onToggleTranslation} />
      <ToolbarButton label="A−" onPress={onDecreaseFont} />
      <ToolbarButton label="A+" onPress={onIncreaseFont} />
    </View>
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
    padding: 6,
    borderWidth: 1,
    marginBottom: 12,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: 'center',
  },
});
