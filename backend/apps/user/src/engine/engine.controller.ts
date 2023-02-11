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
} from '@nestjs/swagger';

@ApiTags('engines')
@Controller('engines')
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Post()
  @ApiBody({ type: engineDto })
  @ApiCreatedResponse({
    description: 'The engine has been successfully created.',
  })
  createEngine(@Body() engine: engineDto): Promise<Engine> {
    return this.engineService.createEngine(engine);
  }

  @Get()
  getAllEngines(): Promise<Engine[]> {
    return this.engineService.getAllEngines();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleEngine(@Param() params): Promise<Engine> {
    return this.engineService.getSingleEngine(params.id);
  }

  @Put(':id')
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
  @ApiParam({ name: 'id' })
  deleteSingleEngine(@Param() params): Promise<Engine> {
    return this.engineService.deleteSingleEngine(params.id);
  }
}
