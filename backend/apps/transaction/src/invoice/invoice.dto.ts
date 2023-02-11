import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceStatusEnum } from '@prisma/client';

export class invoiceDto {
  @ApiProperty({ type: String })
  @IsString()
  transactionId: string;

  @ApiProperty({ type: String })
  @IsString()
  orderId: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  invoiceNumber: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ type: String })
  @IsString()
  source: string;

  @ApiProperty({ type: String })
  @IsString()
  destination: string;

  @ApiProperty({ enum: InvoiceStatusEnum })
  @IsString()
  status: InvoiceStatusEnum;
}

export class updateInvoiceDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  invoiceNumber?: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({ enum: InvoiceStatusEnum })
  @IsOptional()
  @IsString()
  status?: InvoiceStatusEnum;
}
