import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BuilderProfile,
  BuilderProfileSchema,
} from './entities/builder-profile.entity';
import { BuilderProfileService } from './builder-profile.service';
import { BuilderProfileController } from './builder-profile.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BuilderProfile.name, schema: BuilderProfileSchema },
    ]),
  ],
  controllers: [BuilderProfileController],
  providers: [BuilderProfileService, S3Service],
  exports: [BuilderProfileService],
})
export class BuilderProfileModule {}
