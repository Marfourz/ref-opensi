import { IsString, IsEmail, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class emailDto {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  object: string;

  @ApiProperty({ type: String })
  @IsString()
  body: string;

  @ApiProperty({ type: String })
  @IsString()
  sender: string;
}

export class smsDto {
  @ApiProperty({ type: String })
  @IsString()
  to: string;

  @ApiProperty({ type: String })
  @IsString()
  body: string;

  @ApiProperty({ type: String })
  @IsString()
  sender: string;
}
