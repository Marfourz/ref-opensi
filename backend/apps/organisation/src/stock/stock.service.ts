import { Injectable } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { stockDto, updateStockDto } from './stock.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async createStock(stock: stockDto): Promise<Stock> {
    try {
      const newStock = await this.prisma.stock.create({
        data: stock,
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

  async searchForStocksOfOrganisation(filterParams, orgId): Promise<Stock[]> {
    try {
      let Order = 'desc';
      const {
        page,
        perPage,
        order,
        prodName,
        stockId,
        prodRackPrice,
        currentQuantity,
      } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const productNameConstraint: any = {};
      if (prodName != undefined) {
        productNameConstraint.name = {
          contains: prodName,
          mode: 'insensitive',
        };
      }

      const productRackPriceConstraint: any = {};
      if (!isNaN(prodRackPrice)) {
        productRackPriceConstraint.rackPrice = Number(prodRackPrice);
      }

      const currentQuantityConstraint: any = {};
      if (!isNaN(currentQuantity)) {
        currentQuantityConstraint.currentQuantity = Number(currentQuantity);
      }

      const stockIdConstraint: any = {};
      if (stockId != undefined) {
        stockIdConstraint.id = {
          contains: stockId,
          mode: 'insensitive',
        };
      }

      if (order != undefined) {
        Order = order;
      }

      const stocks = await this.prisma.stock.findMany({
        ...paginateConstraints,
        where: {
          organisationId: orgId,
          AND: [
            {
              ...stockIdConstraint,
            },
            {
              ...currentQuantityConstraint,
            },
          ],
          product: {
            ...productNameConstraint,
            ...productRackPriceConstraint,
          },
        },
        orderBy: [
          {
            createdAt: Order,
          },
        ],
      });
      return stocks;
    } catch (error) {
      throw error;
      return;
    }
  }
}
