import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { imageDto } from './image.dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async uploadNewProductImage(image: imageDto): Promise<Image> {
    try {
      const pImage = await this.prisma.image.create({
        data: image,
      });
      return pImage;
    } catch (error) {
      throw error;
      return;
    }
  }
  /*
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
  }*/
}
