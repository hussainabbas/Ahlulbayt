import React, { useState } from 'react';

import { Pressable, StyleSheet, View } from 'react-native';



import { Icon } from '@/components/ui/Icon';

import { Text } from '@/components/ui/Text';

import { useLocale } from '@/i18n/useLocale';

import { layout } from '@/theme/layout';

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

  const hasArabicText = Boolean(ayah.arabic?.trim());



  return (

    <View

      style={[

        styles.card,

        {

          backgroundColor: isPlaying ? theme.colors.accentPrimaryMuted : theme.colors.surfaceMuted,

          borderColor: theme.colors.borderSubtle,

          borderRadius: theme.radius.lg,

        },

      ]}

    >

      <View style={styles.header}>

        <View style={[styles.badge, { backgroundColor: theme.colors.backgroundPrimary }]}>

          <Text variant="label" color="accent" weight="600">

            {ayah.surah}:{ayah.ayah}

          </Text>

        </View>

        <View style={styles.actions}>

          <ActionBtn

            icon="bookmark"

            filled={isBookmarked}

            active={isBookmarked}

            onPress={() => toggleBookmark(ayah.surah, ayah.ayah)}

            accessibilityLabel={t('quran.reader.bookmark')}

          />

          <ActionBtn

            label={note ? '📝' : '✎'}

            active={!!note}

            onPress={() => setNoteOpen(true)}

            accessibilityLabel={t('quran.yourNote')}

          />

          {ayah.tafsir && showTafsir ? (

            <ActionBtn

              icon="book"

              onPress={() => setTafsirOpen(true)}

              accessibilityLabel={t('quran.reader.openTafsir')}

            />

          ) : null}

          {onPlayAyah ? (

            <ActionBtn label={isPlaying ? '⏸' : '▶'} onPress={() => onPlayAyah(ayah)} />

          ) : null}

        </View>

      </View>



      {showArabic && hasArabicText ? (

        <View

          style={[

            styles.arabicPanel,

            {

              backgroundColor: theme.colors.backgroundPrimary,

              borderRightColor: theme.colors.accentGold,

              borderRadius: theme.radius.md,

            },

          ]}

        >

          <TajweedText

            text={ayah.arabic}

            words={ayah.words}

            segments={ayah.segments}

            fontSize={arabicFontSize}

            showTajweed={showTajweed}

            activeWordIndex={activeWordIndex}

          />

        </View>

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

        <View style={[styles.notePreview, { backgroundColor: theme.colors.backgroundPrimary }]}>

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

  icon,

  filled,

  active,

  onPress,

  accessibilityLabel,

}: {

  label?: string;

  icon?: 'bookmark' | 'book';

  filled?: boolean;

  active?: boolean;

  onPress: () => void;

  accessibilityLabel?: string;

}) {

  const { theme } = useTheme();

  return (

    <Pressable

      onPress={onPress}

      accessibilityRole="button"

      accessibilityLabel={accessibilityLabel}

      style={({ pressed }) => [

        styles.actionBtn,

        {

          backgroundColor: active

            ? theme.colors.accentPrimaryMuted

            : pressed

              ? theme.colors.surfaceElevated

              : theme.colors.backgroundPrimary,

          borderColor: theme.colors.borderSubtle,

        },

      ]}

    >

      {icon ? (

        <Icon

          name={icon}

          size={16}

          filled={filled}

          color={active ? theme.colors.accentPrimary : theme.colors.textSecondary}

        />

      ) : (

        <Text variant="bodySm">{label}</Text>

      )}

    </Pressable>

  );

}



const styles = StyleSheet.create({

  card: {

    padding: layout.blockGap,

    borderWidth: StyleSheet.hairlineWidth,

    gap: layout.listGap,

  },

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  badge: {

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 999,

  },

  actions: {

    flexDirection: 'row',

    gap: 6,

  },

  actionBtn: {

    width: 36,

    height: 36,

    borderRadius: 18,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: StyleSheet.hairlineWidth,

  },

  arabicPanel: {

    paddingVertical: 16,

    paddingHorizontal: 14,

    borderRightWidth: 3,

  },

  notePreview: {

    padding: 12,

    borderRadius: 12,

    gap: 4,

  },

});

