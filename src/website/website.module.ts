import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, WebsiteSchema } from './entities/website.entity';
import {
  WebsiteTemplate,
  WebsiteTemplateSchema,
} from './entities/website-template.entity';
import { WebsiteV1Service } from './services/website-v1.service';
import { AgentWebsiteController } from './controllers/v1/agent-website.controller';
import { PublicWebsiteController } from './controllers/v1/public-website.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Website.name, schema: WebsiteSchema },
      { name: WebsiteTemplate.name, schema: WebsiteTemplateSchema },
    ]),
  ],
  controllers: [AgentWebsiteController, PublicWebsiteController],
  providers: [WebsiteV1Service],
  exports: [WebsiteV1Service],
})
export class WebsiteModule {}
