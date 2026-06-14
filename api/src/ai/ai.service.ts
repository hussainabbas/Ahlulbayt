import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DRIZZLE, DrizzleDB } from '../database/database.module';
import { aiConversations, aiMessages } from '../database/schema';
import { AiResponseEngine } from './ai-response.engine';
import { AiChatDto } from './dto/ai.dto';

@Injectable()
export class AiService {
  constructor(
    private readonly engine: AiResponseEngine,
    private readonly config: ConfigService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async chat(userId: string | null, dto: AiChatDto) {
    const response = this.engine.generate(dto);

    if (userId) {
      await this.persistExchange(userId, dto.message, response);
    }

    const provider = this.config.get<string>('AI_PROVIDER') ?? 'local';
    return { ...response, provider };
  }

  private async persistExchange(
    userId: string,
    userMessage: string,
    response: ReturnType<AiResponseEngine['generate']>,
  ) {
    const [conversation] = await this.db
      .insert(aiConversations)
      .values({ userId, title: userMessage.slice(0, 80) })
      .returning({ id: aiConversations.id });

    await this.db.insert(aiMessages).values([
      { conversationId: conversation!.id, role: 'user', content: userMessage },
      {
        conversationId: conversation!.id,
        role: 'assistant',
        content: response.bodyKey,
        intent: response.intent,
        metadata: { bodyParams: response.bodyParams, citations: response.citations },
      },
    ]);
  }
}
