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
    console.log("user test",user)
    let token;
    const Dpassword = generateRandomString(15);
    try {
      const newUser = await this.prisma.user.create({
        data: user,
      });

      this.authService
        .register({
          username: user.email,
          email: user.email,
          password: Dpassword,
        })
        .then((Udata) => {
          this.authService
            .getResetPasswordToken({
              username: Udata.user.email,
            })
            .then((Tdata) => {
              token = Tdata.token;
              this.notifService.sendEmail({
                email: user.email,
                object: 'Registration to SNB',
                body: NOTIFICATION_MESSAGES.registrationMail({
                  name: user.name,
                  email: user.email,
                  token: token,
                }),
                sender: 'SNB',
              });
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

  async deleteSingleUser(id: string, uid: string): Promise<User> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });

      await this.authService.deleteUser(uid);
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
      const { page, perPage, q } = filterParams;

      const paginateConstraints: any = {};
      if (!isNaN(page) && !isNaN(perPage)) {
        paginateConstraints.skip = Number((page - 1) * perPage);
        paginateConstraints.take = Number(perPage);
      }

      const userIdConstraint: any = {};
      if (q != undefined) {
        userIdConstraint.id = {
          contains: q,
          mode: 'insensitive',
        };
      }

      const userNameConstraint: any = {};
      if (q != undefined) {
        userNameConstraint.name = {
          contains: q,
          mode: 'insensitive',
        };
      }

      const userEmailConstraint: any = {};
      if (q != undefined) {
        userNameConstraint.email = {
          contains: q,
          mode: 'insensitive',
        };
      }

      const userPhoneConstraint: any = {};
      if (q != undefined) {
        userNameConstraint.phone = {
          contains: q,
          mode: 'insensitive',
        };
      }

      const users = await this.prisma.user.findMany({
        ...paginateConstraints,
        where: {
          organisationId: orgId,
          AND: {
            OR: [
              {
                ...userIdConstraint,
              },
              {
                ...userEmailConstraint,
              },
              {
                ...userNameConstraint,
              },
              {
                ...userPhoneConstraint,
              },
            ],
          },
        },
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
