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
import { Order } from '@prisma/client';
import { orderDto, updateOrderDto, assignOrderDto } from './order.dto';
import { PagiationPayload } from 'types';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
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
  //@Roles(Role.ACCOUNTANT, Role.COMMERCIAL, Role.SUPER_USER)
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
  @ApiQuery({ name: 'q', type: String, required: false })
  searchForOrdersOfOrganisation(
    @Query() filterParams: any,
    @Param() params,
  ): Promise<PagiationPayload<Order[]>> {
    return this.orderService.searchForOrdersOfOrganisation(
      filterParams,
      params.orgId,
    );
  }

  @Get('getOrders/:orgId')
  //@Roles(Role.ACCOUNTANT, Role.COMMERCIAL, Role.SUPER_USER)
  @ApiParam({ name: 'orgId' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getOrdersOfSubOrganisations(@Param() params): Promise<Order[]> {
    return this.orderService.getOrdersOfSubOrganisations(params.orgId);
  }

  @Put('/:orderId/assignTo/:deliveryManId')
  //@Roles(Role.ACCOUNTANT, Role.COMMERCIAL, Role.SUPER_USER)
  @ApiParam({ name: 'orderId' })
  @ApiParam({ name: 'deliveryManId' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  assignOrder(@Param() params): Promise<Order> {
    return this.orderService.assignOrder(params.orderId, params.deliveryManId);
  }

  @Put(':id')
  @Roles(Role.ACCOUNTANT, Role.COMMERCIAL, Role.SUPER_USER)
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
  @Roles(Role.ACCOUNTANT, Role.COMMERCIAL, Role.SUPER_USER)
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  deleteSingleOrder(@Param() params): Promise<Order> {
    return this.orderService.deleteSingleOrder(params.id);
  }
}
