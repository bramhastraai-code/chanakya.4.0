import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { Saved, SavedSchema } from './entities/saved.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Saved.name, schema: SavedSchema }]),
  ],
  controllers: [SavedController],
  providers: [SavedService],
  exports: [SavedService],
})
export class SavedModule {}
