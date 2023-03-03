import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';
import { PrismaService } from 'libs/prisma/src';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'guards/roles.guard';
import { WalletModule } from '../wallet/wallet.module';
import { AuthModule } from '../users-manager/auth.module';
import { NotificationModule } from 'apps/notification/src/notification.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpModule,
    WalletModule,
    AuthModule,
    NotificationModule,
    UserModule,
  ],
  controllers: [OrganisationController],
  providers: [
    OrganisationService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class OrganisationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'organisations', method: RequestMethod.ALL },
        { path: 'organisations/(*)', method: RequestMethod.ALL },
      );
  }
}
