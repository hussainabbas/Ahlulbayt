import { Module } from '@nestjs/common';

import { QuranAudioController } from './quran-audio.controller';
import { QuranAudioService } from './quran-audio.service';

@Module({
  controllers: [QuranAudioController],
  providers: [QuranAudioService],
  exports: [QuranAudioService],
})
export class QuranAudioModule {}
