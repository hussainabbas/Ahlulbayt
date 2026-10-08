import { Global, Inject, Injectable, Module, OnModuleDestroy, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { CacheService } from './cache.service';

import { REDIS } from './redis.tokens';

@Injectable()
class RedisLifecycleService implements OnModuleDestroy {
  constructor(@Optional() @Inject(REDIS) private readonly redis: Redis | null) {}

  async onModuleDestroy() {
    if (this.redis) await this.redis.quit();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL');
        if (!url) return null;
        return new Redis(url, { maxRetriesPerRequest: 2, lazyConnect: true });
      },
    },
    CacheService,
    RedisLifecycleService,
  ],
  exports: [REDIS, CacheService],
})
export class RedisModule {}
