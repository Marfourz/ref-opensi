import { Injectable } from '@nestjs/common';
import { Order, Prisma, OrderStatusEnum } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { orderDto, updateOrderDto } from './order.dto';
import { NonSnbOrganisations, PagiationPayload } from 'types';
import { generateRandomString } from '../../../../helpers/generateRandomString';
import { ItemOrderService } from '../item-order/item-order.service';
import { ProductsService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private itemOrderService: ItemOrderService,
    private productService: ProductsService,
  ) {}

  async createOrder(order: orderDto): Promise<Order> {
    try {
      const itemsOrders = order.items;
      const Ilength = itemsOrders.length;
      const orderPayload = {
        organisationId: order.organisationId,
        deliveryCode: generateRandomString(5),
        reference: generateRandomString(7),
        status: OrderStatusEnum.new,
      };
      const newOrder = await this.prisma.order.create({
        data: orderPayload as unknown as Prisma.OrderCreateInput,
      });

      const orderId = newOrder.id;

      let totalAmount = 0;

      itemsOrders.forEach(async (item) => {
        // eslint-disable-next-line prettier/prettier
        return await this.itemOrderService.createItem({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        });
      });

      itemsOrders.forEach(async (item, i) => {
        // eslint-disable-next-line prettier/prettier
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        totalAmount += product.bulkPrice * item.quantity;
        if (i === Ilength - 1) {
          await this.updateSingleOrder(orderId, { totalAmount });
        }
      });

      return await this.getSingleOrder(orderId);
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
          items: {include:{product : true}},
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
      const { page, perPage, q } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const totalAmountConstraint: any = {};
      const orderIdConstraint: any = {};
      const orderReferenceConstraint: any = {};
      const w: any = {};
      w.organisationId = orgId;
      if (q != undefined && q != '') {
        orderIdConstraint.id = {
          contains: q,
          mode: 'insensitive',
        };

        orderReferenceConstraint.reference = {
          contains: q,
          mode: 'insensitive',
        };

        if (!isNaN(q)) {
          totalAmountConstraint.totalAmount = Number(q);
        }

        w.OR = [
          orderIdConstraint,
          totalAmountConstraint,
          orderReferenceConstraint,
        ];
      }

      const orders = await this.prisma.order.findMany({
        ...paginateConstraints,
        where: {
          ...w,
        },
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

  async getOrdersOfOrganisations(type: NonSnbOrganisations): Promise<Order[]> {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          organisation: {
            type,
          },
        },
      });

      return orders;
    } catch (error) {
      throw error;
      return;
    }
  }
}
