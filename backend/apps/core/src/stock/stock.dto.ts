import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class stockDto {
  @ApiProperty({ type: String })
  @IsString()
  organisationId: string;

  @ApiProperty({ type: String })
  @IsString()
  productId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  originalQuantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  currentQuantity: number;
}

export class updateStockDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  currentQuantity: number;
}
