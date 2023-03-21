import {
  Body,
  Param,
  Controller,
  Put,
  Post,
  Get,
  Delete,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { Receipt } from '@prisma/client';
import { receiptDto, updateReceiptDto } from './receipt.dto';
import {
  ApiTags,
  ApiHeader,
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Reçus')
@Controller('receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @ApiBody({ type: receiptDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The receipt has been successfully created.',
  })
  createReceipt(@Body() receipt: receiptDto): Promise<Receipt> {
    return this.receiptService.createReceipt(receipt);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllReceipts(): Promise<Receipt[]> {
    return this.receiptService.getAllReceipts();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getSingleReceipt(@Param() params): Promise<Receipt> {
    return this.receiptService.getSingleReceipt(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: updateReceiptDto })
  @ApiOkResponse({
    description: 'The receipt has been successfully updated.',
  })
  updateSingleReceipt(
    @Param() params,
    @Body() update: updateReceiptDto,
  ): Promise<Receipt> {
    return this.receiptService.updateSingleReceipt(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  deleteSingleReceipt(@Param() params): Promise<Receipt> {
    return this.receiptService.deleteSingleReceipt(params.id);
  }
}
