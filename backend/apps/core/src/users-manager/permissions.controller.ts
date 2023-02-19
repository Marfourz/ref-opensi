import { Controller, Get, Body, Post, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { createPermissionDto } from './permissions.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }

  @Post()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: createPermissionDto })
  @ApiCreatedResponse({
    description: 'The permission has been successfully created.',
  })
  createPermissions(@Body() permission: createPermissionDto) {
    return this.permissionsService.createPermission(permission);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deletePermission(@Param() params) {
    return this.permissionsService.deletePermission(params.id);
  }
}
