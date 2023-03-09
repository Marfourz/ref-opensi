import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'libs/prisma/src';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'guards/roles.guard';
import { ItemOrderModule } from '../item-order/item-order.module';
import { ProductsModule } from '../product/product.module';
import { WsNotificationModule } from '../ws-notification/ws-notification.module';
@Module({
  imports: [HttpModule, ItemOrderModule, ProductsModule, WsNotificationModule],
  controllers: [OrderController],
  exports: [OrderService],
  providers: [
    OrderService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'orders', method: RequestMethod.ALL },
        { path: 'orders/(*)', method: RequestMethod.ALL },
      );
  }
}
