import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminHealthService {
  async getPlatformHealth() {
    return {
      status: 'healthy',
      services: {
        api: { status: 'up', latencyMs: 12 },
        postgres: { status: 'up', latencyMs: 4 },
        redis: { status: 'stub', latencyMs: null },
        r2: { status: 'stub' },
        fcm: { status: 'stub' },
        posthog: { status: 'stub' },
      },
      uptime: process.uptime(),
      generatedAt: new Date().toISOString(),
    };
  }
}
