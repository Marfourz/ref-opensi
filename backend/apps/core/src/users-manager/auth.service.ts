import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  UserLoginDto,
  UserRegisterDto,
  UserGetResetDto,
  UserResetPasswordDto,
  UserUpdateDto,
  UserChangePasswordDto,
} from './auth.dto';
import { HttpService } from '@nestjs/axios';
import { generateRandomString } from 'helpers/generateRandomString';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
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
          include: { organisation: true },
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
        throw new HttpException(
          "Quelque chose s'est mal passé",
          HttpStatus.UNAUTHORIZED,
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
}
