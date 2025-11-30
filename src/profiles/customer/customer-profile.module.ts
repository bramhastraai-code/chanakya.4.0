import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserProfile,
  UserProfileSchema,
} from './entities/customer-profile.entity';
import { UserProfileService } from './customer-profile.service';
import { UserProfileController } from './customer-profile.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, S3Service],
  exports: [UserProfileService],
})
export class UserProfileModule {}
