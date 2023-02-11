import { TransactionStatusEnum, PaymentMethodEnum } from '@prisma/client';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class transactionDto {
  @ApiProperty({ type: String })
  @IsString()
  kkiapayId: string;

  @ApiProperty({ type: String })
  @IsString()
  walletId: string;

  @ApiProperty({ type: String })
  @IsString()
  orderId: string;

  @ApiProperty({ type: String })
  @IsString()
  organisationId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: TransactionStatusEnum })
  @IsString()
  status: TransactionStatusEnum;

  @ApiProperty({ enum: PaymentMethodEnum })
  @IsString()
  paymentMethod: PaymentMethodEnum;
}

export class updateTransactionDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  kkiapayId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  walletId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  organisationId?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ enum: TransactionStatusEnum })
  @IsOptional()
  @IsString()
  status?: TransactionStatusEnum;

  @ApiProperty({ enum: PaymentMethodEnum })
  @IsOptional()
  @IsString()
  paymentMethod?: PaymentMethodEnum;
}
