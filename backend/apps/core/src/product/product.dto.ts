import { ApiProperty } from '@nestjs/swagger';
import { PackagingTypeEnum } from '@prisma/client';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class productDto {
  @ApiProperty({ type: String })
  @IsString()
  categoryId: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  bulkPrice: number;

  @ApiProperty({ enum: PackagingTypeEnum })
  @IsString()
  packagingType: PackagingTypeEnum;

  @ApiProperty({ type: Number })
  @IsNumber()
  volume: number;
}

export class updateProductDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  categoryId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsString()
  unitPrice: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsString()
  rackPrice: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsString()
  packPrice: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsString()
  volume: number;
}
