import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuilderService } from './builder.service';
import { BuilderController } from './builder.controller';
import { Builder, BuilderSchema } from './entities/builder.entity';
import { ProjectModule } from 'src/project/project.module'; // Import the ProjectModule
import { Project, ProjectSchema } from 'src/project/entities/project.entity';
import { JwtModule } from '@nestjs/jwt';
import { adminJwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    ProjectModule, // Import the ProjectModule to access ProjectService
    MongooseModule.forFeature([
      { name: Builder.name, schema: BuilderSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [BuilderController],
  providers: [BuilderService, adminJwtStrategy],
  exports: [BuilderService], // Export BuilderService if it needs to be used elsewhere
})
export class BuilderModule {}
