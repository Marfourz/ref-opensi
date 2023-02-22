import { ApiProperty } from '@nestjs/swagger';
import { PackagingTypeEnum } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class productDto {
  @ApiProperty({ type: String })
  @IsString()
  categoryId: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsString()
  unitPrice: number;

  @ApiProperty({ enum: PackagingTypeEnum })
  @IsString()
  packagingType: PackagingTypeEnum;

  @ApiProperty({ type: Number })
  @IsString()
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
