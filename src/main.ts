// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config(); // Ensure this line is at the top of your main file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter for consistent error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unwanted properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types
      },
    }),
  );

  app.setGlobalPrefix('v1');
  app.enableCors({
    origin: true, // Allow all origins (or specify your frontend URL)
    credentials: true, // Allow cookies
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('chanakya connect Api')
    .setDescription('this is the api for chanakya connect')
    .setVersion('1.0')
    .addTag('chanakya connect')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(4921).finally(() => {
    console.log('Server is running on port http://localhost:4921/api');
  });
}
bootstrap();
