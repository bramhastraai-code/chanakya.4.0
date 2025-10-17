import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './entities/banner.entity';
import { User, UserSchema } from 'src/user/entity/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: User.name, schema: UserSchema }, // If User schema is needed
    ]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
