import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { NotificationService } from './consumer/notification/notification.service';
import { EmailPayload } from '../../../types/index';

@ApiTags('core')
@Controller('core')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notif: NotificationService,
  ) {}

  @Post()
  getHello(@Body() data: EmailPayload): string {
    this.notif.sendEmail(data);
    return this.appService.getHello();
  }
}
