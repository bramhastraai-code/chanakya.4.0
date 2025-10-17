import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmenityController } from './amenity.controller';
import { AmenityService } from './amenity.service';
import { Amenity, AmenitySchema } from './entities/amenity.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Amenity.name, schema: AmenitySchema }]),
  ],
  controllers: [AmenityController],
  providers: [AmenityService],
  exports: [AmenityService],
})
export class AmenityModule {}
