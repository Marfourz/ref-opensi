import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ItemOrderService } from './item-order.service';
import { ItemOrder, Order } from '@prisma/client';
import { itemOrderDto, updateItemOrderDto } from './item-order.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('item-order')
@Controller('item-order')
export class ItemOrderController {
  constructor(private readonly itemOrderService: ItemOrderService) {}

  @Post()
  @ApiBody({ type: itemOrderDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The item order has been successfully created.',
  })
  createItem(@Body() category: itemOrderDto): Promise<ItemOrder> {
    return this.itemOrderService.createItem(category);
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleItemOrder(@Param() params): Promise<ItemOrder> {
    return this.itemOrderService.getSingleItemOrder(params.id);
  }

  @Put(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateItemOrderDto })
  @ApiOkResponse({
    description: 'The item order has been successfully updated.',
  })
  updateSingleItemOrder(
    @Param() params,
    @Body() update: updateItemOrderDto,
  ): Promise<ItemOrder> {
    return this.itemOrderService.updateSingleItemOrder(params.id, update);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleItem(@Param() params): Promise<ItemOrder> {
    return this.itemOrderService.deleteSingleItem(params.id);
  }
}
