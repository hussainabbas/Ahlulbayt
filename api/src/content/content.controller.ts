import { Controller, Get } from '@nestjs/common';

import { ContentManifestService } from './content-manifest.service';

@Controller('v1/content')
export class ContentController {
  constructor(private readonly manifest: ContentManifestService) {}

  @Get('manifest')
  getManifest() {
    return this.manifest.getManifest();
  }
}
