import { Module } from '@nestjs/common';

import { ContentController } from './content.controller';
import { ContentManifestService } from './content-manifest.service';

@Module({
  controllers: [ContentController],
  providers: [ContentManifestService],
  exports: [ContentManifestService],
})
export class ContentModule {}
