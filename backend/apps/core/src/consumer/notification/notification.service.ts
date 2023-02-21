import { Injectable } from '@nestjs/common';
import { makeGlobalRequest, RequestMethod } from 'helpers/makeGlobalRequest';
import { NotificationRequestHeaders, EmailPayload, SmsPayload } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {}

  async makeRequest<T>(
    path: string,
    method: RequestMethod,
    args: any,
    headers: NotificationRequestHeaders,
  ): Promise<any> {
    return makeGlobalRequest<T, any>(
      this.configService.get('API_NOTIFICATION'),
      path,
      method,
      args,
      headers,
    );
  }

  async sendEmail(data: EmailPayload) {
    const url = `/notifications/send-email`;
    return this.makeRequest(url, 'post', data.data, {});
  }

  async sendSms(data: SmsPayload) {
    const url = `/notifications/send-sms`;
    return await this.makeRequest(url, 'post', data.data, {});
  }
}
