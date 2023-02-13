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
  getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }

  @Post()
  @ApiBody({ type: createPermissionDto })
  @ApiCreatedResponse({
    description: 'The permission has been successfully created.',
  })
  createPermissions(@Body() permission: createPermissionDto) {
    return this.permissionsService.createPermission(permission);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deletePermission(@Param() params) {
    return this.permissionsService.deletePermission(params.id);
  }
}
