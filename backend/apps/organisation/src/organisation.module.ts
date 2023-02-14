import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { PrismaService } from 'libs/prisma/src';
import { StockService } from './stock/stock.service';
import { StockController } from './stock/stock.controller';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users-manager/src/users.service';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';

@Module({
  imports: [HttpModule],
  controllers: [OrganisationController, StockController, WalletController],
  providers: [
    OrganisationService,
    PrismaService,
    StockService,
    WalletService,
    JwtService,
    UsersService,
  ],
})
export class OrganisationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      { path: 'organisations', method: RequestMethod.ALL },
      { path: 'organisations/(*)', method: RequestMethod.ALL },

      { path: 'metrics', method: RequestMethod.ALL },
      { path: 'metrics/(*)', method: RequestMethod.ALL },

      { path: 'stocks', method: RequestMethod.ALL },
      { path: 'stocks/(*)', method: RequestMethod.ALL },

      { path: 'wallets', method: RequestMethod.ALL },
      { path: 'wallets/(*)', method: RequestMethod.ALL },
    );
  }
}
