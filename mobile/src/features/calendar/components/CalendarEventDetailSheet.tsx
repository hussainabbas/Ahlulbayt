import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { CATEGORY_COLORS } from '../constants/categories';
import { getPrimaryCategory } from '../engine/calendarEngine';
import type { ShiaCalendarEvent } from '../types';

interface CalendarEventDetailSheetProps {
  event: ShiaCalendarEvent | null;
  visible: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: () => void;
}

export function CalendarEventDetailSheet({
  event,
  visible,
  isBookmarked,
  onClose,
  onToggleBookmark,
}: CalendarEventDetailSheetProps) {
  const { t } = useLocale();
  const { theme } = useTheme();

  if (!event) return null;

  const category = getPrimaryCategory(event);
  const color = CATEGORY_COLORS[category];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.backgroundPrimary,
              borderTopColor: theme.colors.borderSubtle,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: theme.colors.borderSubtle }]} />
          <View style={[styles.categoryPill, { backgroundColor: `${color}20` }]}>
            <Text variant="caption" style={{ color }}>
              {t(`calendar.categories.${category}`)}
            </Text>
          </View>
          <Text variant="headingMd" style={{ marginTop: 12 }}>
            {t(event.titleKey)}
          </Text>
          <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
            {t('calendar.hijriDate', { day: event.hijriDay, month: event.hijriMonth })}
          </Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text variant="bodyMd" color="secondary" style={styles.desc}>
              {t(event.descriptionKey)}
            </Text>
            {event.amaalKey ? (
              <View style={[styles.amaalBox, { backgroundColor: theme.colors.surfaceMuted }]}>
                <Text variant="overline" color="accent">
                  {t('calendar.recommendedAmaal')}
                </Text>
                <Text variant="bodySm" color="secondary" style={{ marginTop: 6 }}>
                  {t(event.amaalKey)}
                </Text>
              </View>
            ) : null}
            {event.categories.length > 1 ? (
              <View style={styles.tags}>
                {event.categories.map((cat) => (
                  <View
                    key={cat}
                    style={[styles.tag, { backgroundColor: `${CATEGORY_COLORS[cat]}18` }]}
                  >
                    <Text variant="caption" style={{ color: CATEGORY_COLORS[cat] }}>
                      {t(`calendar.categories.${cat}`)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={onToggleBookmark}
              style={[styles.actionBtn, { backgroundColor: theme.colors.surfaceMuted }]}
            >
              <Text variant="bodySm" color={isBookmarked ? 'accent' : 'secondary'}>
                {isBookmarked ? t('calendar.bookmarked') : t('calendar.bookmark')}
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={[styles.actionBtn, { backgroundColor: theme.colors.accentPrimaryMuted }]}
            >
              <Text variant="bodySm" color="accent">
                {t('calendar.close')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    maxHeight: '78%',
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  scroll: {
    marginTop: 16,
    maxHeight: 280,
  },
  desc: {
    lineHeight: 24,
  },
  amaalBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
