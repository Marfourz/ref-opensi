import { Injectable } from '@nestjs/common';
import { productDto, updateProductDto } from './product.dto';
import { Product, Image, Stock } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(product: productDto): Promise<Product> {
    try {
      const newProduct = await this.prisma.product.create({
        data: product,
      });
      return newProduct;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.prisma.product.findMany();
      return products;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleProduct(id: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { image: true },
      });
      return product;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleCategory(
    id: string,
    update: updateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: update,
      });
      return updatedProduct;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleProduct(id: string): Promise<Product> {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id },
      });
      return deletedProduct;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllProductImage(id: string): Promise<Image[]> {
    try {
      const images = await this.prisma.image.findMany({
        where: { productId: id },
      });
      return images;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllStocksOfProduct(id: string): Promise<Stock[]> {
    try {
      const stocks = await this.prisma.stock.findMany({
        where: { productId: id },
      });
      return stocks;
    } catch (error) {
      throw error;
      return;
    }
  }
}
