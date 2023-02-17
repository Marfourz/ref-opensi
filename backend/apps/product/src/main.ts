import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './product.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('SNB DOCUMENTATION')
    .setDescription('PRODUCT API')
    .setVersion('1.0.0')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3004);
}
bootstrap();
