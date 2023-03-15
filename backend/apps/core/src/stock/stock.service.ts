import { Injectable } from '@nestjs/common';
import {
  Stock,
  PackagingTypeEnum,
  TransactionStatusEnum,
} from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { stockDto, updateStockDto, stockOptions } from './stock.dto';
import { PagiationPayload } from 'types';
import { pick } from 'underscore';
import { OrderStatusEnum } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async createStock(stock: stockDto, option?: stockOptions): Promise<Stock> {
    try {
      const haveStock = await this.prisma.stock.findFirst({
        where: {
          organisationId: stock.organisationId,
          productId: stock.productId,
        },
      });

      if (haveStock) {
        let newQuantity;
        if (option.add) {
          newQuantity = haveStock.currentQuantity + stock.currentQuantity;
        } else {
          newQuantity = haveStock.currentQuantity - stock.currentQuantity;
        }
        return await this.updateSingleStock(haveStock.id, {
          currentQuantity: newQuantity,
        });
      }

      const Nstock: any = stock;
      Nstock.originalQuantity = stock.currentQuantity;

      const newStock = await this.prisma.stock.create({
        data: Nstock,
      });
      return newStock;
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
    filterParams,
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

    return { totalPackProducts, totalRackProducts, totalCost, lastStock };
  }

  async getStockEvolution(orgId: string): Promise<any> {
    /*const organisation = await this.prisma.organisation.findUnique({
      where: {
        id: orgId,
      },
      select: {
        type: true,
      },
    });*/

    const data: any = [];
    const deliveredOrders = await this.prisma.order.findMany({
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
        items: true,
      },
    });

    for (let i = 0; i < deliveredOrders.length; i++) {
      const element = deliveredOrders[i];
      let type,
        quantity = 0;
      if (element.organisationId == orgId) {
        type = 'Appro';
      } else {
        type = 'Vente';
      }

      for (let j = 0; j < element.items.length; j++) {
        const e = element.items[j];
        quantity += e.quantity;
      }

      data.push({
        deliveryDate: element.deliveryDate,
        type,
        quantity,
        total: element.totalAmount,
      });
    }

    /*if (organisation.type == 'snb') {
      const stock
      data.push('Manage SNB case');
    }*/

    return data;
  }
}
