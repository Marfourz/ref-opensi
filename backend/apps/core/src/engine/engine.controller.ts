import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EngineService } from './engine.service';
import { Engine } from '@prisma/client';
import { engineDto, updateEngineDto } from './engine.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

@ApiTags('Engins')
@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiBody({ type: engineDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The engine has been successfully created.',
  })
  createEngine(@Body() engine: engineDto): Promise<Engine> {
    return this.engineService.createEngine(engine);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllEngines(): Promise<Engine[]> {
    return this.engineService.getAllEngines();
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleEngine(@Param() params): Promise<Engine> {
    return this.engineService.getSingleEngine(params.id);
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateEngineDto })
  @ApiOkResponse({
    description: 'The engine has been successfully created.',
  })
  updateSingleEngine(
    @Param() params,
    @Body() update: updateEngineDto,
  ): Promise<Engine> {
    return this.engineService.updateSingleEngine(params.id, update);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleEngine(@Param() params): Promise<Engine> {
    return this.engineService.deleteSingleEngine(params.id);
  }
}
