import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationMiddleware } from 'middlewares/authentication.middleware';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
  ],
  controllers: [ImageController],
  providers: [PrismaService, JwtService, ImageService],
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes({ path: 'product-image', method: RequestMethod.POST });
  }
}
