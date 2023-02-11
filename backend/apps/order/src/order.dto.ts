import { OrderStatusEnum } from '@prisma/client';
import { IsString, IsNumber, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class orderDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ type: String })
  @IsString()
  organisationId: string;

  @ApiProperty({ type: String })
  @IsString()
  deliveryCode: string;

  @ApiProperty({ type: String })
  @IsString()
  deliveryMan: string;

  @ApiProperty({ enum: OrderStatusEnum })
  @IsString()
  status: string;

  @ApiProperty({ type: String })
  @IsString()
  @Matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: '$property format must be YYYY-MM-DD',
  })
  deliveryDate: string;
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
