import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MetricService } from './metric.service';
import { Stock } from '@prisma/client';
import { ApiTags, ApiParam, ApiHeader } from '@nestjs/swagger';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

@ApiTags('Métrics SNB')
@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get(':orgId/performance/:prodId')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'orgId' })
  @ApiParam({ name: 'prodId' })
  getProductPerformance(@Param() params): Promise<Stock[]> {
    return this.metricService.getProductPerformance(
      params.orgId,
      params.prodId,
    );
  }
}
