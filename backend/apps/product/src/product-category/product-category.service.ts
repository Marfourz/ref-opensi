import { Injectable } from '@nestjs/common';
import { ProductCategory, Product } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { categoryDto, updateCategoryDto } from './product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(category: categoryDto): Promise<ProductCategory> {
    try {
      const newCategory = await this.prisma.productCategory.create({
        data: category,
      });
      return newCategory;
    } catch (error) {
      throw error;
      return;
    }
  }

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
  }
}
