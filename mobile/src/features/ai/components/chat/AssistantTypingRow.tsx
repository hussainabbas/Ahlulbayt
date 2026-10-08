import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import { AssistantAvatar } from './AssistantAvatar';

export function AssistantTypingRow() {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <AssistantAvatar />
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
        accessibilityLabel={t('ai.thinking')}
      >
        <View style={styles.bars}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.bar, { backgroundColor: theme.colors.accentPrimary, opacity: 0.35 + i * 0.2 }]}
            />
          ))}
        </View>
        <Text variant="caption" color="tertiary">
          {t('ai.thinking')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: layout.listGap,
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: layout.listGap,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '78%',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 14,
  },
  bar: {
    width: 3,
    height: 10,
    borderRadius: 1.5,
  },
});
