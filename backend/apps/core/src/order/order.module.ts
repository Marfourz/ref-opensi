import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
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
import { NotificationModule } from 'apps/notification/src/notification.module';
import { StockModule } from '../stock/stock.module';
import { TransactionModule } from '../transaction/transaction.module';
import { InvoiceModule } from '../invoice/invoice.module';
@Module({
  imports: [
    forwardRef(() => StockModule),
    HttpModule,
    ItemOrderModule,
    ProductsModule,
    WsNotificationModule,
    NotificationModule,
    TransactionModule,
    InvoiceModule,
  ],
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
