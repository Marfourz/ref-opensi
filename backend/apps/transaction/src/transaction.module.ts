import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'libs/prisma/src';
import { InvoiceService } from './invoice/invoice.service';
import { InvoiceController } from './invoice/invoice.controller';
import { ReceiptController } from './receipt/receipt.controller';
import { ReceiptService } from './receipt/receipt.service';

@Module({
  imports: [],
  controllers: [TransactionController, InvoiceController, ReceiptController],
  providers: [
    TransactionService,
    PrismaService,
    InvoiceService,
    ReceiptService,
  ],
})
export class TransactionModule {}
