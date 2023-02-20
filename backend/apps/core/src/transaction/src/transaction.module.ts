import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'libs/prisma/src';
import { InvoiceService } from './invoice/invoice.service';
import { InvoiceController } from './invoice/invoice.controller';
import { ReceiptController } from './receipt/receipt.controller';
import { ReceiptService } from './receipt/receipt.service';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [TransactionController, InvoiceController, ReceiptController],
  providers: [
    TransactionService,
    PrismaService,
    InvoiceService,
    ReceiptService,
    JwtService,
  ],
})
export class TransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      { path: 'transactions', method: RequestMethod.ALL },
      { path: 'transactions/(*)', method: RequestMethod.ALL },

      { path: 'receipts', method: RequestMethod.ALL },
      { path: 'receipts/(*)', method: RequestMethod.ALL },

      { path: 'invoices', method: RequestMethod.ALL },
      { path: 'invoices/(*)', method: RequestMethod.ALL },
    );
  }
}
