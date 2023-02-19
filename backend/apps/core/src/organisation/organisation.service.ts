import { Injectable } from '@nestjs/common';
import { Organisation, User, OrganisationTypeEnum } from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import { PrismaService } from 'libs/prisma/src';
import { UserRoleEnum } from '@prisma/client';

@Injectable()
export class OrganisationService {
  constructor(private prisma: PrismaService) {}

  async createOrganisation(
    organisation: organisationDto,
  ): Promise<Organisation> {
    try {
      const newOrganisation = await this.prisma.organisation.create({
        data: organisation,
      });
      return newOrganisation;
    } catch (error) {
      throw error;
      return;
    }
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

  async getDeliveryMenOfOrganisation(id: string): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { organisationId: id, role: UserRoleEnum.deliveryMan },
      });
      return users;
    } catch (error) {
      throw error;
      return;
    }
  }

  async searchForPartners(filterParams): Promise<Organisation[]> {
    try {
      let Order = 'desc';
      const {
        page,
        perPage,
        order,
        ownerName,
        phone,
        email,
        turnover,
        status,
      } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const turnoverConstraint: any = {};
      if (!isNaN(turnover)) {
        turnoverConstraint.turnover = Number(turnover);
      }

      const ownerNameConstraint: any = {};
      if (ownerName != undefined) {
        ownerNameConstraint.ownerName = {
          contains: ownerName,
          mode: 'insensitive',
        };
      }

      const emailConstraint: any = {};
      if (email != undefined) {
        emailConstraint.email = {
          contains: email,
          mode: 'insensitive',
        };
      }

      const phoneConstraint: any = {};
      if (phone != undefined) {
        phoneConstraint.phone = {
          contains: phone,
          mode: 'insensitive',
        };
      }

      const statusConstraint: any = {};
      if (status != undefined) {
        statusConstraint.status = status;
      }

      if (order != undefined) {
        Order = order;
      }

      const orders = await this.prisma.organisation.findMany({
        ...paginateConstraints,
        where: {
          NOT: {
            type: OrganisationTypeEnum.snb,
          },
          AND: [
            {
              ...ownerNameConstraint,
            },
            {
              ...phoneConstraint,
            },
            {
              ...emailConstraint,
            },
            {
              ...statusConstraint,
            },
          ],
          wallet: {
            ...turnoverConstraint,
          },
        },
        include: {
          wallet: true,
        },
        orderBy: [
          {
            createdAt: Order,
          },
        ],
      });
      return orders;
    } catch (error) {
      throw error;
      return;
    }
  }
}
