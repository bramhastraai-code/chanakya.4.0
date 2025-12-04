import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OffersService } from './offers.service';
import {
  BuilderOffersController,
  AgentOffersController,
  AdminOffersController,
} from './offers.controller';
import { Offer, OfferSchema } from './entities/offer.entity';
import { Project, ProjectSchema } from '../project/entities/project.entity';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
    AgentModule,
  ],
  controllers: [
    BuilderOffersController,
    AgentOffersController,
    AdminOffersController,
  ],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
