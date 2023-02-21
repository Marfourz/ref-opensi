import { Injectable } from '@nestjs/common';
import { ActivityLog } from '@prisma/client';
import { activityDto, updateActivityDto } from './activity.dto';
import { PrismaService } from 'libs/prisma/src';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async createActivity(activity: activityDto): Promise<ActivityLog> {
    try {
      const newActivity = await this.prisma.activityLog.create({
        data: activity,
      });
      return newActivity;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllActivities(): Promise<ActivityLog[]> {
    return await this.prisma.activityLog.findMany();
  }

  async getSingleActivity(id: string): Promise<ActivityLog> {
    try {
      const activity = await this.prisma.activityLog.findUnique({
        where: { id },
        include: {
          actor: true,
        },
      });
      return activity;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleActivity(
    id: string,
    update: updateActivityDto,
  ): Promise<ActivityLog> {
    try {
      const updatedActivity = await this.prisma.activityLog.update({
        where: { id },
        data: update,
      });
      return updatedActivity;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleActivity(id: string): Promise<ActivityLog> {
    try {
      const deletedActivity = await this.prisma.activityLog.delete({
        where: { id },
      });
      return deletedActivity;
    } catch (error) {
      throw error;
      return;
    }
  }
}
