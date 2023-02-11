import { IsString } from 'class-validator';

export class createPermissionDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;
}
