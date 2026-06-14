import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface AiChatHeaderProps {
  onClear: () => void;
  canClear: boolean;
}

export function AiChatHeader({ onClear, canClear }: AiChatHeaderProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          borderBottomColor: theme.colors.borderSubtle,
          backgroundColor: theme.colors.backgroundPrimary,
        },
      ]}
    >
      <View style={styles.leading}>
        <View style={[styles.mark, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <View style={[styles.markBar, { backgroundColor: theme.colors.accentGold }]} />
          <Text variant="caption" color="accent" weight="600">
            AB+
          </Text>
        </View>
        <View style={styles.titles}>
          <Text variant="headingSm">{t('ai.title')}</Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {t('ai.headerSubtitle')}
          </Text>
        </View>
      </View>
      {canClear ? (
        <Pressable onPress={onClear} hitSlop={10} accessibilityRole="button">
          <Text variant="caption" color="accent">
            {t('ai.clear')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: layout.blockGap,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.blockGap,
    flex: 1,
    paddingRight: layout.blockGap,
  },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  titles: {
    flex: 1,
    gap: 2,
  },
});
