import { Controller, Get, Param, Query } from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('generate-receipt/:id')
  @ApiParam({ name: 'id' })
  generateDocument(@Param() params) {
    return this.documentService.generateReceiptDocument(params.id);
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

  @Get('download-stocks/:id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'categoryId', type: String, required: false })
  downloadStocks(@Param() params, @Query() filterParams: any) {
    return this.documentService.downloadStocks(filterParams, params.id);
  }
}
