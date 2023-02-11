import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EngineController } from './engine/engine.controller';
import { EngineService } from './engine/engine.service';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Module({
  imports: [],
  controllers: [UserController, EngineController],
  providers: [UserService, EngineService, PrismaService],
})
export class UserModule {}
