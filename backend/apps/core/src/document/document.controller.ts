import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Téléchargement de documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('generate-invoice/:ordId')
  @ApiParam({ name: 'ordId' })
  generateDocument(@Param() params) {
    return this.documentService.generateInvoiceDocument(params.ordId);
  }

  @Get('download-orders/:id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  downloadOrders(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadOrders(filterParams, params.id);
  }

  @Get('download-users/:id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  downloadUsers(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadUsers(filterParams, params.id);
  }

  @Get('download-deliveryMen/:id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  downloadDeliveryMen(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadDeliveryMen(filterParams, params.id);
  }

  @Get('download-stocks/:id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  downloadStocks(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadStocks(filterParams, params.id);
  }

  @Get('download-products/:id')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  downloadProducts(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadProducts(filterParams);
  }

  @Get('download-products-category')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  downloadCategories(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadCategories(filterParams);
  }
}
