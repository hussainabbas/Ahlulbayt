import { Body, Controller, Get, Param, Put } from '@nestjs/common';

import { WorshipGuideProgressDto } from './dto/worship-guide.dto';
import { WorshipGuideService } from './worship-guide.service';

@Controller('v1/worship-guide')
export class WorshipGuideController {
  constructor(private readonly guides: WorshipGuideService) {}

  @Get('catalog')
  listCatalog() {
    return this.guides.listCatalog();
  }

  @Get('manifest')
  getManifest() {
    return this.guides.getManifest();
  }

  @Get('bundles/:guideId')
  getBundle(@Param('guideId') guideId: string) {
    return this.guides.getBundle(guideId);
  }

  @Get('progress')
  getProgress() {
    return this.guides.getProgress('anonymous');
  }

  @Put('progress')
  saveProgress(@Body() dto: WorshipGuideProgressDto) {
    return this.guides.saveProgress('anonymous', dto);
  }

  @Get('audio/:assetKey')
  getAudioUrl(@Param('assetKey') assetKey: string) {
    return this.guides.getAudioUrl(assetKey);
  }
}
