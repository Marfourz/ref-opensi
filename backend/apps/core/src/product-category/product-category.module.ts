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
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'guards/roles.guard';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
  ],
  controllers: [ProductCategoryController],
  providers: [
    ProductCategoryService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [ProductCategoryService],
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
