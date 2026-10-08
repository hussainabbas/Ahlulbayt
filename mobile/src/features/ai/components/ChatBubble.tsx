import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useLocale } from '@/i18n/useLocale';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { AiMessage } from '../types';

interface ChatBubbleProps {
  message: AiMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { t } = useLocale();
  const { theme } = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrap, isUser ? styles.userWrap : styles.assistantWrap]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          {
            backgroundColor: isUser
              ? theme.colors.accentPrimary
              : theme.colors.surfaceElevated,
            borderColor: isUser ? theme.colors.accentPrimary : theme.colors.borderSubtle,
          },
        ]}
      >
        <Text
          variant="bodyMd"
          color={isUser ? 'inverse' : 'primary'}
          style={{ lineHeight: 24 }}
        >
          {message.content}
        </Text>
        {!isUser && message.source === 'local' ? (
          <Text variant="caption" color="tertiary" style={styles.offline}>
            {t('ai.offlineLabel')}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 6,
  },
  userWrap: {
    alignItems: 'flex-end',
  },
  assistantWrap: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '86%',
    paddingHorizontal: layout.blockGap + 2,
    paddingVertical: layout.blockGap,
    borderWidth: StyleSheet.hairlineWidth,
  },
  userBubble: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 18,
  },
  offline: {
    marginTop: 8,
  },
});
