import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { EngineController } from './engine.controller';
import { EngineService } from './engine.service';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'guards/roles.guard';
import { AuthModule } from '../users-manager/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [EngineController],
  providers: [
    EngineService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class EngineModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.GET },
        { path: 'users/(*)', method: RequestMethod.ALL },
      );
  }
}
