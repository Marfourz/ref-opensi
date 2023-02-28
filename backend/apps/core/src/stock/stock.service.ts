import { Injectable } from '@nestjs/common';
import { Stock, PackagingTypeEnum } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { stockDto, updateStockDto } from './stock.dto';
import { PagiationPayload } from 'types';
import { pick } from 'underscore';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async createStock(stock: stockDto): Promise<Stock> {
    try {
      const haveStock = await this.prisma.stock.findFirst({
        where: {
          organisationId: stock.organisationId,
          productId: stock.productId,
        },
      });

      if (haveStock) {
        return await this.updateSingleStock(haveStock.id, {
          currentQuantity: stock.currentQuantity,
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
      const w: any = {};
      w.id = categoryId;

      const stocks = await this.prisma.productCategory.findUnique({
        where: {
          ...w,
        },
        select: {
          products: {
            select: { stocks: { where: { organisationId: orgId } } },
          },
        },
      });

      const count = await this.prisma.stock.count({
        where: { organisationId: orgId },
      });

      return { data: stocks.products, count };
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
      totalCost += stock.currentQuantity * stock.product.unitPrice;
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
}
