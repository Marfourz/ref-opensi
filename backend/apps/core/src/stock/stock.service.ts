import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { stockDto, updateStockDto, stockOptions } from './stock.dto';
import { PagiationPayload } from 'types';
import { pick } from 'underscore';
import {
  OrderStatusEnum,
  OrganisationTypeEnum,
  TransactionStatusEnum,
  PackagingTypeEnum,
} from '@prisma/client';
import { orderDto } from '../order/order.dto';
import { OrderService } from '../order/order.service';
import { getPlainPackagingType } from 'helpers/getPlainStatus';

@Injectable()
export class StockService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
  ) {}

  async createStock(stock: stockDto, option?: stockOptions): Promise<Stock> {
    try {
      //get absolute value of currentQuantity of stock
      stock.currentQuantity = Math.abs(stock.currentQuantity);
      const organisation = await this.prisma.organisation.findUnique({
        where: {
          id: stock.organisationId,
        },
        select: {
          type: true,
        },
      });

      const haveStock = await this.prisma.stock.findFirst({
        where: {
          organisationId: stock.organisationId,
          productId: stock.productId,
        },
      });

      let returnedStock: Stock | PromiseLike<Stock>;

      if (haveStock) {
        let newQuantity: number;
        if (option && !option.add) {
          newQuantity = haveStock.currentQuantity - stock.currentQuantity;
        } else {
          newQuantity = haveStock.currentQuantity + stock.currentQuantity;
        }
        returnedStock = await this.updateSingleStock(haveStock.id, {
          currentQuantity: newQuantity,
        });
      } else {
        const Nstock: any = stock;
        Nstock.originalQuantity = stock.currentQuantity;

        returnedStock = await this.prisma.stock.create({
          data: Nstock,
        });
      }

      if (organisation.type == OrganisationTypeEnum.snb) {
        const order: orderDto = {
          organisationId: stock.organisationId,
          items: [
            {
              productId: stock.productId,
              quantity: stock.currentQuantity,
            },
          ],
        };

        if (option && !option.add) {
          order.parentOrganisationId = stock.organisationId;
        }

        console.log('OPTIONS FOR SUBSTRATION STOCK', order);

        const Norder = await this.orderService.createOrder(order);

        await this.orderService.updateSingleOrder(Norder.id, {
          status: OrderStatusEnum.delivered,
        });
      }

      return returnedStock;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleStock(id: string): Promise<Stock> {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: { id },
        include: {
          organisation: true,
        },
      });
      return stock;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleStock(id: string, update: updateStockDto): Promise<Stock> {
    try {
      const updatedStock = await this.prisma.stock.update({
        where: { id },
        data: update,
      });
      return updatedStock;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleStock(id: any): Promise<Stock> {
    try {
      const deletedStock = await this.prisma.stock.delete({
        where: { id },
      });
      return deletedStock;
    } catch (error) {
      throw error;
      return;
    }
  }

  async searchForStocksOfOrganisation(
    filterParams: { page: any; perPage: any; q: any; categoryId: any },
    orgId: string,
  ): Promise<PagiationPayload<any[]>> {
    try {
      const { page, perPage, q, categoryId } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const prodNameConstraint: any = {};
      const w: any = {};
      const subProd: any = {};
      if (q != undefined && q != '') {
        prodNameConstraint.name = {
          contains: q,
          mode: 'insensitive',
        };

        subProd.product = {
          ...prodNameConstraint,
        };

        w.OR = [subProd];
      }

      const stocks = await this.prisma.stock.findMany({
        where: {
          organisationId: orgId,
          product: {
            categoryId,
          },
          ...w,
        },
        include: {
          product: {
            include: {
              category: true,
              image: true,
            },
          },
        },
      });

      const count = await this.prisma.stock.count({
        where: {
          organisationId: orgId,
          product: {
            categoryId,
          },
          ...w,
        },
      });

      return { data: stocks, count };
    } catch (error) {
      throw error;
      return;
    }
  }

  async getStockGeneralInfos(orgId: string): Promise<any> {
    const totalPackProducts = await this.prisma.stock.aggregate({
      where: {
        organisationId: orgId,
        product: {
          packagingType: PackagingTypeEnum.pack,
        },
      },
      _sum: { currentQuantity: true },
    });

    const totalRackProducts = await this.prisma.stock.aggregate({
      where: {
        organisationId: orgId,
        product: {
          packagingType: PackagingTypeEnum.rack,
        },
      },
      _sum: { currentQuantity: true },
    });

    const stocks = await this.prisma.stock.findMany({
      where: {
        organisationId: orgId,
      },
      include: {
        product: true,
      },
    });

    let totalCost = 0;
    stocks.map((stock) => {
      totalCost += stock.currentQuantity * stock.product.bulkPrice;
    });

    const lastStock = await this.prisma.stock.findMany({
      take: 1,
      where: {
        organisationId: orgId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      totalPackProducts,
      totalRackProducts,
      totalCost,
      lastStock: lastStock.length > 0 ? lastStock[0] : null,
    };
  }

  async getStockEvolution(orgId: string, { filterType }): Promise<any> {
    const organisation = await this.prisma.organisation.findUnique({
      where: {
        id: orgId,
      },
      select: {
        type: true,
      },
    });

    let deliveredOrders;

    if (organisation.type == OrganisationTypeEnum.snb) {
      deliveredOrders = await this.prisma.order.findMany({
        where: {
          organisationId: orgId,
          status: OrderStatusEnum.delivered,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    } else {
      deliveredOrders = await this.prisma.order.findMany({
        where: {
          OR: [
            {
              organisationId: orgId,
            },
            {
              parentOrganisationId: orgId,
            },
          ],
          status: OrderStatusEnum.delivered,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const data = [];

    for (let i = 0; i < deliveredOrders.length; i++) {
      const element = deliveredOrders[i];
      let type: string,
        packagingType: PackagingTypeEnum,
        quantity = 0;
      if (
        element.parentOrganisationId == element.organisationId ||
        element.parentOrganisationId == orgId
      ) {
        type = 'sale'; //vente
      } else {
        type = 'supply'; //achat
      }

      for (let j = 0; j < element.items.length; j++) {
        const e = element.items[j];
        packagingType = e.product.packagingType;
        quantity += e.quantity;
      }

      let dataItem: any = {};
      dataItem = {
        date: element.deliveryDate,
        type,
        packagingType: getPlainPackagingType(packagingType),
        quantity,
        total: element.totalAmount,
      };

      data.push(dataItem);
    }

    if (filterType) {
      const result = data.filter((element) => element.type == filterType);
      return result;
    }
    return data;
  }
}
