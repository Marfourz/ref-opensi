import {
  SexEnum,
  UserRoleEnum,
  UserPermissionEnum,
  UserStatusEnum,
} from '@prisma/client';
import { IsString, Matches, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userDto {
  @ApiProperty()
  @IsOptional()
  organisationId?: string;

  @ApiProperty()
  engineId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: '$property format must be YYYY-MM-DD',
  })
  birthday: string;

  @ApiProperty({ type: String })
  sex: SexEnum;

  @ApiProperty({ enum: UserStatusEnum })
  status: UserStatusEnum;

  @ApiProperty({ type: String })
  role: UserRoleEnum;

  @ApiProperty({ type: String })
  permission: UserPermissionEnum;
}

export class updateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, {
    message: '$property format must be YYYY-MM-DD',
  })
  birthday?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  sex?: SexEnum;

  @ApiProperty({ enum: UserStatusEnum })
  @IsOptional()
  status: UserStatusEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  role?: UserRoleEnum;

  @ApiProperty({ type: String })
  @IsOptional()
  permission?: UserPermissionEnum;
}
