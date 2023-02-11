import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class imageDto {
  @ApiProperty({ type: String })
  @IsString()
  productId: string;

  @ApiProperty({ type: String })
  @IsString()
  url: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ type: String })
  @IsString()
  productId: string;
}

export class SampleDto {
  name: string;
}
