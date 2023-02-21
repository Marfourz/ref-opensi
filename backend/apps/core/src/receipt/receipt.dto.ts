import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class receiptDto {
  @ApiProperty({ type: String })
  @IsString()
  invoiceId: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  receiveNumber: number;
}

export class updateReceiptDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  receiveNumber?: number;
}
