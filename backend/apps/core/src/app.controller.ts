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
import { EmailPayload } from './consumer/notification/types/index';

@ApiTags('core')
@Controller('core')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notif: NotificationService,
  ) {}

  @Post()
  getHello(): string {
    return this.appService.getHello();
  }
}
