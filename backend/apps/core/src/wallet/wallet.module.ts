import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PrismaService } from 'libs/prisma/src';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';

@Module({
  imports: [HttpModule],
  controllers: [WalletController],
  providers: [WalletService, PrismaService, JwtService],
})
export class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'wallets', method: RequestMethod.ALL },
        { path: 'wallets/(*)', method: RequestMethod.ALL },
      );
  }
}
