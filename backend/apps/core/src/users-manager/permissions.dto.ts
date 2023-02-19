import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createPermissionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  description: string;
}
