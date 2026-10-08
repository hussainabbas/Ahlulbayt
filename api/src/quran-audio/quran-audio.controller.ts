import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import { QuranAudioProgressDto, QuranAudioUrlQueryDto, RegisterDownloadDto } from './dto/quran-audio.dto';
import { QuranAudioService } from './quran-audio.service';

@Controller('v1/quran-audio')
export class QuranAudioController {
  constructor(private readonly audio: QuranAudioService) {}

  @Get('reciters')
  listReciters() {
    return this.audio.listReciters();
  }

  @Get('manifest')
  getManifest() {
    return this.audio.getManifest();
  }

  @Get('reciters/:reciterId/surahs/:surah/url')
  getSurahUrl(
    @Param('reciterId') reciterId: string,
    @Param('surah', ParseIntPipe) surah: number,
    @Query() query: QuranAudioUrlQueryDto,
  ) {
    return this.audio.getSurahStreamUrl(reciterId, surah, query.bitrate ?? 128);
  }

  @Get('reciters/:reciterId/surahs/:surah/ayahs/:ayah/url')
  getAyahUrl(
    @Param('reciterId') reciterId: string,
    @Param('surah', ParseIntPipe) surah: number,
    @Param('ayah', ParseIntPipe) ayah: number,
    @Query() query: QuranAudioUrlQueryDto,
  ) {
    return this.audio.getAyahStreamUrl(reciterId, surah, ayah, query.bitrate ?? 128);
  }

  @Get('progress')
  getProgress() {
    return this.audio.getProgress('anonymous');
  }

  @Put('progress')
  saveProgress(@Body() dto: QuranAudioProgressDto) {
    return this.audio.saveProgress('anonymous', dto);
  }

  @Post('downloads/register')
  registerDownload(@Body() dto: RegisterDownloadDto) {
    return this.audio.registerDownload('anonymous', dto);
  }
}
