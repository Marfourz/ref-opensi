import { OrganisationStatusEnum, OrganisationTypeEnum } from '@prisma/client';
import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class organisationDto {
  @ApiProperty({ enum: OrganisationTypeEnum })
  @IsString()
  type: OrganisationTypeEnum;

  @ApiProperty({ type: String })
  @IsString()
  socialReason: string;

  @ApiProperty({ type: String })
  @IsString()
  fiscalId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  parentOrganisationId: string;

  @ApiProperty({ type: String })
  @IsString()
  phone: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  adress: string;

  @ApiProperty({ type: String })
  @IsString()
  ownerName: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  paymentDeadline: number;

  @ApiProperty({ enum: OrganisationStatusEnum })
  @IsString()
  @IsOptional()
  status: OrganisationStatusEnum;
}

export class updateOrganisationDto {
  @ApiProperty({ enum: OrganisationTypeEnum })
  @IsOptional()
  type?: OrganisationTypeEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  socialReason?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  fiscalId?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  parentOrganisationId: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  adress?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  ownerName?: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  paymentDeadline?: number;

  @ApiProperty({ enum: OrganisationStatusEnum })
  @IsOptional()
  @IsString()
  status: OrganisationStatusEnum;
}
