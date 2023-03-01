import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'guards/roles.guard';

@Module({
  imports: [HttpModule],
  controllers: [StockController],
  exports: [StockService],
  providers: [
    StockService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class StockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'stocks', method: RequestMethod.ALL },
        { path: 'stocks/(*)', method: RequestMethod.ALL },
      );
  }
}
