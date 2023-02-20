import { Injectable } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { invoiceDto, updateInvoiceDto } from './invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(invoice: invoiceDto): Promise<Invoice> {
    try {
      const newInvoice = await this.prisma.invoice.create({
        data: invoice,
      });
      return newInvoice;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.prisma.invoice.findMany();
  }

  async getSingleInvoice(id: string): Promise<Invoice> {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id },
        include: {
          receipt: true,
          transaction: true,
        },
      });
      return invoice;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleInvoice(
    id: string,
    update: updateInvoiceDto,
  ): Promise<Invoice> {
    try {
      const updatedInvoice = await this.prisma.invoice.update({
        where: { id },
        data: update,
      });
      return updatedInvoice;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleInvoice(id: string): Promise<Invoice> {
    try {
      const deletedInvoice = await this.prisma.invoice.delete({
        where: { id },
      });
      return deletedInvoice;
    } catch (error) {
      throw error;
      return;
    }
  }
}
