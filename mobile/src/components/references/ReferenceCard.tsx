import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import {
  formatReferenceRows,
  pickReferenceText,
  referenceKindLabelKey,
  type IslamicReference,
} from '@/core/references';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

interface ReferenceCardProps {
  reference: IslamicReference;
  compact?: boolean;
  onPress?: () => void;
}

export function ReferenceCard({ reference, compact, onPress }: ReferenceCardProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const rows = formatReferenceRows(reference, locale);
  const isUnavailable = reference.verification === 'unavailable';
  const isPressable = onPress != null && !isUnavailable;

  const body = (
    <>
      <View style={styles.header}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isUnavailable
                ? theme.colors.surfaceMuted
                : theme.colors.accentPrimaryMuted,
              borderColor: isUnavailable
                ? theme.colors.borderSubtle
                : theme.colors.accentPrimary,
            },
          ]}
        >
          <Text
            variant="overline"
            color={isUnavailable ? 'tertiary' : 'accent'}
          >
            {t(referenceKindLabelKey(reference.kind))}
          </Text>
        </View>
        {isPressable ? (
          <Icon name="chevron" size={14} color={theme.colors.textTertiary} />
        ) : null}
      </View>

      <Text variant="bodySm" weight="600">
        {pickReferenceText(reference.primarySource, locale)}
      </Text>

      {reference.notes ? (
        <Text variant="caption" color="tertiary">
          {pickReferenceText(reference.notes, locale)}
        </Text>
      ) : null}

      {!compact
        ? rows.slice(1).map((row) => (
            <View key={row.labelKey} style={styles.row}>
              <Text variant="caption" color="tertiary">
                {t(row.labelKey)}
              </Text>
              <Text variant="bodySm" color="secondary">
                {row.value}
              </Text>
            </View>
          ))
        : null}

      {reference.verification === 'pending' ? (
        <Text variant="caption" color="tertiary">
          {t('references.verification.pending')}
        </Text>
      ) : null}
    </>
  );

  if (reference.url && !compact) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        {body}
        <Pressable
          onPress={() => void Linking.openURL(reference.url!)}
          style={styles.urlRow}
          accessibilityRole="link"
        >
          <Text variant="caption" color="accent">
            {t('references.openUrl')}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!isPressable) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      accessibilityRole="button"
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { gap: 2, marginTop: 2 },
  urlRow: { marginTop: 4 },
});
