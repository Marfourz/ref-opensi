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
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
@ApiTags('Gestion des utilisateurs - Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Post()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: createRoleDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  createRole(@Body() role: createRoleDto) {
    return this.rolesService.createRole(role);
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleRole(@Param() params) {
    return this.rolesService.getSingleRole(params.id);
  }

  @Put(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateRoleDto })
  updateOneRole(@Param() params, @Body() update: updateRoleDto) {
    return this.rolesService.updateOneRole(params.id, update);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteRole(@Param() params) {
    return this.rolesService.deleteRole(params.id);
  }
}
