import { Injectable } from '@nestjs/common';
import { transactionDto, updateTransactionDto } from './transaction.dto';
import { PrismaService } from 'libs/prisma/src';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(transaction: transactionDto): Promise<Transaction> {
    try {
      const newTransaction = await this.prisma.transaction.create({
        data: transaction,
      });
      return newTransaction;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleTransaction(id: string): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
        include: {
          organisation: true,
          wallet: true,
          invoice: true,
        },
      });
      return transaction;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleTransaction(
    id: string,
    update: updateTransactionDto,
  ): Promise<Transaction> {
    try {
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id },
        data: update,
      });
      return updatedTransaction;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleTransaction(id: string): Promise<Transaction> {
    try {
      const deletedTransaction = await this.prisma.transaction.delete({
        where: { id },
      });
      return deletedTransaction;
    } catch (error) {
      throw error;
      return;
    }
  }
}
