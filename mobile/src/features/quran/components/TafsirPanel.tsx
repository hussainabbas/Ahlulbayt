import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CitationList } from '@/components/citations';
import { Text } from '@/components/ui/Text';
import { citationsFromReferences, mergeCitations } from '@/core/citations';
import { quranTafsirReferences } from '@/core/references';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import type { AyahRef, AyahTafsir } from '../types';

interface TafsirPanelProps {
  visible: boolean;
  ayahRef: AyahRef;
  tafsir?: AyahTafsir;
  onClose: () => void;
}

export function TafsirPanel({ visible, ayahRef, tafsir, onClose }: TafsirPanelProps) {
  const { t, locale } = useLocale();
  const { theme } = useTheme();

  if (!tafsir) return null;

  const references = quranTafsirReferences(ayahRef, tafsir);
  const citations = mergeCitations(
    tafsir.citations,
    citationsFromReferences(references, locale),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.borderSubtle,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text variant="headingSm">{t('quran.tafsir')}</Text>
          <CitationList citations={citations} compact />
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {tafsir.en ? (
              <Text variant="bodyMd" color="secondary" style={styles.block}>
                {tafsir.en}
              </Text>
            ) : null}
            {tafsir.ur ? (
              <Text variant="bodyMd" color="secondary" style={[styles.block, styles.urdu]}>
                {tafsir.ur}
              </Text>
            ) : null}
          </ScrollView>
          <Pressable
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: theme.colors.accentPrimaryMuted }]}
          >
            <Text variant="bodySm" color="accent">
              {t('common.close')}
            </Text>
          </Pressable>
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
    maxHeight: '72%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8,
  },
  scroll: {
    maxHeight: 320,
  },
  block: {
    lineHeight: 24,
    marginBottom: 12,
  },
  urdu: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  closeBtn: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 8,
  },
});
