import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from './document/src/document.module';
import { OrganisationModule } from './organisation/organisation.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './users-manager/auth.module';
import { ActivityModule } from './activity/src/activity.module';
import { TransactionModule } from './transaction/src/transaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    AuthModule,
    HttpModule,
    UserModule,
    OrderModule,
    OrganisationModule,
    DocumentModule,
    ProductsModule,
    ActivityModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
