import { Injectable } from '@nestjs/common';
import { Stock, Order, Product } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';

@Injectable()
export class MetricService {
  constructor(private prisma: PrismaService) {}

  async getProductPerformance(orgId: string, prodId: string): Promise<Stock[]> {
    try {
      const products = await this.prisma.stock.findMany({
        where: { organisationId: orgId, productId: prodId },
      });
      return products;
    } catch (error) {
      throw error;
      return;
    }
  }
}
