import { useCallback, useState } from 'react';

import { useLocale } from '@/i18n/useLocale';
import { useSettingsStore } from '@/stores/settingsStore';

import { buildAssistantContext } from '../context/buildAssistantContext';
import { sendAiChatLocal, sendAiChatRemote } from '../services/aiChatApi';
import { useSubscriptionStore } from '@/features/monetization/stores/subscriptionStore';
import { useAiChatStore } from '../stores/aiChatStore';
import type { AiMessage, AiResponseDraft } from '../types';
import { inferCitationKind, streamAssistantText } from '../utils/chatUtils';

function draftToMessage(
  draft: AiResponseDraft,
  t: (key: string, options?: Record<string, unknown>) => string,
  id: string,
): AiMessage {
  const citationTitle = (c: { title: string }) =>
    c.title.startsWith('ai.') || c.title.startsWith('calendar.') ? t(c.title) : c.title;

  return {
    id,
    role: 'assistant',
    content: t(draft.bodyKey, draft.bodyParams as Record<string, unknown>),
    intent: draft.intent,
    citations: draft.citations?.map((c) => ({
      ...c,
      title: citationTitle(c),
      source: c.source?.startsWith('ai.') ? t(c.source) : c.source,
      kind: inferCitationKind(c),
    })),
    actions: draft.actions,
    createdAt: new Date().toISOString(),
    source: 'local',
    isStreaming: false,
  };
}

export function useAiAssistant() {
  const { t, locale } = useLocale();
  const aiEnabled = useSettingsStore((s) => s.aiEnabled);
  const hasAiPremium = useSubscriptionStore((s) => s.hasEntitlement('ai'));
  const messages = useAiChatStore((s) => s.messages);
  const addMessage = useAiChatStore((s) => s.addMessage);
  const updateMessage = useAiChatStore((s) => s.updateMessage);
  const clearMessages = useAiChatStore((s) => s.clearMessages);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const userMessage: AiMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
        source: 'local',
      };
      addMessage(userMessage);
      setIsThinking(true);

      const assistantId = `ai-${Date.now()}`;

      try {
        const context = buildAssistantContext(locale);
        const request = { message: trimmed, context };

        let draft: AiResponseDraft | null = null;
        let source: 'local' | 'remote' = 'local';
        if (aiEnabled && hasAiPremium) {
          draft = await sendAiChatRemote(request);
          if (draft) source = 'remote';
        }
        if (!draft) {
          draft = sendAiChatLocal(request);
        }

        const assistant = draftToMessage(draft, t, assistantId);
        assistant.source = source;
        assistant.content = '';
        assistant.isStreaming = true;
        addMessage(assistant);

        await streamAssistantText(
          t(draft.bodyKey, draft.bodyParams as Record<string, unknown>),
          (partial) => updateMessage(assistantId, { content: partial }),
        );

        updateMessage(assistantId, {
          isStreaming: false,
          citations: assistant.citations,
          actions: assistant.actions,
          intent: assistant.intent,
        });
      } finally {
        setIsThinking(false);
      }
    },
    [addMessage, aiEnabled, hasAiPremium, isThinking, locale, t, updateMessage],
  );

  const sendPrompt = useCallback(
    (messageKey: string) => {
      void sendMessage(t(messageKey));
    },
    [sendMessage, t],
  );

  return {
    messages,
    isThinking,
    sendMessage,
    sendPrompt,
    clearMessages,
    aiEnabled,
  };
}
