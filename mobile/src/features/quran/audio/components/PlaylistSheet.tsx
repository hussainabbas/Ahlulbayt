import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { useTheme } from '@/theme/ThemeContext';

import { parseTrackId } from '../constants/audioSources';
import { useQuranPlayer } from '../hooks/useQuranPlayer';
import { useQuranPlaylistStore } from '../stores/quranPlaylistStore';

interface PlaylistSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function PlaylistSheet({ visible, onClose }: PlaylistSheetProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const { playSurahs, reciterId } = useQuranPlayer();
  const playlists = useQuranPlaylistStore((s) => s.playlists);
  const createPlaylist = useQuranPlaylistStore((s) => s.createPlaylist);
  const deletePlaylist = useQuranPlaylistStore((s) => s.deletePlaylist);
  const removeTrackFromPlaylist = useQuranPlaylistStore((s) => s.removeTrackFromPlaylist);

  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createPlaylist(name);
    setNewName('');
  };

  const handlePlayPlaylist = async (trackIds: string[]) => {
    const surahs = trackIds
      .map((id) => parseTrackId(id))
      .filter((x) => x.reciterId === reciterId)
      .map((x) => x.surah);
    if (surahs.length) {
      await playSurahs(surahs);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.colors.surfaceElevated }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text variant="headingSm">{t('quran.player.playlist')}</Text>

          <View style={styles.createRow}>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder={t('quran.player.newPlaylist')}
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.borderSubtle,
                  backgroundColor: theme.colors.surfaceMuted,
                },
              ]}
            />
            <Pressable
              onPress={handleCreate}
              style={[styles.addBtn, { backgroundColor: theme.colors.accentPrimary }]}
            >
              <Text variant="bodySm" style={{ color: theme.colors.textInverse }}>
                +
              </Text>
            </Pressable>
          </View>

          <ScrollView style={styles.list}>
            {playlists.map((playlist) => (
              <View key={playlist.id} style={styles.playlistBlock}>
                <View style={styles.playlistHeader}>
                  <Text variant="bodyMd">{playlist.name}</Text>
                  <Text variant="caption" color="tertiary">
                    {t('quran.player.trackCount', { count: playlist.trackIds.length })}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable onPress={() => void handlePlayPlaylist(playlist.trackIds)}>
                    <Text variant="bodySm" color="accent">
                      {t('quran.player.playPlaylist')}
                    </Text>
                  </Pressable>
                  {playlist.id !== 'default-favorites' ? (
                    <Pressable onPress={() => deletePlaylist(playlist.id)}>
                      <Text variant="bodySm" color="secondary">
                        {t('common.delete')}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
                {playlist.trackIds.slice(0, 5).map((trackId) => {
                  const { surah } = parseTrackId(trackId);
                  return (
                    <View key={trackId} style={styles.trackRow}>
                      <Text variant="caption" color="secondary">
                        {t('quran.player.surahNumber', { number: surah })}
                      </Text>
                      <Pressable onPress={() => removeTrackFromPlaylist(playlist.id, trackId)}>
                        <Text variant="caption" color="tertiary">
                          ×
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
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
    maxHeight: '75%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 12,
  },
  createRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    maxHeight: 360,
  },
  playlistBlock: {
    marginBottom: 16,
    gap: 6,
  },
  playlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  trackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
});
