import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatusEnum } from '@prisma/client';
import { OrderTypeEnum } from 'guards/order.type.enum';
import { orderDto, updateOrderDto } from './order.dto';
import { PagiationPayload } from 'types';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { NonSnbOrganisations } from '../../../../types/index';
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
  createOrder(@Req() req, @Body() order: orderDto): Promise<Order> {
    return this.orderService.createOrder(order, req.user.userId);
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

  @Get('getOrders/:type')
  @ApiParam({ name: 'type', enum: NonSnbOrganisations })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getOrdersOfOrganisations(@Param() params): Promise<Order[]> {
    console.log('type sucre', params.type);
    return this.orderService.getOrdersOfOrganisations(params.type);
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
