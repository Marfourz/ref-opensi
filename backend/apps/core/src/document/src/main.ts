import { NestFactory } from '@nestjs/core';
import { DocumentModule } from './document.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(DocumentModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('SNB DOCUMENTATION')
    .setDescription('DOCS GENERATOR API')
    .setVersion('1.0.0')
    .addTag('documents')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3008);
}
bootstrap();
