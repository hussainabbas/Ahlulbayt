import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Screen } from '@/components/ui/Screen';
import type { MainTabParamList } from '@/navigation/types';

import { AiChatHeader } from '../components/chat/AiChatHeader';
import { AiWelcomeView } from '../components/chat/AiWelcomeView';
import { AssistantTypingRow } from '../components/chat/AssistantTypingRow';
import { ChatComposer } from '../components/chat/ChatComposer';
import { ChatMessageRow } from '../components/chat/ChatMessageRow';
import { SuggestedPromptStrip } from '../components/chat/SuggestedPromptStrip';
import { useAiAssistant } from '../hooks/useAiAssistant';
import type { AiAction, AiCitation, AiMessage } from '../types';
import { resolveCitationNavigation } from '../utils/citationNavigation';

export function AiAssistantScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, 'AiAssistant'>>();
  const { messages, isThinking, sendMessage, sendPrompt, clearMessages } = useAiAssistant();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<AiMessage>>(null);
  const seedSent = useRef(false);

  useEffect(() => {
    const seed = route.params?.seedPrompt;
    if (seed && !seedSent.current && messages.length === 0) {
      seedSent.current = true;
      void sendMessage(seed);
    }
  }, [route.params?.seedPrompt, messages.length, sendMessage]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isThinking) return;
    setInput('');
    void sendMessage(text);
  };

  const handleAction = (action: AiAction) => {
    if (action.payload?.duaId) {
      navigation.getParent()?.navigate('DuaReader', { duaId: action.payload.duaId });
      return;
    }
    if (action.payload?.ziyaratId) {
      navigation.getParent()?.navigate('ZiyaratReader', { ziyaratId: action.payload.ziyaratId });
      return;
    }
    const navRoute = action.payload?.route;
    if (navRoute === 'Prayer') {
      navigation.navigate('Prayer');
    } else if (navRoute === 'Calendar') {
      navigation.getParent()?.navigate('Calendar');
    } else if (navRoute === 'MuharramMode') {
      navigation.getParent()?.navigate('MuharramMode');
    }
  };

  const handleCitationPress = (citation: AiCitation) => {
    const target = resolveCitationNavigation(citation);
    if (!target) return;

    if (target.stack === 'tab') {
      navigation.navigate(target.screen);
      return;
    }

    navigation.getParent()?.navigate(target.screen, target.params);
  };

  const showTypingFooter =
    isThinking && !messages.some((message) => message.isStreaming);

  const renderItem = ({ item }: { item: AiMessage }) => (
    <ChatMessageRow
      message={item}
      onAction={handleAction}
      onCitationPress={handleCitationPress}
    />
  );

  return (
    <Screen padded={false} safeBottom={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <AiChatHeader onClear={clearMessages} canClear={messages.length > 0} />
        <FlatList
          ref={listRef}
          style={styles.list}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <AiWelcomeView onSelectPrompt={sendPrompt} disabled={isThinking} />
          }
          ListFooterComponent={showTypingFooter ? AssistantTypingRow : null}
          contentContainerStyle={messages.length === 0 ? styles.emptyContent : styles.chatContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => {
            if (messages.length > 0) {
              listRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />
        {messages.length > 0 ? (
          <SuggestedPromptStrip onSelect={sendPrompt} disabled={isThinking} />
        ) : null}
        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isThinking}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { flex: 1 },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  chatContent: {
    paddingTop: 8,
    paddingBottom: 12,
  },
});
