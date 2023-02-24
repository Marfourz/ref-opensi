import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory, Product } from '@prisma/client';
import { categoryDto, updateCategoryDto } from './product-category.dto';
import { PagiationPayload } from 'types';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product-category')
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @ApiBody({ type: categoryDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The product category has been successfully created.',
  })
  createCategory(@Body() category: categoryDto): Promise<ProductCategory> {
    return this.productCategoryService.createCategory(category);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  getAllCategories(
    @Query() filterParams: any,
  ): Promise<PagiationPayload<ProductCategory[]>> {
    return this.productCategoryService.getAllCategories(filterParams);
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleCategory(@Param() params): Promise<ProductCategory> {
    return this.productCategoryService.getSingleCategory(params.id);
  }

  @Get(':id/products')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  getProductsOfCategory(
    @Param() params,
    @Query() filterParams: any,
    @Req() req,
  ): Promise<PagiationPayload<Product[]>> {
    return this.productCategoryService.getProductsOfCategory(
      params.id,
      req.user.orgId,
      filterParams,
    );
  }

  @Put(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateCategoryDto })
  @ApiOkResponse({
    description: 'The product category has been successfully updated.',
  })
  updateSingleCategory(
    @Param() params,
    @Body() update: updateCategoryDto,
  ): Promise<ProductCategory> {
    return this.productCategoryService.updateSingleCategory(params.id, update);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleCategory(@Param() params): Promise<ProductCategory> {
    return this.productCategoryService.deleteSingleCategory(params.id);
  }
}
