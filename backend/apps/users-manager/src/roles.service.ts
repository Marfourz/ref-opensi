import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';
import { createRoleDto, updateRoleDto } from './roles.dto';

@Injectable()
export class RolesService {
  constructor(private readonly httpService: HttpService) {}

  createRole(role: createRoleDto) {
    const createdRole = this.httpService
      .post(`/roles`, role)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return createdRole;
  }

  getSingleRole(id: string) {
    const role = this.httpService
      .get(`/roles/${id}`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return role;
  }

  deleteRole(id: any) {
    const data = this.httpService
      .delete(`/roles/${id}`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return data;
  }

  getAllRoles() {
    const allRoles = this.httpService
      .get(`/roles`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return allRoles;
  }

  updateOneRole(id: string, update: updateRoleDto) {
    const data = this.httpService
      .put(`/roles/${id}`, update)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return data;
  }
}
