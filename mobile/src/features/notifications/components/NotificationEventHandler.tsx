import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

import {
  navigateFromNotificationData,
  registerNotificationEventHandlers,
} from '../platform/notificationRouter';
import { initializeFcm } from '../platform/fcmService';
import { useForegroundNotificationStore } from '../platform/foregroundNotificationStore';
import { trackNotificationOpened } from '../platform/notificationAnalytics';

export function NotificationEventHandler() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const current = useForegroundNotificationStore((s) => s.current);
  const dismiss = useForegroundNotificationStore((s) => s.dismiss);

  useEffect(() => {
    registerNotificationEventHandlers();
    void initializeFcm();
  }, []);

  if (!current) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutUp.duration(180)}
      style={[styles.wrap, { top: insets.top + 8, paddingHorizontal: 16 }]}
    >
      <Pressable
        onPress={() => {
          if (current.data) {
            trackNotificationOpened(current.data);
            navigateFromNotificationData(current.data);
          }
          dismiss();
        }}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            shadowColor: theme.colors.textPrimary,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: theme.colors.accentPrimary }]} />
        <View style={styles.content}>
          <Text variant="label" color="secondary">
            {current.category?.toUpperCase() ?? 'NOTIFICATION'}
          </Text>
          <Text variant="headingSm" numberOfLines={1}>
            {current.title}
          </Text>
          <Text variant="bodySm" color="secondary" numberOfLines={3}>
            {current.body}
          </Text>
        </View>
        <Pressable
          onPress={dismiss}
          hitSlop={12}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        >
          <Text variant="label" color="tertiary">
            ✕
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 2,
  },
  close: {
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
});
