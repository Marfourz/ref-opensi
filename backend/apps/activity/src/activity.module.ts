import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { PrismaService } from 'libs/prisma/src';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users-manager/src/users.service';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'guards/roles.guard';

@Module({
  imports: [HttpModule],
  controllers: [ActivityController],
  providers: [
    ActivityService,
    PrismaService,
    JwtService,
    UsersService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class ActivityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'activities', method: RequestMethod.ALL },
        { path: 'activities/(*)', method: RequestMethod.ALL },
      );
  }
}
