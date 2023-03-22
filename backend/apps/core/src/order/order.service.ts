import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import {
  Prisma,
  OrderStatusEnum,
  InvoiceStatusEnum,
  TransactionStatusEnum,
  PaymentMethodEnum,
} from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import {
  assignOrderDto,
  orderDto,
  updateOrderDto,
  periodOrderDto,
} from './order.dto';
import { PagiationPayload } from 'types';
import {
  generateRandomString,
  getRandomInt,
} from '../../../../helpers/generateRandomString';
import { ItemOrderService } from '../item-order/item-order.service';
import { ProductsService } from '../product/product.service';
import { getSubTypeOrg } from 'helpers/getPlainStatus';
import { WsNotificationGateway } from '../ws-notification/ws-notification.gateway';
import { WS_EVENTS } from '../ws-notification/ws-notification.types';
import { NotificationService } from 'apps/notification/src/notification.service';
import { smsDto } from '../../../notification/src/notification.dto';
import { HttpStatus } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { StockService } from '../stock/stock.service';
import { stockDto } from '../stock/stock.dto';
import { TransactionService } from '../transaction/transaction.service';
import { InvoiceService } from '../invoice/invoice.service';
import { invoiceDto } from '../invoice/invoice.dto';
import { transactionDto } from '../transaction/transaction.dto';
import { OrganisationTypeEnum, Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private itemOrderService: ItemOrderService,
    private productService: ProductsService,
    private wsService: WsNotificationGateway,
    private notifService: NotificationService,
    private transactionService: TransactionService,
    private invoiceService: InvoiceService,
    @Inject(forwardRef(() => StockService))
    private stockService: StockService,
  ) {}

  async createOrder(order: orderDto): Promise<Order> {
    try {
      const itemsOrders = order.items;
      const Ilength = itemsOrders.length;
      //get organisation
      const organisation = await this.prisma.organisation.findUnique({
        where: {
          id: order.organisationId,
        },
        select: {
          id: true,
          type: true,
          wallet: true,
          parentOrganisationId: true,
        },
      });
      // create the correspondind order
      const orderPayload: any = {
        organisationId: order.organisationId,
        parentOrganisationId: order.parentOrganisationId
          ? order.parentOrganisationId
          : organisation.parentOrganisationId,
        deliveryCode: generateRandomString(5),
        reference: generateRandomString(7),
        status:
          organisation.type === OrganisationTypeEnum.snb
            ? OrderStatusEnum.delivered
            : OrderStatusEnum.new,
      };
      //if organisation is SNB add delivery date to OrderPayload
      organisation.type === OrganisationTypeEnum.snb &&
        (orderPayload.deliveryDate = dayjs().format('YYYY-MM-DD'));
      const newOrder = await this.prisma.order.create({
        data: orderPayload as unknown as Prisma.OrderCreateInput,
      });

      const orderId = newOrder.id;

      let totalAmount = 0;

      //create orderItems for order
      itemsOrders.forEach(async (item) => {
        // eslint-disable-next-line prettier/prettier
        return await this.itemOrderService.createItem({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        });
      });

      // get total amount of order and update the order
      for (let i = 0; i < itemsOrders.length; i++) {
        const item = itemsOrders[i];
        // eslint-disable-next-line prettier/prettier
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        totalAmount += product.bulkPrice * item.quantity;
        if (i === Ilength - 1) {
          await this.updateSingleOrder(orderId, { totalAmount });
        }
      }

      // notify to parentOrganisationId for a new order created
      this.wsService.notifyRoom(organisation.parentOrganisationId, {
        event: WS_EVENTS.NEW_ORDER_RECORDED,
        value: orderId,
      });

      // create corresponding invoice
      const deductedInvoice: invoiceDto = {
        orderId,
        description: 'Facture de paiement commande : ' + orderId,
        invoiceNumber: getRandomInt(10000, 99999),
        amount: totalAmount,
        source: newOrder.organisationId,
        destination: newOrder.parentOrganisationId
          ? newOrder.parentOrganisationId
          : '',
        status: InvoiceStatusEnum.unpaid,
      };
      const invoice = await this.invoiceService.createInvoice(deductedInvoice);

      let transactionStatus: any = TransactionStatusEnum.pending;

      if (order.kkiapayTransactionId) {
        transactionStatus = this.transactionService.validateTransaction(
          order.kkiapayTransactionId,
          totalAmount,
        );
      }

      //create corresponding transaction

      const deductedTransaction: transactionDto = {
        kkiapayId: order.kkiapayTransactionId
          ? order.kkiapayTransactionId
          : '******',
        walletId: organisation.wallet.id,
        orderId,
        organisationId: organisation.id,
        amount: totalAmount,
        status: transactionStatus,
        paymentMethod: PaymentMethodEnum.kkiapay,
        invoiceId: invoice.id,
      };

      await this.transactionService.createTransaction(deductedTransaction);

      return await this.getSingleOrder(orderId);
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleOrder(id: string): Promise<any> {
    try {
      const order: any = await this.prisma.order.findUnique({
        where: { id },
        include: {
          transaction: true,
          items: { include: { product: true } },
          invoice: true,
          organisation: true
        },
      });
      if (order.deliveryMan) {
        const deliveryMan = await this.prisma.user.findUnique({
          where: {
            id: order.deliveryMan,
          },
        });

        order.deliveryMan = deliveryMan;
      }
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

      if (update.deliveryMan) {
        const deliveryMan = await this.prisma.user.findUnique({
          where: {
            id: update.deliveryMan,
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
      }

      if (update.status == OrderStatusEnum.accepted) {
        await this.updateSingleOrder(id, {
          acceptedAt: dayjs().format('YYYY-MM-DD'),
        });
      }

      if (update.status == OrderStatusEnum.inProgress) {
        await this.updateSingleOrder(id, {
          deliveryStartedAt: dayjs().format('YYYY-MM-DD'),
        });
      }

      this.wsService.notifyRoom(updatedOrder.organisationId, {
        event: WS_EVENTS.ORDER_UPDATED,
        value: updatedOrder.id,
      });
      return updatedOrder;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleOrder(id: string): Promise<Order> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          invoice: true,
        },
      });

      console.log('STATUS TRANSACTION : ', order.status);

      if (order.status == OrderStatusEnum.new) {
        /*await this.prisma.receipt.delete({
          where: {
            invoiceId: order.invoice.id,
          },
        });*/

        await this.prisma.transaction.delete({
          where: {
            orderId: order.id,
          },
        });

        await this.prisma.invoice.delete({
          where: {
            id: order.invoice.id,
          },
        });

        await this.prisma.itemOrder.deleteMany({
          where: {
            orderId: id,
          },
        });

        const deletedOrder = await this.prisma.order.delete({
          where: { id },
        });
        return deletedOrder;
      } else {
        throw new HttpException(
          'Vous ne pouvez pas supprimé cette commande',
          HttpStatus.FORBIDDEN,
        );
      }
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
        where: { ...w },
      });

      return { data: orders, count };
    } catch (error) {
      throw error;
      return;
    }
  }

  async getOrdersOfSubOrganisations(filterParams, orgId): Promise<Order[]> {

    console.log('hgfdxcvbn vcxcvbn ')
    const organisation = await this.prisma.organisation.findUnique({
      where: {
        id: orgId,
      },
    });

    console.log('Organisation mom', organisation);

    const subType = getSubTypeOrg(organisation.type);

    if (subType === 'none') {
      return [];
    } else {
      try {
        console.log(subType);
        const { page, perPage, q } = filterParams;

        const paginateConstraints: any = {};
        if (!isNaN(page) && !isNaN(perPage)) {
          paginateConstraints.skip = Number((page - 1) * perPage);
          paginateConstraints.take = Number(perPage);
        }

        const totalAmountConstraint: any = {};
        const orderIdConstraint: any = {};
        const orderReferenceConstraint: any = {};
        const w: any = {
          organisation: {
            type: subType,
          },
        };
        console.log(q);
          /*if (q != undefined && q != '') {
          orderIdConstraint.id = {
            contains: q,
            mode: 'insensitive',
          };

          if (!isNaN(q)) {
            totalAmountConstraint.totalAmount = Number(q);
          }

          orderReferenceConstraint.reference = {
            contains: q,
            mode: 'insensitive',
          };

          w.OR = [
            orderIdConstraint,
            totalAmountConstraint,
            orderReferenceConstraint,
          ];
        }*/
        const orders = await this.prisma.order.findMany({
          where: {
            ...w,
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

  async searchForOrdersOfDeliveryMan(
    filterParams: any,
    deliveryManId: string,
  ): Promise<PagiationPayload<Order[]>> {
    try {
      const { page, perPage, q } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }
      /*const totalAmountConstraint: any = {};
      const orderIdConstraint: any = {};
      const orderReferenceConstraint: any = {};*/
      const w: any = {};
      w.deliveryMan = deliveryManId;
      /*if (q != undefined && q != '') {
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
      }*/

      const orders = await this.prisma.order.findMany({
        ...paginateConstraints,
        where: {
          ...w,
        },
      });

      const count = await this.prisma.order.count({
        where: { ...w },
      });

      return { data: orders, count };
    } catch (error) {
      throw error;
      return;
    }
  }

  async validateOrder(orderId: string, deliveryCode: string): Promise<any> {
    const order: any = await this.getSingleOrder(orderId);
    if (order.deliveryCode == deliveryCode) {
      const unprocessableOrders: any = [];

      for (let index = 0; index < order.items.length; index++) {
        const element = order.items[index];

        console.log('Parent OrgId : ', order.parentOrganisationId);
        console.log('Prod Id : ', element.product.id);
        const totalStockForProduct = await this.prisma.stock.aggregate({
          where: {
            productId: element.product.id,
            organisationId: order.parentOrganisationId,
          },
          _sum: {
            currentQuantity: true,
          },
        });

        //console.log('TotalStock : ', totalStockForProduct);

        if (totalStockForProduct._sum.currentQuantity < element.quantity) {
          unprocessableOrders.push(element.product.name);
        }
      }

      if (unprocessableOrders.length > 0) {
        let message = 'Stock de : ';
        for (let i = 0; i < unprocessableOrders.length; i++) {
          const element = unprocessableOrders[i];
          message += element + ', ';
        }
        message += 'insuffisant';
        return {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message,
        };
      } else {
        for (let index = 0; index < order.items.length; index++) {
          const element = order.items[index];

          const childStockUpdate: stockDto = {
            organisationId: order.organisationId,
            productId: element.product.id,
            currentQuantity: element.quantity,
          };

          const parentStockUpdate: stockDto = {
            organisationId: order.parentOrganisationId,
            productId: element.product.id,
            currentQuantity: element.quantity,
          };

          await this.stockService.createStock(childStockUpdate, { add: true });
          console.log('Stock added for ', childStockUpdate);
          await this.stockService.createStock(parentStockUpdate, {
            add: false,
          });
          console.log('Stock added for ', parentStockUpdate);
        }
        await this.updateSingleOrder(orderId, {
          status: OrderStatusEnum.delivered,
          deliveredAt: dayjs().format('YYYY-MM-DD'),
          //deliveryDate: dayjs().format('YYYY-MM-DD'),
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Commande livrée avec success!!',
      };
    } else {
      return {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Invalid delivery code',
      };
    }
  }

  async getStatisticsOfDeliveryMan(
    deliveryManId: string,
    period,
  ): Promise<any> {
    const data: any = [];
    const orderByPeriod = await this.getDeliveryManOrdersByPeriod(
      period,
      deliveryManId,
    );

    const pastMonths: any = [];

    for (let index = 6; index >= 0; index--) {
      pastMonths.push(dayjs().subtract(index, 'month').format('YYYY-MM-30'));
    }

    for (let i = 0; i < pastMonths.length; i++) {
      if (i === pastMonths.length - 1) {
        break;
      }
      const totalOrders = await this.getDeliveryManOrdersByPeriod(
        {
          gte: pastMonths[i],
          lte: pastMonths[i + 1],
        },
        deliveryManId,
      );
      data.push({ month: pastMonths[i + 1], total: totalOrders });
    }

    return { orderByPeriod, data };
  }

  async getDeliveryManOrdersByPeriod(period, deliveryManId) {
    return await this.prisma.order.count({
      where: {
        deliveryMan: deliveryManId,
        createdAt: {
          gte: new Date(period.gte).toISOString(),
          lte: new Date(period.lte).toISOString(),
        },
      },
    });
  }

  async getOrderHistory(id: string): Promise<any> {
    const data: any = {};
    const order = await this.getSingleOrder(id);

    const parentOrganisation = await this.prisma.organisation.findUnique({
      where: {
        id: order.parentOrganisationId,
      },
      select: {
        ownerName: true,
      },
    });

    data['order_created'] = {
      date: order.createdAt,
      actor: order.organisation.ownerName,
    };

    if (order.acceptedAt) {
      data['order_accepted'] = {
        date: order.acceptedAt,
        actor: parentOrganisation.ownerName,
      };
    }

    if (order.deliveryMan) {
      const deliveryMan = await this.prisma.user.findUnique({
        where: {
          id: order.deliveryMan,
        },
        select: {
          name: true,
        },
      });
      data['order_delivered'] = {
        date: order.deliveredAt,
        actor: deliveryMan.name,
      };

      /*if (order.deliveryStartedAt) {
        data['order_inProgress'] = {
          date: order.deliveryStartedAt,
          actor: deliveryMan.name,
        };
      }*/
    }
    return data;
  }
}
