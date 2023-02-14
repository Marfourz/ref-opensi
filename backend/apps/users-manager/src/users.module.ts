import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

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
  controllers: [UsersController, RolesController, PermissionsController],
  exports: [UsersService],
  providers: [UsersService, PermissionsService, RolesService],
})
export class UsersModule {}
