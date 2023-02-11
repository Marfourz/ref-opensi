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
}
