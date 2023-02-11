import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class engineDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;
}

export class updateEngineDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description?: string;
}
