import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SuperAdminProfile,
  SuperAdminProfileSchema,
} from './entities/super-admin-profile.entity';
import { SuperAdminProfileService } from './super-admin-profile.service';
import { SuperAdminProfileController } from './super-admin-profile.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperAdminProfile.name, schema: SuperAdminProfileSchema },
    ]),
  ],
  controllers: [SuperAdminProfileController],
  providers: [SuperAdminProfileService, S3Service],
  exports: [SuperAdminProfileService],
})
export class SuperAdminProfileModule {}
