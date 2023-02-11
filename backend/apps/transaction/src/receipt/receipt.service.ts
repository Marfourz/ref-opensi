import { Injectable } from '@nestjs/common';
import { Receipt } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { receiptDto, updateReceiptDto } from './receipt.dto';

@Injectable()
export class ReceiptService {
  constructor(private prisma: PrismaService) {}

  async createReceipt(receipt: receiptDto): Promise<Receipt> {
    try {
      const newInvoice = await this.prisma.receipt.create({
        data: receipt,
      });
      return newInvoice;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return await this.prisma.receipt.findMany({
      include: {
        invoice: true,
      },
    });
  }

  async getSingleReceipt(id: string): Promise<Receipt> {
    try {
      const receipt = await this.prisma.receipt.findUnique({
        where: { id },
        include: {
          invoice: true,
        },
      });
      return receipt;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleReceipt(
    id: string,
    update: updateReceiptDto,
  ): Promise<Receipt> {
    try {
      const updatedReceipt = await this.prisma.receipt.update({
        where: { id },
        data: update,
      });
      return updatedReceipt;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleReceipt(id: string): Promise<Receipt> {
    try {
      const deletedReceipt = await this.prisma.receipt.delete({
        where: { id },
      });
      return deletedReceipt;
    } catch (error) {
      throw error;
      return;
    }
  }
}
