import { Controller, Get, Body, Post, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { createPermissionDto } from './permissions.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }

  @Post()
  createPermissions(@Body() permission: createPermissionDto) {
    return this.permissionsService.createPermission(permission);
  }

  @Delete(':id')
  deletePermission(@Param() params) {
    return this.permissionsService.deletePermission(params.id);
  }
}
