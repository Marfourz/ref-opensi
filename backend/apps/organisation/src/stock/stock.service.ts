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
  /*


  async getSingleEngine(id: string): Promise<Engine> {
    try {
      const engine = await this.prisma.engine.findUnique({
        where: { id },
      });
      return engine;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleEngine(id: string): Promise<Engine> {
    try {
      const deletedEngine = await this.prisma.engine.delete({
        where: { id },
      });
      return deletedEngine;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleEngine(
    id: string,
    update: updateEngineDto,
  ): Promise<Engine> {
    try {
      const updatedEngine = await this.prisma.engine.update({
        where: { id },
        data: update,
      });
      return updatedEngine;
    } catch (error) {
      throw error;
      return;
    }
  }*/
}
