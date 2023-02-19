import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('USERS_MANAGER_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, RolesController, PermissionsController],
  exports: [AuthService],
  providers: [AuthService, PermissionsService, RolesService, JwtService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes(
        { path: 'auth', method: RequestMethod.ALL },
        { path: 'users/(*)', method: RequestMethod.ALL },

        { path: 'permissions', method: RequestMethod.ALL },
        { path: 'permissions/(*)', method: RequestMethod.ALL },

        { path: 'roles', method: RequestMethod.ALL },
        { path: 'roles/(*)', method: RequestMethod.ALL },
      );
  }
}
