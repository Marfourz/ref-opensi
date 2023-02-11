import { Injectable } from '@nestjs/common';
import { Organisation, User, Stock } from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import { PrismaService } from 'libs/prisma/src';

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
}
