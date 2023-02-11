import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { orderDto, updateOrderDto } from './order.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: orderDto })
  @ApiCreatedResponse({
    description: 'The order has been successfully created.',
  })
  createOrder(@Body() order: orderDto): Promise<Order> {
    return this.orderService.createOrder(order);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleOrder(@Param() params): Promise<Order> {
    return this.orderService.getSingleOrder(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateSingleOrder(
    @Param() params,
    @Body() update: updateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateSingleOrder(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteSingleOrder(@Param() params): Promise<Order> {
    return this.orderService.deleteSingleOrder(params.id);
  }
}
