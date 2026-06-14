import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

interface ZiyaratReaderToolbarProps {
  bookmarked: boolean;
  focusMode: boolean;
  onToggleBookmark: () => void;
  onToggleDisplay: () => void;
  onToggleTranslation: () => void;
  onToggleFocus: () => void;
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  displayLabel: string;
  translationLabel: string;
}

export function ZiyaratReaderToolbar({
  bookmarked,
  focusMode,
  onToggleBookmark,
  onToggleDisplay,
  onToggleTranslation,
  onToggleFocus,
  onIncreaseFont,
  onDecreaseFont,
  displayLabel,
  translationLabel,
}: ZiyaratReaderToolbarProps) {
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
      <ToolBtn label={bookmarked ? '★' : '☆'} active={bookmarked} onPress={onToggleBookmark} />
      <ToolBtn label={displayLabel} onPress={onToggleDisplay} />
      <ToolBtn label={translationLabel} onPress={onToggleTranslation} />
      <ToolBtn
        label={focusMode ? '◉' : '○'}
        active={focusMode}
        onPress={onToggleFocus}
        hint={t('ziyarat.reader.focus')}
      />
      <ToolBtn label="A−" onPress={onDecreaseFont} />
      <ToolBtn label="A+" onPress={onIncreaseFont} />
    </View>
  );
}

function ToolBtn({
  label,
  onPress,
  active,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  hint?: string;
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
    minWidth: 40,
    alignItems: 'center',
  },
});
