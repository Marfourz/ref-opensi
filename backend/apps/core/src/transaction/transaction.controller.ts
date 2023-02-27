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
  ApiHeader,
} from '@nestjs/swagger';
import { transactionDto, updateTransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiBody({ type: transactionDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The transaction has been successfully created.',
  })
  createTransaction(@Body() transaction: transactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(transaction);
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getSingleTransaction(@Param() params): Promise<Transaction> {
    return this.transactionService.getSingleTransaction(params.id);
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: updateTransactionDto })
  updateSingleTransaction(
    @Param() params,
    @Body() update: updateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateSingleTransaction(params.id, update);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleTransaction(@Param() params): Promise<Transaction> {
    return this.transactionService.deleteSingleTransaction(params.id);
  }
}
