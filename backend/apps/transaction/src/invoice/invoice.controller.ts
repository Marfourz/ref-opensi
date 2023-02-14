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
  ApiHeader,
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
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The invoice has been successfully created.',
  })
  createInvoice(@Body() invoice: invoiceDto): Promise<Invoice> {
    return this.invoiceService.createInvoice(invoice);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleInvoice(@Param() params): Promise<Invoice> {
    return this.invoiceService.getSingleInvoice(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
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
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  deleteSingleInvoice(@Param() params): Promise<Invoice> {
    return this.invoiceService.deleteSingleInvoice(params.id);
  }
}
