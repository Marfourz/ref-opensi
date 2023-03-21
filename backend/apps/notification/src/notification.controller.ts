import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { emailDto, smsDto } from './notification.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-email')
  sendEmail(@Body() data: emailDto): any {
    return this.notificationService.sendEmail(data);
  }

  @Post('send-sms')
  sendSms(@Body() data: smsDto): any {
    return this.notificationService.sendSms(data);
  }
}
