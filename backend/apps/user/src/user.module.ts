import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EngineController } from './engine/engine.controller';
import { EngineService } from './engine/engine.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users-manager/src/users.service';

@Module({
  imports: [HttpModule],
  controllers: [UserController, EngineController],
  providers: [
    UserService,
    EngineService,
    PrismaService,
    JwtService,
    UsersService,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(
      { path: 'users', method: RequestMethod.GET },
      { path: 'users/(*)', method: RequestMethod.ALL },

      { path: 'engines', method: RequestMethod.ALL },
      { path: 'engines/(*)', method: RequestMethod.ALL },
    );
  }
}
