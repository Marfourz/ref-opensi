import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from '@prisma/client';
import { OrderTypeEnum } from 'guards/order.type.enum';
import { stockDto, updateStockDto } from './stock.dto';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

import { PagiationPayload } from 'types';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  //@Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.COMMERCIAL)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: stockDto })
  @ApiCreatedResponse({
    description: 'The stock has been successfully created.',
  })
  createStock(@Body() stock: stockDto): Promise<Stock> {
    return this.stockService.createStock(stock);
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.COMMERCIAL)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleStock(@Param() params): Promise<Stock> {
    return this.stockService.getSingleStock(params.id);
  }

  @Get(':orgId/search')
  //@Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.COMMERCIAL)
  @ApiParam({ name: 'orgId' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  searchForStocksOfOrganisation(
    @Query() filterParams: any,
    @Param() params,
  ): Promise<PagiationPayload<Stock[]>> {
    return this.stockService.searchForStocksOfOrganisation(
      filterParams,
      params.orgId,
    );
  }

  @Get(':orgId/generalInfos')
  //@Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.COMMERCIAL)
  @ApiParam({ name: 'orgId' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getStockGeneralInfos(@Param() params): any {
    return this.stockService.getStockGeneralInfos(params.orgId);
  }

  /*@Put(':id')
  //@Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.COMMERCIAL)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateStockDto })
  @ApiOkResponse({
    description: 'The stock has been successfully updated.',
  })
  updateSingleStock(
    @Param() params,
    @Body() update: updateStockDto,
  ): Promise<Stock> {
    return this.stockService.updateSingleStock(params.id, update);
  }*/

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.COMMERCIAL)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleStock(@Param() params): Promise<Stock> {
    return this.stockService.deleteSingleStock(params.id);
  }
}
