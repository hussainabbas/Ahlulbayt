import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { layout } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeContext';

import type { AiAction, AiCitation, AiMessage } from '../../types';
import { AiActionCards } from '../AiActionCards';
import { AssistantAvatar } from './AssistantAvatar';
import { CitationCards } from './CitationCards';
import { StreamingCursor } from './StreamingCursor';
import type { IslamicReference } from '@/core/references';

interface ChatMessageRowProps {
  message: AiMessage;
  onAction: (action: AiAction) => void;
  onCitationPress?: (citation: AiCitation) => void;
  onReferencePress?: (reference: IslamicReference) => void;
}

export function ChatMessageRow({
  message,
  onAction,
  onCitationPress,
  onReferencePress,
}: ChatMessageRowProps) {
  const { theme } = useTheme();
  const isUser = message.role === 'user';
  const showMeta = message.role === 'assistant' && !message.isStreaming;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser ? <AssistantAvatar /> : null}
      <View style={[styles.column, isUser ? styles.columnUser : styles.columnAssistant]}>
        <View
          style={[
            styles.bubble,
            isUser
              ? {
                  backgroundColor: theme.colors.accentPrimary,
                  borderBottomRightRadius: 6,
                }
              : {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: theme.colors.borderSubtle,
                  borderBottomLeftRadius: 6,
                  borderWidth: StyleSheet.hairlineWidth,
                },
          ]}
        >
          <View style={styles.contentRow}>
            <Text
              variant="bodyMd"
              color={isUser ? 'inverse' : 'primary'}
              style={styles.messageText}
            >
              {message.content}
            </Text>
            {message.isStreaming ? <StreamingCursor /> : null}
          </View>
        </View>
        {showMeta && (message.references?.length || message.citations?.length) ? (
          <CitationCards
            citations={message.citations}
            references={message.references}
            onCitationPress={onCitationPress}
            onReferencePress={onReferencePress}
          />
        ) : null}
        {showMeta && message.actions?.length ? (
          <AiActionCards actions={message.actions} onAction={onAction} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: layout.listGap,
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: 6,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  column: {
    maxWidth: '82%',
  },
  columnUser: {
    alignItems: 'flex-end',
  },
  columnAssistant: {
    alignItems: 'flex-start',
    flex: 1,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 18,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  messageText: {
    flexShrink: 1,
    lineHeight: 22,
  },
});
