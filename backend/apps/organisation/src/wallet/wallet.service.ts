import { Injectable } from '@nestjs/common';
import { Wallet } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { walletDto, updateWalletDto } from './wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(wallet: walletDto): Promise<Wallet> {
    try {
      const newWallet = await this.prisma.wallet.create({
        data: wallet,
      });
      return newWallet;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllWallets(): Promise<Wallet[]> {
    try {
      const stock = await this.prisma.wallet.findMany({
        include: { organisation: true, transactions: true },
      });
      return stock;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleWallet(id: string): Promise<Wallet> {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { id },
        include: {
          organisation: true,
          transactions: true,
        },
      });
      return wallet;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleWallet(
    id: string,
    update: updateWalletDto,
  ): Promise<Wallet> {
    try {
      const updatedWallet = await this.prisma.wallet.update({
        where: { id },
        data: update,
      });
      return updatedWallet;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleWallet(id: string): Promise<Wallet> {
    try {
      const deletedWallet = await this.prisma.wallet.delete({
        where: { id },
      });
      return deletedWallet;
    } catch (error) {
      throw error;
      return;
    }
  }
}
