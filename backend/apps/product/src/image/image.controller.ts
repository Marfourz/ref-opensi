import {
  Body,
  Param,
  Controller,
  Res,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from '@prisma/client';
import { FileUploadDto } from './image.dto';
import {
  ApiTags,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFileName, getProductImageLink } from './image.helper';
import { PRODUCT_IMAGES_DEST } from './image.constant';


@ApiTags('product-image')
@Controller('product-image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: PRODUCT_IMAGES_DEST,
        filename: editFileName,
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiCreatedResponse({
    description: 'The image of product has been successfully updated.',
  })
  uploadNewProductImage(
    @Body() body: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    const image = {
      url: getProductImageLink(file.filename),
      productId: body.productId,
    };
    return this.imageService.uploadNewProductImage(image);
  }

  @Get(':imgpath')
  @ApiParam({ name: 'imgpath' })
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: PRODUCT_IMAGES_DEST });
  }
  //0303be01-d7b9-462b-ad68-2af4240ff58a
}
