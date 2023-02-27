import { Injectable } from '@nestjs/common';
import { Organisation, User, OrganisationTypeEnum } from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import { PrismaService } from 'libs/prisma/src';
import { PagiationPayload } from 'types';
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
      if (q != undefined) {
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
        where: { organisationId: id, role: UserRoleEnum.deliveryMan },
        include:{
          engine:true
        }
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

      if (type != undefined) {
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
}
