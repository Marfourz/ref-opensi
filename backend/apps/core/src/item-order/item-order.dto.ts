import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class itemOrderDto {
  @ApiProperty({ type: String })
  @IsString()
  orderId: string;

  @ApiProperty({ type: String })
  @IsString()
  productId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  price: number;
}

export class updateItemOrderDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  price?: number;
}
