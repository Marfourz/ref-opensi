import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { transactionDto, updateTransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBody({ type: transactionDto })
  @ApiCreatedResponse({
    description: 'The transaction has been successfully created.',
  })
  createTransaction(@Body() transaction: transactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(transaction);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleTransaction(@Param() params): Promise<Transaction> {
    return this.transactionService.getSingleTransaction(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateTransactionDto })
  updateSingleTransaction(
    @Param() params,
    @Body() update: updateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateSingleTransaction(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteSingleTransaction(@Param() params): Promise<Transaction> {
    return this.transactionService.deleteSingleTransaction(params.id);
  }
}
