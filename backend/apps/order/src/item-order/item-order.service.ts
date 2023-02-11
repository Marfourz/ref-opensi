import { Injectable } from '@nestjs/common';
import { Order, ItemOrder } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { itemOrderDto, updateItemOrderDto } from './item-order.dto';

@Injectable()
export class ItemOrderService {
  constructor(private prisma: PrismaService) {}

  async createItem(item: itemOrderDto): Promise<ItemOrder> {
    try {
      const newItem = await this.prisma.itemOrder.create({
        data: item,
      });
      return newItem;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleItemOrder(id: string): Promise<ItemOrder> {
    try {
      const item = await this.prisma.itemOrder.findUnique({
        where: { id },
      });
      return item;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleItemOrder(
    id: string,
    update: updateItemOrderDto,
  ): Promise<ItemOrder> {
    try {
      const updatedItem = await this.prisma.itemOrder.update({
        where: { id },
        data: update,
      });
      return updatedItem;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleItem(id: string): Promise<ItemOrder> {
    try {
      const deletedItem = await this.prisma.itemOrder.delete({
        where: { id },
      });
      return deletedItem;
    } catch (error) {
      throw error;
      return;
    }
  }
  /*
  async getAllCategories(): Promise<ProductCategory[]> {
    try {
      const categories = await this.prisma.productCategory.findMany();
      return categories;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleCategory(id: string): Promise<ProductCategory> {
    try {
      const category = await this.prisma.productCategory.findUnique({
        where: { id },
      });
      return category;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleCategory(
    id: string,
    update: updateCategoryDto,
  ): Promise<ProductCategory> {
    try {
      const updatedCategory = await this.prisma.productCategory.update({
        where: { id },
        data: update,
      });
      return updatedCategory;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleCategory(id: string): Promise<ProductCategory> {
    try {
      const deletedCategory = await this.prisma.productCategory.delete({
        where: { id },
      });
      return deletedCategory;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getProductsOfCategory(id: string): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany({
        where: { categoryId: id },
      });
      return products;
    } catch (error) {
      throw error;
      return;
    }
  }*/
}
