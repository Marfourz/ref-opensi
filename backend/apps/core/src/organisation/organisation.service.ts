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
import * as dayjs from 'dayjs';
import {
  UserRoleEnum,
  OrderStatusEnum,
  OrganisationStatusEnum,
} from '@prisma/client';
import { WalletService } from '../wallet/wallet.service';
import { AuthService } from '../users-manager/auth.service';
import { NotificationService } from 'apps/notification/src/notification.service';
import { Role } from '../../../../guards/roles.enum';
import { UserService } from '../user/user.service';
import { constants } from 'buffer';
import { getSubTypeOrg } from 'helpers/getPlainStatus';

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
          email: organisation.email,
        },
      });

    const existingOrganisationByFiscalId =
      await this.prisma.organisation.findUnique({
        where: {
          fiscalId: organisation.fiscalId,
        },
      });

    if (existingOrganisationByEmail) {
      throw new HttpException(
        'Une organisation avec cet email existe déja',
        HttpStatus.CONFLICT,
      );
    }

    if (existingOrganisationByFiscalId) {
      throw new HttpException(
        'Une organisation avec cet IFU existe déja',
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
      name: organisation.ownerName,
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
    parentOrganisationId,
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
      w.parentOrganisationId = parentOrganisationId;
      w.NOT = {
        type: OrganisationTypeEnum.snb,
        status: OrganisationStatusEnum.inactive,
      };
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

  async getOrganisationTurnover(orgId: string) {
    const additionalConstraints: any = {};

    const organisation = await this.prisma.organisation.findUnique({
      where: {
        id: orgId,
      },
    });

    if (organisation.type == OrganisationTypeEnum.snb) {
      additionalConstraints.organisationId = orgId;
    }

    //get orders of organisation
    const turnover = await this.prisma.order.aggregate({
      where: {
        parentOrganisationId: orgId,
        status: OrderStatusEnum.delivered,
        ...additionalConstraints,
        //...dateRange,
      },
      _sum: {
        totalAmount: true,
      },
    });

    if(!turnover._sum.totalAmount) return 0;

    return turnover._sum.totalAmount;

  }

  async getOrganisationRanking(orgId: string, type: OrganisationTypeEnum) {
    const sistersOrganisation: any = await this.prisma.organisation.findMany({
      where: {
        type,
      },
      select: {
        id: true,
      },
    });

    const organisationTurnover = await this.getOrganisationTurnover(orgId);

    const countOrganisations = sistersOrganisation.length;

    for (let i = 0; i < sistersOrganisation.length; i++) {
      const element = sistersOrganisation[i];
      element.turnover = await this.getOrganisationTurnover(element.id);
    }

    let rank = countOrganisations;

    for (let i = 0; i < sistersOrganisation.length; i++) {
      const element = sistersOrganisation[i];
      if (element.turnover < organisationTurnover) {
        rank--;
      }
    }

    return { type, total: countOrganisations, rank };
  }

  async getOrganisationDashboardInfos(
    orgId: string,
    filterParams: any,
  ): Promise<any> {
    //get organisation
    let dateRange: any = {};

    if (filterParams.startDate && filterParams.endDate) {
      dateRange = {
        createdAt: {
          gte: new Date(filterParams.startDate).toISOString(),
          lte: new Date(filterParams.endDate).toISOString(),
        },
      };
    }

    const organisation = await this.prisma.organisation.findUnique({
      where: { id: orgId },
      include: {
        wallet: true,
      },
    });

    let orders;

    if (organisation.type === OrganisationTypeEnum.snb) {
      orders = await this.prisma.order.count({
        where: {
          organisation: {
            type: OrganisationTypeEnum.md,
          },
          parentOrganisationId: orgId,
          ...dateRange,
        },
      });
    } else {
      //get orders of organisation for deduct turnover
      orders = await this.prisma.order.count({
        where: {
          organisationId: orgId,
          ...dateRange,
        },
      });
    }

    //get orders of organisation
    const turnover = await this.getOrganisationTurnover(orgId);

    //get organisation ranking
    const ranking = await this.getOrganisationRanking(orgId, organisation.type);

    const subType = getSubTypeOrg(organisation.type);

    let partners = 0;

    if (subType != 'none') {
      partners = await this.prisma.organisation.count({
        where: {
          type: subType,
        },
      });
    }

    //get partners according to organisation type
    // MDs : count of all "master distributeurs"
    // DAs : count of all "distributeurs agrées"
    // DPs : count of all "dépots"

    //get stock of the organisation
    const stocks: any = await this.prisma.stock.findMany({
      where: {
        organisationId: orgId,
        ...dateRange,
      },
      include: {
        product: {
          include: {
            image: true,
          },
        },
      },
    });

    stocks.forEach((element) => {
      element.selledQuantity =
        element.originalQuantity - element.currentQuantity;
      element.productTurnover =
        element.product.bulkPrice *
        (element.originalQuantity - element.currentQuantity);
    });

    return {
      organisation,
      turnover,
      orders,
      partners,
      ranking,
      productsInfos: stocks,
    };
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

  async getTopPartners(
    type: NonSnbOrganisations,
    filterParams: any,
  ): Promise<Organisation[]> {
    let dateRange: any = {};
    if (filterParams.startDate && filterParams.endDate) {
      dateRange = {
        createdAt: {
          gte: new Date(filterParams.startDate).toISOString(),
          lte: new Date(filterParams.endDate).toISOString(),
        },
      };
    }

    const sistersOrganisation: any = await this.prisma.organisation.findMany({
      where: {
        type,
      },
      include: {
        wallet: true,
      },
    });

    console.log('[Sisters organisations returned] : ', sistersOrganisation);

    for (let i = 0; i < sistersOrganisation.length; i++) {
      console.log('[Passed in loop]');
      const element = sistersOrganisation[i];
      element.turnover = await this.getOrganisationTurnover(element.id);
      console.log('[Turnover returned] : ', element.turnover);
      await this.walletService.updateSingleWallet(element.wallet.id, {
        turnover: element.turnover,
      });
    }

    const organisations = await this.prisma.organisation.findMany({
      take: 10,
      where: {
        type: type,
        ...dateRange,
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

  async getTurnoverEvolution(id: string): Promise<any> {
    const monthsOfYear: any = [];
    const data: any = [];

    const year = new Date().getFullYear();

    monthsOfYear.push(year + '-01-01');

    for (let index = 1; index <= 12; index++) {
      monthsOfYear.push(dayjs().format(year + '-' + index + '-30'));
    }

    for (let i = 0; i < monthsOfYear.length; i++) {
      if (i === monthsOfYear.length - 1) {
        break;
      }
      const totalAmount = await this.getTurnoverOfPeriod(
        {
          gte: monthsOfYear[i],
          lte: monthsOfYear[i + 1],
        },
        id,
      );
      data.push({ month: monthsOfYear[i + 1], total: totalAmount });
    }

    return data;

    /*const orders = await this.prisma.order.findMany({
      where: {
        parentOrganisationId: id,
        status: OrderStatusEnum.delivered,
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });
    return orders;*/
  }

  async getTurnoverOfPeriod(period, id) {
    const organisation = await this.prisma.organisation.findUnique({
      where: {
        id,
      },
    });

    const additionalConstraints: any = {};

    if (organisation.type == OrganisationTypeEnum.snb) {
      additionalConstraints.organisationId = id;
    }

    return await this.prisma.order.aggregate({
      where: {
        parentOrganisationId: id,
        status: OrderStatusEnum.delivered,
        ...additionalConstraints,
        createdAt: {
          gte: new Date(period.gte).toISOString(),
          lte: new Date(period.lte).toISOString(),
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
  }
}
