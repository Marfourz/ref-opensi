import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from '@prisma/client';
import { stockDto, updateStockDto } from './stock.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
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
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleStock(@Param() params): Promise<Stock> {
    return this.stockService.getSingleStock(params.id);
  }

  @Put(':id')
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
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleStock(@Param() params): Promise<Stock> {
    return this.stockService.deleteSingleStock(params.id);
  }
}
