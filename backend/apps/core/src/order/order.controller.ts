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
import { OrderService } from './order.service';
import { Order, OrderStatusEnum } from '@prisma/client';
import { OrderTypeEnum } from 'guards/order.type.enum';
import { orderDto, updateOrderDto } from './order.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({ type: orderDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The order has been successfully created.',
  })
  createOrder(@Body() order: orderDto): Promise<Order> {
    return this.orderService.createOrder(order);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getSingleOrder(@Param() params): Promise<Order> {
    return this.orderService.getSingleOrder(params.id);
  }

  @Get(':orgId/search')
  @ApiParam({ name: 'orgId' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'orderId', type: String, required: false })
  @ApiQuery({ name: 'totalAmount', type: Number, required: false })
  @ApiQuery({ name: 'order', enum: OrderTypeEnum, required: false })
  @ApiQuery({ name: 'status', enum: OrderStatusEnum, required: false })
  searchForOrdersOfOrganisation(
    @Query() filterParams: any,
    @Param() params,
  ): Promise<Order[]> {
    return this.orderService.searchForOrdersOfOrganisation(
      filterParams,
      params.orgId,
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  updateSingleOrder(
    @Param() params,
    @Body() update: updateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateSingleOrder(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  deleteSingleOrder(@Param() params): Promise<Order> {
    return this.orderService.deleteSingleOrder(params.id);
  }
}
