import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductCategoryController } from './product-category/product-category.controller';
import { ConfigModule } from '@nestjs/config';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
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
    JwtService,
  ],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      { path: 'products', method: RequestMethod.ALL },
      { path: 'products/(*)', method: RequestMethod.ALL },

      { path: 'product-category', method: RequestMethod.ALL },
      { path: 'product-category/(*)', method: RequestMethod.ALL },

      { path: 'product-image', method: RequestMethod.ALL },
      { path: 'product-image/(*)', method: RequestMethod.ALL },
    );
  }
}
