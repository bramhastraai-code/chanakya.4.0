import { Module } from '@nestjs/common';
import { SearchFilterService } from './search-filter.service';
import { SearchFilterController } from './search-filter.controller';
import {
  Property,
  PropertySchema,
} from 'src/property/entities/property.entity';
import { MongooseModule } from '@nestjs/mongoose';

import { Amenity, AmenitySchema } from 'src/amenity/entities/amenity.entity';
import { Project, ProjectSchema } from 'src/project/entities/project.entity';
import {
  SearchRecord,
  SearchRecordSchema,
} from './entity/search-record.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchRecord.name, schema: SearchRecordSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Amenity.name, schema: AmenitySchema },
    ]),
  ],
  controllers: [SearchFilterController],
  providers: [SearchFilterService],
})
export class SearchFilterModule {}
