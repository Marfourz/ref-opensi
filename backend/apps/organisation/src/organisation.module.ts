import { Module } from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { PrismaService } from 'libs/prisma/src';
import { StockService } from './stock/stock.service';
import { StockController } from './stock/stock.controller';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';

@Module({
  imports: [],
  controllers: [OrganisationController, StockController, WalletController],
  providers: [OrganisationService, PrismaService, StockService, WalletService],
})
export class OrganisationModule {}
