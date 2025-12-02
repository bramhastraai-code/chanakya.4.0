import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './entities/customer.entity';
import {
  Property,
  PropertySchema,
} from 'src/property/entities/property.entity';
import { Project, ProjectSchema } from 'src/project/entities/project.entity';
import { Inquiry, InquirySchema } from 'src/inquiry/entities/inquiry.entity';
import { ProjectService } from 'src/project/project.service';
import { PropertyService } from 'src/property/property.service';
import { InquiryService } from 'src/inquiry/inquiry.service';
import { WebSocketGatewayHandler } from 'src/websocket/websocket.gateway';
import { NotificationService } from 'src/firebase/firebase.service';
import { FirebaseAdmin } from 'src/firebase/firebase.admin';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Property.name, schema: PropertySchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Inquiry.name, schema: InquirySchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [
    FirebaseAdmin,
    NotificationService,
    CustomerService,
    ProjectService,
    PropertyService,
    InquiryService,
    WebSocketGatewayHandler,
  ],
})
export class CustomerModule {}
