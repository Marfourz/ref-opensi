import { Module } from '@nestjs/common';
import { WsNotificationGateway } from './ws-notification.gateway';
@Module({
  providers: [WsNotificationGateway],
  exports: [WsNotificationGateway],
})
export class WsNotificationModule {}
