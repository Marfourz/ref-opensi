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
} from '@nestjs/swagger';
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Post()
  @ApiBody({ type: createRoleDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  createRole(@Body() role: createRoleDto) {
    return this.rolesService.createRole(role);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleRole(@Param() params) {
    return this.rolesService.getSingleRole(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateRoleDto })
  updateOneRole(@Param() params, @Body() update: updateRoleDto) {
    return this.rolesService.updateOneRole(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteRole(@Param() params) {
    return this.rolesService.deleteRole(params.id);
  }
}
