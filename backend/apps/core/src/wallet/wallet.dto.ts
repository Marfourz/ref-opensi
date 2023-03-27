import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class walletDto {
  @ApiProperty({ type: String })
  @IsString()
  organisationId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  turnover: number;
}

export class updateWalletDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  organisationId?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  turnover?: number;
}
