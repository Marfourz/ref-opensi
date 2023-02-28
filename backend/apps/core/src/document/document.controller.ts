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
}
