import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './document/document.module';
import { OrganisationModule } from './organisation/organisation.module';
import { StockModule } from './stock/stock.module';
import { MetricModule } from './metric/metric.module';
import { OrderModule } from './order/order.module';
import { ItemOrderModule } from './item-order/item-order.module';
import { ProductsModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './users-manager/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { ActivityModule } from './activity/activity.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConsumerModule } from './consumer/consumer.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReceiptModule } from './receipt/receipt.module';
import { EngineModule } from './engine/engine.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    AuthModule,
    HttpModule,
    UserModule,
    OrderModule,
    ItemOrderModule,
    OrganisationModule,
    MetricModule,
    DocumentModule,
    ProductsModule,
    ImageModule,
    ActivityModule,
    TransactionModule,
    ConsumerModule,
    StockModule,
    WalletModule,
    ProductCategoryModule,
    InvoiceModule,
    ReceiptModule,
    EngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
