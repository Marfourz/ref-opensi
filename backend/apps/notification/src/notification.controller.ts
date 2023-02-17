import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @Post('emails')
  sendEmail(@Body() data: EmailDto): any {
    return this.notificationService.sendEmail(email);
  }
}
