import { Inject, Injectable, Optional } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS } from './redis.tokens';

@Injectable()
export class CacheService {
  constructor(@Optional() @Inject(REDIS) private readonly redis: Redis | null) {}

  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;
    try {
      if (this.redis.status !== 'ready') await this.redis.connect();
      const raw = await this.redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    if (!this.redis) return;
    try {
      if (this.redis.status !== 'ready') await this.redis.connect();
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* cache is best-effort */
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) return;
    try {
      if (this.redis.status !== 'ready') await this.redis.connect();
      await this.redis.del(key);
    } catch {
      /* cache is best-effort */
    }
  }
}
