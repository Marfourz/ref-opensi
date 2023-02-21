import { Controller, Get, Param, Body } from '@nestjs/common';
import { DocumentService } from './document.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('generate-receipt/:id')
  @ApiParam({ name: 'id' })
  generateDocument(@Param() params) {
    return this.documentService.generateDocument(params.id);
  }
}
