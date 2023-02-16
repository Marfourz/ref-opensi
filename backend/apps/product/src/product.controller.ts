import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { productDto, updateProductDto } from './product.dto';
import { Product, Image, Stock } from '@prisma/client';
import { OrderTypeEnum } from 'guards/order.type.enum';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: productDto })
  @ApiCreatedResponse({
    description: 'The product has been successfully created.',
  })
  createProduct(@Body() product: productDto): Promise<Product> {
    return this.productsService.createProduct(product);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get('/search')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'order', enum: OrderTypeEnum, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'rackPrice', type: Number, required: false })
  @ApiQuery({ name: 'prodId', type: String, required: false })
  searchForProducts(@Query() filterParams: any): Promise<any[]> {
    return this.productsService.searchForProducts(filterParams);
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleProduct(@Param() params): Promise<Product> {
    return this.productsService.getSingleProduct(params.id);
  }

  @Get(':id/images')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getAllProductImage(@Param() params): Promise<Image[]> {
    return this.productsService.getAllProductImage(params.id);
  }

  @Get(':id/stocks')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getAllStocksOfProduct(@Param() params): Promise<Stock[]> {
    return this.productsService.getAllStocksOfProduct(params.id);
  }

  @Put(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateProductDto })
  @ApiOkResponse({
    description: 'The product category has been successfully updated.',
  })
  updateSingleCategory(
    @Param() params,
    @Body() update: updateProductDto,
  ): Promise<Product> {
    return this.productsService.updateSingleCategory(params.id, update);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleProduct(@Param() params): Promise<Product> {
    return this.productsService.deleteSingleProduct(params.id);
  }
}
