import { Injectable } from '@nestjs/common';
import {
  UserLoginDto,
  UserRegisterDto,
  UserGetResetDto,
  UserResetPasswordDto,
  UserUpdateDto,
  UserChangePasswordDto,
} from './auth.dto';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';
import { generateRandomString } from 'helpers/generateRandomString';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService,
    private readonly prismaService: PrismaService) {}

  allUsers() {
    const users = this.httpService
      .get('/users')
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return users;
  }

  async me(token: string) {
    const me = this.httpService
      .get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .toPromise()
      .then(async (res) => {
        const user = await this.prismaService.user.findUnique({
          where: { email: res.data.email },
        });
        console.log("user test",{...res.data,role : user.role});
        return user;
      })
      .catch((err) => {
        throw err;
      });

    return me;
  }

  login(user: UserLoginDto) {
    const logededUser = this.httpService
      .post('/users/sign_in', {
        username: user.username,
        password: user.password,
      })
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

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
        throw err;
      });

    return registeredUser;
  }

  getSingleUser(id: string) {
    const singleUser = this.httpService
      .get(`/users/${id}`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

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
        throw err;
      });

    return data;
  }

  resetPassword(user: UserResetPasswordDto) {
    const data = this.httpService
      .post(`/passwords/reset/${user.token}`, user)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return data;
  }

  updateUser(update: UserUpdateDto, id: string) {
    const data = this.httpService
      .put(`/users/${id}`, update)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return data;
  }

  changePassword(update: UserChangePasswordDto, userId: any) {
    const data = this.httpService
      .put(`/users/${userId}/password`, update)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

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
        throw err;
      });

    return data;
  }
}
