import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { Amenity, AmenitySchema } from 'src/amenity/entities/amenity.entity';
import { User, UserSchema } from 'src/core/entities/user.entity';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import {
  Property,
  PropertySchema,
} from 'src/property/entities/property.entity';
import { PropertyService } from 'src/property/property.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Property.name, schema: PropertySchema },

      { name: Amenity.name, schema: AmenitySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, PropertyService, S3Service],
  exports: [ProjectService], // Export ProjectService if needed in other modules
})
export class ProjectModule {}
