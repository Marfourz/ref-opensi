import { OrderStatusEnum } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  Matches,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { itemOrderDto } from '../item-order/item-order.dto';

export class orderDto {
  @ApiProperty({ type: String })
  organisationId?: string;

  @ApiProperty()
  @IsArray()
  items: itemOrder[];
}

class itemOrder {
  @ApiProperty({ type: String })
  @IsString()
  productId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;
}

export class updateOrderDto {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  organisationId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  deliveryCode?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  deliveryMan?: string;

  @ApiProperty({ enum: OrderStatusEnum })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: '$property format must be YYYY-MM-DD',
  })
  deliveryDate?: string;
}

export class assignOrderDto {
  @ApiProperty({ type: String })
  @IsString()
  deliveryMan: string;
}
