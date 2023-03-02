import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  Organisation,
  User,
  OrganisationTypeEnum,
  UserStatusEnum,
} from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import { PrismaService } from 'libs/prisma/src';
import { NonSnbOrganisations, PagiationPayload } from 'types';
import { UserRoleEnum } from '@prisma/client';
import { WalletService } from '../wallet/wallet.service';
import { AuthService } from '../users-manager/auth.service';
import { NotificationService } from 'apps/notification/src/notification.service';
import { Role } from '../../../../guards/roles.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class OrganisationService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private authService: AuthService,
    private notifService: NotificationService,
    private userService: UserService,
  ) {}

  async createOrganisation(
    organisation: organisationDto,
  ): Promise<Organisation> {
    const existingOrganisationByEmail =
      await this.prisma.organisation.findUnique({
        where: {
          email: organisation.adress,
        },
      });

    const existingOrganisationByFiscalId =
      await this.prisma.organisation.findUnique({
        where: {
          email: organisation.fiscalId,
        },
      });

    if (existingOrganisationByEmail || existingOrganisationByFiscalId) {
      throw new HttpException(
        'ORGANISATION WITH EMAIL OR FISCAL ID ALREADY EXIST',
        HttpStatus.CONFLICT,
      );
    }
    const newOrganisation = await this.prisma.organisation.create({
      data: organisation,
    });

    await this.walletService.createWallet({
      organisationId: newOrganisation.id,
      turnover: 0,
    });

    const userGenerated = {
      organisationId: newOrganisation.id,
      name: organisation.socialReason,
      phone: organisation.phone,
      email: organisation.email,
      address: organisation.adress,
      sex: 'male',
      role: Role.ADMINISTRATOR,
      status: UserStatusEnum.active,
    };

    await this.userService.createUser(userGenerated);

    return newOrganisation;
  }

  async getAllOrganisations(): Promise<Organisation[]> {
    return await this.prisma.organisation.findMany();
  }

  async getSingleOrganisation(id: string): Promise<Organisation> {
    try {
      const organisation = await this.prisma.organisation.findUnique({
        where: { id },
        include: {
          stocks: true,
          users: true,
          orders: true,
          transactions: true,
        },
      });
      return organisation;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleOrganisation(
    id: string,
    update: updateOrganisationDto,
  ): Promise<Organisation> {
    try {
      const updatedOrganisation = await this.prisma.organisation.update({
        where: { id },
        data: update,
      });
      return updatedOrganisation;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleOrganisation(id: string): Promise<Organisation> {
    try {
      await this.prisma.user.deleteMany({
        where: {
          organisationId: id,
        },
      });

      await this.prisma.stock.deleteMany({
        where: {
          organisationId: id,
        },
      });

      await this.prisma.order.deleteMany({
        where: {
          organisationId: id,
        },
      });

      await this.prisma.transaction.deleteMany({
        where: {
          organisationId: id,
        },
      });

      await this.prisma.wallet.deleteMany({
        where: {
          organisationId: id,
        },
      });
      const deletedOrganisation = await this.prisma.organisation.delete({
        where: { id },
      });
      return deletedOrganisation;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getUsersOfOrganisation(id: string): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { organisationId: id },
      });
      return users;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getDeliveryMenOfOrganisation(
    id: string,
    filterParams: any,
  ): Promise<PagiationPayload<User[]>> {
    try {
      const { page, perPage, q } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const userNameConstraint: any = {};
      const phoneConstraint: any = {};
      const emailConstraint: any = {};
      const w: any = {};
      w.organisationId = id;
      w.role = UserRoleEnum.deliveryMan;
      if (q != undefined && q != '') {
        userNameConstraint.name = {
          contains: q,
          mode: 'insensitive',
        };

        phoneConstraint.phone = {
          contains: q,
          mode: 'insensitive',
        };

        emailConstraint.email = {
          contains: q,
          mode: 'insensitive',
        };
        w.OR = [userNameConstraint, phoneConstraint, emailConstraint];
      }

      const users = await this.prisma.user.findMany({
        ...paginateConstraints,
        where: { ...w },
        include: {
          engine: true,
        },
      });

      const count = await this.prisma.user.count({
        where: {
          organisationId: id,
          role: UserRoleEnum.deliveryMan,
        },
      });

      return { data: users, count };
    } catch (error) {
      throw error;
      return;
    }
  }

  async searchForPartners(
    filterParams,
  ): Promise<PagiationPayload<Organisation[]>> {
    try {
      const { page, perPage, q, type } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const ownerNameConstraint: any = {};
      const phoneConstraint: any = {};
      const emailConstraint: any = {};
      const turnoverConstraint: any = {};
      const w: any = {};
      w.NOT = { type: OrganisationTypeEnum.snb };
      if (q != undefined && q != '') {
        ownerNameConstraint.ownerName = {
          contains: q,
          mode: 'insensitive',
        };

        phoneConstraint.phone = {
          contains: q,
          mode: 'insensitive',
        };

        emailConstraint.email = {
          contains: q,
          mode: 'insensitive',
        };

        if (!isNaN(q)) {
          turnoverConstraint.turnover = Number(q);
        }
        w.wallet = { ...turnoverConstraint };
        w.OR = [ownerNameConstraint, phoneConstraint, emailConstraint];
      }

      if (type != undefined && type != '') {
        w.type = type;
      }

      const organisations = await this.prisma.organisation.findMany({
        ...paginateConstraints,
        where: {
          ...w,
        },
        include: {
          wallet: true,
          orders: true,
        },
      });

      const count = await this.prisma.organisation.count({
        where: {
          type: type,
          NOT: {
            type: OrganisationTypeEnum.snb,
          },
        },
      });

      return { data: organisations, count };
    } catch (error) {
      throw error;
      return;
    }
  }

  async getMainOrganisationInfos(): Promise<any> {
    const snb = await this.prisma.organisation.findFirst({
      where: { type: OrganisationTypeEnum.snb },
      include: {
        wallet: true,
      },
    });

    const orders = await this.prisma.order.count({
      where: {
        organisationId: snb.id,
      },
    });

    const partners = await this.prisma.organisation.count({
      where: {
        type: OrganisationTypeEnum.snb,
      },
    });

    const pIds = await this.getAllProductsIds();

    const productsInfos = await Promise.all(
      pIds.map(async (id: string) => {
        return await this.getProdInfos(id);
      }),
    );

    return { snb, orders, partners, productsInfos };
  }

  async getAllProductsIds(): Promise<any> {
    const products = await this.prisma.product.findMany({
      take: 5,
      select: {
        id: true,
      },
    });

    const pIds = [];

    products.forEach((element) => {
      pIds.push(element.id);
    });

    return pIds;
  }

  async getProdInfos(id: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        image: true,
        id: true,
        unitPrice: true,
        name: true,
        stocks: true,
      },
    });

    const price = product.unitPrice;

    const images = product.image;

    const stocks = product.stocks;

    const name = product.name;

    let totalBulk = 0;

    let turnover = 0;

    stocks.forEach((element) => {
      totalBulk += element.currentQuantity;
      turnover += (element.originalQuantity - element.currentQuantity) * price;
    });

    return { id, name, images, totalBulk, turnover };
  }

  async getTopPartners(type: NonSnbOrganisations): Promise<Organisation[]> {
    const organisations = await this.prisma.organisation.findMany({
      where: {
        type: type,
      },
      include: {
        wallet: true,
      },
      orderBy: {
        wallet: {
          turnover: 'asc',
        },
      },
    });

    return organisations;
  }
}
