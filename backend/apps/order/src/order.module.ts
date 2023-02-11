import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'libs/prisma/src';
import { ItemOrderController } from './item-order/item-order.controller';
import { ItemOrderService } from './item-order/item-order.service';

@Module({
  imports: [],
  controllers: [OrderController, ItemOrderController],
  providers: [OrderService, PrismaService, ItemOrderService],
})
export class OrderModule {}
