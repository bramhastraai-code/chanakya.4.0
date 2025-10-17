import { Module } from '@nestjs/common';
import { ShortVideoService } from './short-video.service';
import { ShortVideoController } from './short-video.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortVideo, ShortVideoSchema } from './entities/short-video.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortVideo.name, schema: ShortVideoSchema }, // Importing ShortVideo schema
    ]),
  ],
  controllers: [ShortVideoController],
  providers: [ShortVideoService],
})
export class ShortVideoModule {}
