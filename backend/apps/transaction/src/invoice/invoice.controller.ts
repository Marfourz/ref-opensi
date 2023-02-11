import {
  Body,
  Param,
  Controller,
  Put,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from '@prisma/client';
import { invoiceDto, updateInvoiceDto } from './invoice.dto';
import {
  ApiTags,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiBody({ type: invoiceDto })
  @ApiCreatedResponse({
    description: 'The invoice has been successfully created.',
  })
  createInvoice(@Body() invoice: invoiceDto): Promise<Invoice> {
    return this.invoiceService.createInvoice(invoice);
  }

  @Get()
  getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleInvoice(@Param() params): Promise<Invoice> {
    return this.invoiceService.getSingleInvoice(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateInvoiceDto })
  @ApiOkResponse({
    description: 'The invoice has been successfully updated.',
  })
  updateSingleInvoice(
    @Param() params,
    @Body() update: updateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceService.updateSingleInvoice(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteSingleInvoice(@Param() params): Promise<Invoice> {
    return this.invoiceService.deleteSingleInvoice(params.id);
  }
}
