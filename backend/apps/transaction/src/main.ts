import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(TransactionModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('SNB DOCUMENTATION')
    .setDescription('TRANSACTION API')
    .setVersion('1.0.0')
    .addTag('transactions')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3006);
}
bootstrap();
