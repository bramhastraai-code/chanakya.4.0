import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import {
  PropertyController,
  UserPropertyController,
  AgentPropertyController,
  BuilderPropertyController,
  AdminPropertyController,
  PublicPropertiesController,
} from './property.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './entities/property.entity';
import {
  BookmarkedProperty,
  BookmarkedPropertySchema,
} from './entities/bookmarked-property.entity';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: BookmarkedProperty.name, schema: BookmarkedPropertySchema },
    ]),
  ],
  controllers: [
    PropertyController,
    UserPropertyController,
    AgentPropertyController,
    BuilderPropertyController,
    AdminPropertyController,
    PublicPropertiesController,
  ],
  providers: [PropertyService, S3Service],
  exports: [PropertyService],
})
export class PropertyModule {}
