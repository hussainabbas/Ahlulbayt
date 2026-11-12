import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { NextFunction, Request, Response } from 'express';

import { AppModule } from './app.module';
import { assertProductionConfig, corsOrigins, trustProxySetting } from './common/runtime-config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  assertProductionConfig();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', trustProxySetting());
  app.disable('x-powered-by');
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  app.enableCors({ origin: corsOrigins(), credentials: true });
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`AhlulBayt+ API listening on :${port}`);
}

void bootstrap();
