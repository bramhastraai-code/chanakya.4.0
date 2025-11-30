// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config(); // Ensure this line is at the top of your main file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //it removes unwanted post response
    }),
  );

  app.setGlobalPrefix('v1');
  app.enableCors({ origin: '*' });

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
  await app.listen(4000);
}
bootstrap();
