import { Injectable } from '@nestjs/common';
import { User, ActivityLog } from '@prisma/client';
import { updateUserDto } from './user.dto';
import { PrismaService } from 'libs/prisma/src';
import { AuthService } from '../users-manager/auth.service';
import { generateRandomString } from 'helpers/generateRandomString';
import { PagiationPayload } from 'types';
import { NotificationService } from 'apps/notification/src/notification.service';
import { NOTIFICATION_MESSAGES } from 'apps/notification/src/constants.notifications';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private notifService: NotificationService,
  ) {}

  async createUser(user): Promise<User> {
    let token;
    try {
      const newUser = await this.prisma.user.create({
        data: user,
      });

      this.authService
        .register({
          username: user.email,
          email: user.email,
          password: generateRandomString(15),
        })
        .then((data) => {
          token = data.token;
          console.log('Token : ', token);
          this.notifService.sendEmail({
            email: user.email,
            object: 'Registration to SNB',
            body: NOTIFICATION_MESSAGES.registrationMail({
              email: user.email,
              token: token,
            }),
            sender: 'SNB',
          });
        });

      return newUser;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllUsers(): Promise<User[]> {
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

  async searchForUsersOfOrganisation(
    filterParams,
    orgId,
  ): Promise<PagiationPayload<User[]>> {
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
      const users = await this.prisma.user.findMany({
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

      const count = await this.prisma.user.count({
        where: { organisationId: orgId },
      });

      return { data: users, count };
    } catch (error) {
      throw error;
      return;
    }
  }
}
