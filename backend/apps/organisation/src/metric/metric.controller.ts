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

@ApiTags('metrics')
@Controller('metrics')
export class StockController {
  constructor(private readonly metricService: MetricService) {}

  @Get(':orgId/performance/:prodId')
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
