import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { useQuranBookmarkStore } from '../stores/quranBookmarkStore';
import { useQuranNotesStore } from '../stores/quranNotesStore';
import { useQuranReaderStore } from '../stores/quranReaderStore';
import type { QuranAyah } from '../types';
import { NoteEditorSheet } from './NoteEditorSheet';
import { TajweedText } from './TajweedText';
import { TafsirPanel } from './TafsirPanel';
import { TranslationBlock } from './TranslationBlock';
import { WordByWordRow } from './WordByWordRow';

interface AyahBlockProps {
  ayah: QuranAyah;
  activeWordIndex?: number | null;
  onPlayAyah?: (ayah: QuranAyah) => void;
  isPlaying?: boolean;
}

export function AyahBlock({ ayah, activeWordIndex, onPlayAyah, isPlaying }: AyahBlockProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const {
    displayMode,
    showTajweed,
    translationLayers,
    showTafsir,
    arabicFontSize,
    translationFontSize,
  } = useQuranReaderStore();
  const isBookmarked = useQuranBookmarkStore((s) => s.isBookmarked(ayah.surah, ayah.ayah));
  const toggleBookmark = useQuranBookmarkStore((s) => s.toggleBookmark);
  const note = useQuranNotesStore((s) => s.getNote(ayah.surah, ayah.ayah));
  const upsertNote = useQuranNotesStore((s) => s.upsertNote);
  const deleteNote = useQuranNotesStore((s) => s.deleteNote);

  const [tafsirOpen, setTafsirOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const showArabic = displayMode !== 'translation_only';
  const showTranslation = displayMode !== 'arabic_only';
  const showWordByWord = displayMode === 'word_by_word';

  return (
    <View
      style={[
        styles.block,
        {
          borderColor: theme.colors.borderSubtle,
          backgroundColor: isPlaying ? theme.colors.accentPrimaryMuted : 'transparent',
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text variant="caption" color="accent">
            {ayah.surah}:{ayah.ayah}
          </Text>
        </View>
        <View style={styles.actions}>
          <ActionBtn
            label={isBookmarked ? '★' : '☆'}
            active={isBookmarked}
            onPress={() => toggleBookmark(ayah.surah, ayah.ayah)}
          />
          <ActionBtn
            label={note ? '📝' : '✎'}
            active={!!note}
            onPress={() => setNoteOpen(true)}
          />
          {ayah.tafsir && showTafsir ? (
            <ActionBtn label="📖" onPress={() => setTafsirOpen(true)} />
          ) : null}
          {onPlayAyah ? (
            <ActionBtn label={isPlaying ? '⏸' : '▶'} onPress={() => onPlayAyah(ayah)} />
          ) : null}
        </View>
      </View>

      {showArabic ? (
        <TajweedText
          text={ayah.arabic}
          words={ayah.words}
          segments={ayah.segments}
          fontSize={arabicFontSize}
          showTajweed={showTajweed}
          activeWordIndex={activeWordIndex}
        />
      ) : null}

      {showWordByWord && ayah.words.length ? (
        <WordByWordRow
          words={ayah.words}
          layers={translationLayers}
          activeWordIndex={activeWordIndex}
          showTajweed={showTajweed}
        />
      ) : null}

      {showTranslation && !showWordByWord ? (
        <TranslationBlock
          translations={ayah.translations}
          layers={translationLayers}
          fontSize={translationFontSize}
        />
      ) : null}

      {note ? (
        <View style={[styles.notePreview, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Text variant="caption" color="tertiary">
            {t('quran.yourNote')}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={2}>
            {note.text}
          </Text>
        </View>
      ) : null}

      <TafsirPanel visible={tafsirOpen} tafsir={ayah.tafsir} onClose={() => setTafsirOpen(false)} />
      <NoteEditorSheet
        visible={noteOpen}
        initialText={note?.text ?? ''}
        ayahRef={`${ayah.surah}:${ayah.ayah}`}
        onSave={(text) => {
          if (text) upsertNote(ayah.surah, ayah.ayah, text);
        }}
        onDelete={
          note
            ? () => {
                deleteNote(note.id);
              }
            : undefined
        }
        onClose={() => setNoteOpen(false)}
      />
    </View>
  );
}

function ActionBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.actionBtn,
        {
          backgroundColor: active ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,
        },
      ]}
    >
      <Text variant="bodySm">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 20,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notePreview: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    gap: 4,
  },
});
