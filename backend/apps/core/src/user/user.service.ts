import { Injectable } from '@nestjs/common';
import { User, ActivityLog } from '@prisma/client';
import { updateUserDto, userDto } from './user.dto';
import { PrismaService } from 'libs/prisma/src';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: userDto): Promise<User> {
    try {
      const newUser = await this.prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({});
      return users;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleUser(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleUser(id: string, update: updateUserDto): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: update,
      });
      return updatedUser;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleUser(id: string): Promise<User> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      return deletedUser;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getUserActivities(id: string): Promise<ActivityLog[]> {
    try {
      const activities = await this.prisma.activityLog.findMany({
        where: { actorId: id },
      });
      return activities;
    } catch (error) {
      throw error;
      return;
    }
  }

  async searchForUsersOfOrganisation(filterParams, orgId): Promise<User[]> {
    try {
      let Order = 'desc';
      const {
        page,
        perPage,
        order,
        userId,
        name,
        phone,
        engineName,
        status,
        role,
      } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const statusConstraint: any = {};
      if (status != undefined) {
        statusConstraint.status = status;
      }

      const roleConstraint: any = {};
      if (role != undefined) {
        roleConstraint.role = role;
      }

      const userIdConstraint: any = {};
      if (userId != undefined) {
        userIdConstraint.id = {
          contains: userId,
          mode: 'insensitive',
        };
      }

      const userNameConstraint: any = {};
      if (name != undefined) {
        userNameConstraint.name = {
          contains: name,
          mode: 'insensitive',
        };
      }

      const userPhoneConstraint: any = {};
      if (phone != undefined) {
        userNameConstraint.phone = {
          contains: phone,
          mode: 'insensitive',
        };
      }

      const userEngineNameConstraint: any = {};
      if (engineName != undefined) {
        userEngineNameConstraint.name = {
          contains: engineName,
          mode: 'insensitive',
        };
      }

      if (order != undefined) {
        Order = order;
      }
      const orders = await this.prisma.user.findMany({
        ...paginateConstraints,
        where: {
          organisationId: orgId,
          engine: {
            ...userEngineNameConstraint,
          },
          AND: [
            {
              ...userIdConstraint,
            },
            {
              ...userNameConstraint,
            },
            {
              ...userPhoneConstraint,
            },
            {
              ...statusConstraint,
            },
            {
              ...roleConstraint,
            },
          ],
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
