import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  UserLoginDto,
  UserRegisterDto,
  UserGetResetDto,
  UserResetPasswordDto,
  UserUpdateDto,
  UserChangePasswordDto,
  UserResetPasswordOtp,
  VerifyOtpDto,
} from './auth.dto';
import { HttpService } from '@nestjs/axios';
import { generateRandomString } from 'helpers/generateRandomString';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { getRandomInt } from '../../../../helpers/generateRandomString';
import { NotificationService } from 'apps/notification/src/notification.service';
import { NOTIFICATION_MESSAGES } from 'apps/notification/src/constants.notifications';
import { user } from '../../../../seed/users';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
    private readonly notifService: NotificationService,
  ) {}

  allUsers() {
    const users = this.httpService
      .get('/users')
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

    return users;
  }

  async me(token: string) {
    const me = this.httpService
      .get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .toPromise()
      .then(async (res) => {
        const user = await this.prismaService.user.findUnique({
          where: { email: res.data.email },
          include: { organisation: true, engine: true },
        });
        return user;
      })
      .catch((err) => {
        return {
          statusCode: err.response.status,
          message: err.response.statusText,
          data: err.response.data,
        };
      });

    return me;
  }

  login(user: UserLoginDto) {
    const logededUser = this.httpService
      .post('/users/sign_in', {
        username: user.username,
        password: user.password,
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        throw new HttpException(
          'Vos identifiants sont incorrects',
          HttpStatus.UNAUTHORIZED,
        );
      });

    return logededUser;
  }

  register(user: UserRegisterDto) {
    if (!user.password) {
      user.password = generateRandomString(15);
    }
    const registeredUser = this.httpService
      .post('/users', user)
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('ERROR : ', err);
        throw new HttpException(
          "Quelque chose s'est mal passé",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return registeredUser;
  }

  getSingleUser(id: string) {
    const singleUser = this.httpService
      .get(`/users/${id}`)
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

    return singleUser;
  }

  getResetPasswordToken(user: UserGetResetDto) {
    const data = this.httpService
      .post(`/passwords/reset`, { username: user.username })
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

    return data;
  }

  resetPassword(user: UserResetPasswordDto) {
    const data = this.httpService
      .post(`/passwords/reset/${user.token}`, user)
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

    return data;
  }

  updateUser(update: UserUpdateDto, id: string) {
    const data = this.httpService
      .put(`/users/${id}`, update)
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

    return data;
  }

  changePassword(update: UserChangePasswordDto, userId: any) {
    const data = this.httpService
      .put(`/users/${userId}/password`, update)
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

    return data;
  }

  deleteUser(userId: string) {
    const data = this.httpService
      .delete(`/users/${userId}`)
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

    return data;
  }

  async getResetPasswordCode(user: UserGetResetDto) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: user.username,
      },
    });

    if (!userExist) {
      throw new HttpException(
        'Utilisateur avec cet email introuvable',
        HttpStatus.NOT_FOUND,
      );
    }

    const otp = getRandomInt(10000, 99999).toString();

    await this.prismaService.user.update({
      where: {
        email: user.username,
      },
      data: { otp },
    });

    this.notifService.sendEmail({
      email: user.username,
      object: 'Reset password',
      body: NOTIFICATION_MESSAGES.getResetPasswordCodeMail({
        email: user.username,
        otp,
      }),
      sender: 'SNB',
    });

    return {
      statusCode: 200,
      message: 'Code OTP envoyé par mail',
    };

    //throw new Error('Method not implemented.');
  }

  async resetPasswordWithOtp(data: UserResetPasswordOtp) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: data.username,
      },
    });

    if (!userExist) {
      throw new HttpException(
        'Utilisateur avec cet email introuvable',
        HttpStatus.NOT_FOUND,
      );
    }

    const token = await this.getResetPasswordToken({ username: data.username });

    await this.resetPassword({
      token: token.token,
      username: data.username,
      password: data.password,
    });
    return {
      statusCode: 200,
      message: 'OK',
    };
  }

  async verifyOtpCode(data: VerifyOtpDto) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: data.username,
      },
    });

    if (!userExist) {
      throw new HttpException(
        'Utilisateur avec cet email introuvable',
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        email: data.username,
        otp: data.otp,
      },
    });

    if (!user)
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    return {
      statusCode: 200,
      message: 'OK',
    };
  }
}
