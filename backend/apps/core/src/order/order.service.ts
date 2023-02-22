import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { orderDto, updateOrderDto } from './order.dto';
import { PagiationPayload } from 'types';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(order: orderDto): Promise<Order> {
    try {
      const newOrder = await this.prisma.order.create({
        data: order as Prisma.OrderCreateInput,
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
        data: update as Prisma.OrderUpdateInput,
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

  async searchForOrdersOfOrganisation(
    filterParams,
    orgId: string,
  ): Promise<PagiationPayload<Order[]>> {
    try {
      let Order = 'desc';
      const { page, perPage, order, totalAmount, status, orderId } =
        filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const totalAmountConstraint: any = {};
      if (!isNaN(totalAmount)) {
        totalAmountConstraint.totalAmount = Number(totalAmount);
      }

      if (order != undefined) {
        Order = order;
      }

      const statusConstraint: any = {};
      if (status != undefined) {
        statusConstraint.status = status;
      }

      const orderIdConstraint: any = {};
      if (orderId != undefined) {
        orderIdConstraint.id = {
          contains: orderId,
          mode: 'insensitive',
        };
      }

      const orders = await this.prisma.order.findMany({
        ...paginateConstraints,
        where: {
          organisationId: orgId,
          AND: [
            {
              ...totalAmountConstraint,
            },
            {
              ...statusConstraint,
            },
            {
              ...orderIdConstraint,
            },
          ],
        },
        orderBy: [
          {
            createdAt: Order,
          },
        ],
      });

      const count = await this.prisma.order.count({
        where: { organisationId: orgId },
      });

      return { data: orders, count };
    } catch (error) {
      throw error;
      return;
    }
  }
}
