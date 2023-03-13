import { Injectable } from '@nestjs/common';
import { Order, Prisma, OrderStatusEnum } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { assignOrderDto, orderDto, updateOrderDto } from './order.dto';
import { PagiationPayload } from 'types';
import { generateRandomString } from '../../../../helpers/generateRandomString';
import { ItemOrderService } from '../item-order/item-order.service';
import { ProductsService } from '../product/product.service';
import { getSubTypeOrg } from 'helpers/getPlainStatus';
import { WsNotificationGateway } from '../ws-notification/ws-notification.gateway';
import { WS_EVENTS } from '../ws-notification/ws-notification.types';
import { NotificationService } from 'apps/notification/src/notification.service';
import { smsDto } from '../../../notification/src/notification.dto';
@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private itemOrderService: ItemOrderService,
    private productService: ProductsService,
    private wsService: WsNotificationGateway,
    private notifService: NotificationService,
  ) {}

  async createOrder(order: orderDto): Promise<Order> {
    try {
      const itemsOrders = order.items;
      const Ilength = itemsOrders.length;
      const organisation = await this.prisma.organisation.findUnique({
        where: {
          id: order.organisationId,
        },
        select: {
          parentOrganisationId: true,
        },
      });
      const orderPayload = {
        organisationId: order.organisationId,
        parentOrganisationId: organisation.parentOrganisationId,
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

      this.wsService.notifyRoom(organisation.parentOrganisationId, {
        event: WS_EVENTS.NEW_ORDER_RECORDED,
        value: orderId,
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
          items: { include: { product: true } },
          invoice: true,
          organisation: true,
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

  async getOrdersOfSubOrganisations(orgId): Promise<Order[]> {
    const organisation = await this.prisma.organisation.findUnique({
      where: {
        id: orgId,
      },
    });

    const subType = getSubTypeOrg(organisation.type);

    if (subType === 'none') {
      return [];
    } else {
      try {
        const orders = await this.prisma.order.findMany({
          where: {
            organisation: {
              type: subType,
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

  async assignOrder(orderId: string, deliveryManId: string): Promise<any> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: { deliveryMan: deliveryManId },
      });

      const deliveryMan = await this.prisma.user.findUnique({
        where: {
          id: deliveryManId,
        },
        select: {
          phone: true,
        },
      });

      const smsBody: smsDto = {
        to: deliveryMan.phone,
        body: "Une nouvelle commande vient de vous être attribuée!! Rdv sur l'application SNB pour plus de détails.",
        sender: 'SNB',
      };

      await this.notifService.sendSms(smsBody);

      return updatedOrder;
    } catch (error) {
      throw error;
      return;
    }
  }
}
