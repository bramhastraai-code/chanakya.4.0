import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { Inquiry, InquirySchema } from './entities/inquiry.entity';
import { User, UserSchema } from '../core/entities/user.entity';
import { Property, PropertySchema } from '../property/entities/property.entity';
import { Project, ProjectSchema } from '../project/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inquiry.name, schema: InquirySchema },
      { name: User.name, schema: UserSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [InquiryController],
  providers: [InquiryService],
  exports: [InquiryService],
})
export class InquiryModule {}
