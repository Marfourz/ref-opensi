import { Injectable } from '@nestjs/common';
import { emailDto, smsDto } from './notification.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationService {
  constructor(private readonly httpService: HttpService) {}

  sendEmail(data: emailDto): any {
    const { object, body, email, sender } = data;
    return this.httpService
      .post('/mails', {
        sender,
        object,
        body,
        contacts: [email],
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('Mail:err', err);
        return {
          statusCode: err.response.status,
          message: err.response.statusText,
          data: err.response.data,
        };
      });
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
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          statusCode: err.response.status,
          message: err.response.statusText,
          data: err.response.data,
        };
      });
  }
}
