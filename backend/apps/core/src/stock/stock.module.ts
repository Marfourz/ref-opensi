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
@Module({
  imports: [HttpModule],
  controllers: [StockController],
  providers: [StockService, PrismaService, JwtService],
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
