import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src';
import { MetricService } from './metric.service';
import { MetricController } from './metric.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';

@Module({
  imports: [HttpModule],
  controllers: [MetricController],
  providers: [PrismaService, MetricService, JwtService],
})
export class MetricModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'metrics', method: RequestMethod.ALL },
        { path: 'metrics/(*)', method: RequestMethod.ALL },
      );
  }
}
