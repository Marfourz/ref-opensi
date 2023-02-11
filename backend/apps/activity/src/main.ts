import { NestFactory } from '@nestjs/core';
import { ActivityModule } from './activity.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ActivityModule);

  const config = new DocumentBuilder()
    .setTitle('SNB DOCUMENTATION')
    .setDescription('ACTIVITY API')
    .setVersion('1.0.0')
    .addTag('activities')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3007);
}
bootstrap();
