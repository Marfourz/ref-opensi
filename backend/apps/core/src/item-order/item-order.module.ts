import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ItemOrderController } from './item-order.controller';
import { ItemOrderService } from './item-order.service';
import { PrismaService } from 'libs/prisma/src';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [ItemOrderController],
  providers: [PrismaService, ItemOrderService, JwtService],
  exports: [ItemOrderService],
})
export class ItemOrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'item-order', method: RequestMethod.ALL },
        { path: 'item-order/(*)', method: RequestMethod.ALL },
      );
  }
}
