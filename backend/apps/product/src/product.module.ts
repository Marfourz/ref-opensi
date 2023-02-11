import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductCategoryController } from './product-category/product-category.controller';
import { ConfigModule } from '@nestjs/config';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';

/*const cfservice = new ConfigService();
console.log(cfservice.get('PRODUCT_IMAGES_DEST'));*/

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
  ],
  controllers: [ProductsController, ProductCategoryController, ImageController],
  providers: [
    ProductsService,
    PrismaService,
    ProductCategoryService,
    ImageService,
  ],
})
export class ProductsModule {}
