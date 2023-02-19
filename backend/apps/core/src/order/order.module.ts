import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'libs/prisma/src';
import { ItemOrderController } from './item-order/item-order.controller';
import { ItemOrderService } from './item-order/item-order.service';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [OrderController, ItemOrderController],
  providers: [OrderService, PrismaService, ItemOrderService, JwtService],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      { path: 'orders', method: RequestMethod.ALL },
      { path: 'orders/(*)', method: RequestMethod.ALL },

      { path: 'item-order', method: RequestMethod.ALL },
      { path: 'item-order/(*)', method: RequestMethod.ALL },
    );
  }
}
