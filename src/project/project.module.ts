import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { Amenity, AmenitySchema } from 'src/amenity/entities/amenity.entity';
import { User, UserSchema } from 'src/user/entity/user.entity';
import { Builder, BuilderSchema } from 'src/builder/entities/builder.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import {
  Property,
  PropertySchema,
} from 'src/property/entities/property.entity';
import { PropertyService } from 'src/property/property.service';
import { S3Service } from 'src/s3/s3.service';
import {
  Customer,
  CustomerSchema,
} from 'src/customer/entities/customer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Amenity.name, schema: AmenitySchema },
      { name: User.name, schema: UserSchema },
      { name: Builder.name, schema: BuilderSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, PropertyService, S3Service],
  exports: [ProjectService], // Export ProjectService if needed in other modules
})
export class ProjectModule {}
