import { ActionEnum, ModelNameEnum } from '@prisma/client';
import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class activityDto {
  @ApiProperty({ type: String })
  @IsString()
  actorId: string;

  @ApiProperty({ enum: ActionEnum })
  @IsString()
  action: ActionEnum;

  @ApiProperty({ enum: ModelNameEnum })
  @IsString()
  modelName: ModelNameEnum;
}

export class updateActivityDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiProperty({ enum: ActionEnum })
  @IsOptional()
  @IsString()
  action?: ActionEnum;

  @ApiProperty({ enum: ModelNameEnum })
  @IsOptional()
  @IsString()
  modelName?: ModelNameEnum;
}
