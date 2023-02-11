import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { createRoleDto, updateRoleDto } from './roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Post()
  createRole(@Body() role: createRoleDto) {
    return this.rolesService.createRole(role);
  }

  @Get(':id')
  getSingleRole(@Param() params) {
    return this.rolesService.getSingleRole(params.id);
  }

  @Put(':id')
  updateOneRole(@Param() params, @Body() update: updateRoleDto) {
    return this.rolesService.updateOneRole(params.id, update);
  }

  @Delete(':id')
  deleteRole(@Param() params) {
    return this.rolesService.deleteRole(params.id);
  }
}
