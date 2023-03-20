import { Injectable, HttpException } from '@nestjs/common';
import { transactionDto, updateTransactionDto } from './transaction.dto';
import { PrismaService } from 'libs/prisma/src';
import { Transaction, TransactionStatusEnum } from '@prisma/client';
import * as kkiapay from 'kkiapay-nodejs-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

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

  async validateTransaction(id: string, totalAmount:number) {
    const k_payment = kkiapay({
      privatekey: this.configService.get('KKIAPAY_PRIVATE_KEY'),
      publickey: this.configService.get('KKIAPAY_PUBLIC_KEY'),
      secretkey: this.configService.get('KKIAPAY_SECRET_KEY'),
      sandbox: true,
    });

    k_payment.verify(id).
      then((response) => {
        console.log('Response : ', response);
        if (response.isPaymentSucces) return 'success';
        return 'pending';
      }).
      catch((error) => {
        return 'pending';
        //throw new HttpException('Error : Transaction not found', 406);
      });
  }
}
