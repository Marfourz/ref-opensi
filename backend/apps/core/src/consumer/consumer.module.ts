import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification/notification.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.production', '.env.development'],
    }),
    HttpModule,
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class ConsumerModule {}
