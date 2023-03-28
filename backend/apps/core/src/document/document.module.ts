import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { OrderModule } from '../order/order.module';
import { StockModule } from '../stock/stock.module';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../product/product.module';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('PDF_GENERATOR_BASE_URL'),
      }),
      inject: [ConfigService],
    }),
    OrderModule,
    StockModule,
    UserModule,
    ProductsModule,
    ProductCategoryModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService, PrismaService],
})
export class DocumentModule {}
