import { apiPost } from '@/core/api/client';
import { networkManager } from '@/core/offline/network';

import { generateLocalResponse } from '../engine/responseEngine';
import type { AiChatRequest, AiResponseDraft } from '../types';

interface RemoteChatResponse {
  bodyKey: string;
  bodyParams?: Record<string, string | number>;
  intent: string;
  citations?: AiResponseDraft['citations'];
  actions?: AiResponseDraft['actions'];
}

export async function sendAiChatRemote(request: AiChatRequest): Promise<AiResponseDraft | null> {
  if (!networkManager.getIsConnected()) return null;

  try {
    const data = await apiPost<RemoteChatResponse, AiChatRequest>('/ai/chat', request);
    return {
      intent: data.intent as AiResponseDraft['intent'],
      bodyKey: data.bodyKey,
      bodyParams: data.bodyParams,
      citations: data.citations,
      actions: data.actions,
    };
  } catch {
    return null;
  }
}

export function sendAiChatLocal(request: AiChatRequest): AiResponseDraft {
  return generateLocalResponse(request.message, request.context);
}
