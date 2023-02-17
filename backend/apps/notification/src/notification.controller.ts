import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { emailDto, smsDto } from './notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @Post('mails')
  sendEmail(@Body() data: emailDto): any {
    return this.notificationService.sendEmail(data);
  }

  @Post('sms')
  sendSms(@Body() data: smsDto): any {
    return this.notificationService.sendSms(data);
  }
}
