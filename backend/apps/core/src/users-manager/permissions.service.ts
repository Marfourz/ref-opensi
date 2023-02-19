import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';
import { createPermissionDto } from './permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly httpService: HttpService) {}

  createPermission(permission: createPermissionDto) {
    const newPermission = this.httpService
      .post(`/permissions`, permission)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return newPermission;
  }

  getAllPermissions() {
    const allPermissions = this.httpService
      .get(`/permissions`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return allPermissions;
  }

  deletePermission(id: string) {
    const data = this.httpService
      .delete(`/permissions/${id}`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );

    return data;
  }
}
