import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { AiCitation, AiCitationKind } from '../../types';
import { inferCitationKind } from '../../utils/chatUtils';
import { resolveCitationNavigation } from '../../utils/citationNavigation';

interface CitationCardsProps {
  citations: AiCitation[];
  onCitationPress?: (citation: AiCitation) => void;
}

function badgeLabel(kind: AiCitationKind, t: (key: string) => string): string {
  switch (kind) {
    case 'quran':
      return t('ai.citations.quran');
    case 'hadith':
      return t('ai.citations.hadith');
    case 'book':
      return t('ai.citations.book');
    default:
      return t('ai.citations.general');
  }
}

function badgeColors(kind: AiCitationKind, theme: ReturnType<typeof useTheme>['theme']) {
  switch (kind) {
    case 'quran':
      return {
        bg: theme.colors.accentPrimaryMuted,
        border: theme.colors.accentPrimary,
        text: theme.colors.accentPrimary,
      };
    case 'hadith':
      return {
        bg: 'rgba(184, 149, 107, 0.12)',
        border: theme.colors.accentGold,
        text: theme.colors.accentGold,
      };
    default:
      return {
        bg: theme.colors.surfaceMuted,
        border: theme.colors.borderSubtle,
        text: theme.colors.textSecondary,
      };
  }
}

export function CitationCards({ citations, onCitationPress }: CitationCardsProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (citations.length === 0) return null;

  return (
    <View style={styles.root}>
      <Text variant="label" color="tertiary">
        {t('ai.sources')}
      </Text>
      {citations.map((citation) => {
        const kind = inferCitationKind(citation);
        const colors = badgeColors(kind, theme);
        const target = resolveCitationNavigation(citation);
        const isPressable = target != null && onCitationPress != null;

        const cardBody = (
          <>
            <View style={styles.cardTop}>
              <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <Text variant="overline" style={{ color: colors.text }}>
                  {badgeLabel(kind, t)}
                </Text>
              </View>
              {isPressable ? (
                <Icon name="chevron" size={14} color={theme.colors.textTertiary} />
              ) : null}
            </View>
            <Text variant="bodySm" weight="500" style={styles.title}>
              {citation.title}
            </Text>
            {citation.reference ? (
              <Text variant="caption" color="accent">
                {citation.reference}
              </Text>
            ) : null}
            {citation.source ? (
              <Text variant="caption" color="tertiary">
                {citation.source}
              </Text>
            ) : null}
          </>
        );

        if (!isPressable) {
          return (
            <View
              key={citation.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.borderSubtle,
                },
              ]}
            >
              {cardBody}
            </View>
          );
        }

        return (
          <Pressable
            key={citation.id}
            onPress={() => onCitationPress(citation)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.borderSubtle,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={citation.title}
            accessibilityHint={t('ai.tapToOpen')}
          >
            {cardBody}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: layout.listGap,
    gap: layout.listGap,
    width: '100%',
  },
  card: {
    padding: layout.blockGap,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: layout.listGap,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    lineHeight: 20,
  },
});
