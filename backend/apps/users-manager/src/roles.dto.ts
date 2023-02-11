import { IsArray, IsOptional, IsString } from 'class-validator';

export class createRoleDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsArray()
  permissions?: string[];
}

export class updateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
