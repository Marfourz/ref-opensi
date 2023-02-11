import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { orderDto, updateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(order: orderDto): Promise<Order> {
    try {
      const newOrder = await this.prisma.order.create({
        data: order,
      });
      return newOrder;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleOrder(id: string): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
          invoice: true,
        },
      });
      return order;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleOrder(id: string, update: updateOrderDto): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: update,
      });
      return updatedOrder;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleOrder(id: string): Promise<Order> {
    try {
      const deletedOrder = await this.prisma.order.delete({
        where: { id },
      });
      return deletedOrder;
    } catch (error) {
      throw error;
      return;
    }
  }
}
