import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from '@prisma/client';
import { walletDto, updateWalletDto } from './wallet.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: walletDto })
  @ApiCreatedResponse({
    description: 'The wallet has been successfully created.',
  })
  createWallet(@Body() wallet: walletDto): Promise<Wallet> {
    return this.walletService.createWallet(wallet);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllWallets(): Promise<Wallet[]> {
    return this.walletService.getAllWallets();
  }

  @Get(':orgId')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'orgId' })
  getSingleWallet(@Param() params): Promise<Wallet> {
    return this.walletService.getSingleWallet(params.orgId);
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: updateWalletDto })
  @ApiOkResponse({
    description: 'The wallet has been successfully updated.',
  })
  updateSingleWallet(
    @Param() params,
    @Body() update: updateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.updateSingleWallet(params.id, update);
  }

  @Delete(':id')
  //@Roles(Role.ADMINISTRATOR, Role.SUPER_USER, Role.ACCOUNTANT)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleWallet(@Param() params): Promise<Wallet> {
    return this.walletService.deleteSingleWallet(params.id);
  }
}
