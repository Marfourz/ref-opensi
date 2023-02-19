import { Injectable } from '@nestjs/common';
import {
  UserLoginDto,
  UserRegisterDto,
  UserGetResetDto,
  UserResetPasswordDto,
  UserUpdateDto,
  UserChangePasswordDto,
} from './users.dto';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

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

  me(token: string) {
    const me = this.httpService
      .get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

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
    const registeredUser = this.httpService
      .post('/users', user)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

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
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return data;
  }

  resetPassword(user: UserResetPasswordDto, token) {
    const data = this.httpService
      .post(`/passwords/reset/${token}`, user)
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
}
