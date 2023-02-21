import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, PrismaService, JwtService],
})
export class ProductCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'product-category', method: RequestMethod.ALL },
        { path: 'product-category/(*)', method: RequestMethod.ALL },
      );
  }
}
