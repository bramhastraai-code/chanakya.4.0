import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import {
  BuilderController,
  BuilderAdminController,
} from './builder.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/core/entities/user.entity';
import {
  BuilderProfile,
  BuilderProfileSchema,
} from 'src/profiles/builder/entities/builder-profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BuilderProfile.name, schema: BuilderProfileSchema },
    ]),
  ],
  controllers: [BuilderController, BuilderAdminController],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
