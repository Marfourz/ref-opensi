import { NestFactory } from '@nestjs/core';
import { OrganisationModule } from './organisation.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(OrganisationModule);

  const config = new DocumentBuilder()
    .setTitle('SNB DOCUMENTATION')
    .setDescription('ORGANISATION API')
    .setVersion('1.0.0')
    .addTag('organisations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
