import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Icon } from '@/components/ui/Icon';
import { SegmentControl, type SegmentOption } from '@/components/ui/SegmentControl';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface QuranHubHeaderProps<T extends string> {
  offlineCount: number;
  reciterOptions: SegmentOption<T>[];
  reciterId: T;
  onReciterChange: (id: T) => void;
  onSearchPress: () => void;
}

export function QuranHubHeader<T extends string>({
  offlineCount,
  reciterOptions,
  reciterId,
  onReciterChange,
  onSearchPress,
}: QuranHubHeaderProps<T>) {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text variant="displayMd">{t('quran.title')}</Text>
          <Text variant="bodySm" color="secondary">
            {t('quran.hub.subtitle')}
          </Text>
        </View>
        {offlineCount > 0 ? (
          <View style={[styles.offlinePill, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
            <Icon name="check" size={12} color={theme.colors.accentPrimary} />
            <Text variant="caption" color="accent" weight="600">
              {t('quran.hub.textSavedCount', { count: offlineCount })}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onSearchPress}
        accessibilityRole="button"
        accessibilityLabel={t('quran.search.openSearch')}
        style={({ pressed }) => [
          styles.searchBar,
          {
            backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <View style={[styles.searchIconWrap, { backgroundColor: theme.colors.accentPrimaryMuted }]}>
          <Icon name="search" size={14} color={theme.colors.accentPrimary} />
        </View>
        <Text variant="bodySm" color="secondary" style={styles.searchText}>
          {t('quran.search.placeholder')}
        </Text>
      </Pressable>

      <LinearGradient
        colors={['rgba(212, 184, 122, 0.08)', 'rgba(61, 155, 138, 0.06)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.reciterCard,
          {
            borderColor: theme.colors.borderSubtle,
            borderRadius: theme.radius.lg,
          },
        ]}
      >
        <Text variant="overline" color="tertiary">
          {t('quran.hub.recitation')}
        </Text>
        <SegmentControl options={reciterOptions} value={reciterId} onChange={onReciterChange} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: layout.blockGap,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.listGap,
    paddingHorizontal: layout.blockGap,
    paddingVertical: layout.blockGap - 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    flex: 1,
  },
  reciterCard: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
