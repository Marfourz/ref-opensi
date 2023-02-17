import { Injectable } from '@nestjs/common';
import { emailDto, smsDto } from './notification.dto';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  sendEmail(data: emailDto): any {
    const { object, body, email, sender } = data;
    return this.httpService
      .post('/mails', {
        sender,
        object,
        body,
        contacts: [email],
      })
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );
  }

  sendSms(data: smsDto): any {
    const { to, body, sender } = data;
    return this.httpService
      .post('/sms', {
        contacts: [
          {
            msisdn: to.includes('229') ? to.replace('229', '') : to,
            country_code: '229',
          },
        ],
        sender: sender,
        body,
      })
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );
    }
}
