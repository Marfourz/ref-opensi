import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../../users-manager/src/users.module';
import { DocumentModule } from './document/src/document.module';
import { OrganisationModule } from './organisation/organisation.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from "./users-manager/users.module"
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    HttpModule,
    UsersModule,
    UserModule,
    OrderModule,
    OrganisationModule,
    DocumentModule,
    ProductsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

