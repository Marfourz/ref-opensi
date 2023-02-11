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
} from '@nestjs/swagger';

@ApiTags('item-order')
@Controller('item-order')
export class ItemOrderController {
  constructor(private readonly itemOrderService: ItemOrderService) {}

  @Post()
  @ApiBody({ type: itemOrderDto })
  @ApiCreatedResponse({
    description: 'The item order has been successfully created.',
  })
  createItem(@Body() category: itemOrderDto): Promise<ItemOrder> {
    return this.itemOrderService.createItem(category);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleItemOrder(@Param() params): Promise<ItemOrder> {
    return this.itemOrderService.getSingleItemOrder(params.id);
  }

  @Put(':id')
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
  @ApiParam({ name: 'id' })
  deleteSingleItem(@Param() params): Promise<ItemOrder> {
    return this.itemOrderService.deleteSingleItem(params.id);
  }
}
