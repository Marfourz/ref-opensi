import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ProductCategory,
  Product,
  TransactionStatusEnum,
} from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { categoryDto, updateCategoryDto } from './product-category.dto';
import { PagiationPayload } from 'types';

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

  async getAllCategories(
    filterParams: any,
  ): Promise<PagiationPayload<ProductCategory[]>> {
    const { page, perPage, q } = filterParams;

    const paginateConstraints: any = {};
    if (!isNaN(page) && !isNaN(perPage)) {
      paginateConstraints.skip = Number((page - 1) * perPage);
      paginateConstraints.take = Number(perPage);
    }

    const categoryNameConstraint: any = {};
    if (q != undefined) {
      categoryNameConstraint.name = {
        contains: q,
        mode: 'insensitive',
      };
    }

    try {
      const categories = await this.prisma.productCategory.findMany({
        ...paginateConstraints,
        where: {
          AND: [
            {
              ...categoryNameConstraint,
            },
          ],
        },
      });
      const count = await this.prisma.productCategory.count();
      return { data: categories, count };
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
      throw new HttpException(
        'Vous ne pouvez pas supprimé ce produit',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async getProductsOfCategory(
    id: string,
    orgId: string,
    filterParams,
  ): Promise<PagiationPayload<Product[]>> {
    const { page, perPage, q } = filterParams;

    const paginateConstraints: any = {};
    if (!isNaN(page) && !isNaN(perPage)) {
      paginateConstraints.skip = Number((page - 1) * perPage);
      paginateConstraints.take = Number(perPage);
    }

    try {
      const products = await this.prisma.product.findMany({
        ...paginateConstraints,
        where: { categoryId: id },
        include: {
          image: true,
          stocks: { where: { organisationId: orgId } },
        },
      });

      const count = await this.prisma.product.count({
        where: { categoryId: id },
      });

      return { data: products, count };
    } catch (error) {
      throw error;
      return;
    }
  }
}
