import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ActivityLog } from '@prisma/client';
import { activityDto, updateActivityDto } from './activity.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ActivityService } from './activity.service';

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiBody({ type: activityDto })
  @ApiCreatedResponse({
    description: 'The activity has been successfully created.',
  })
  createActivity(@Body() activity: activityDto): Promise<ActivityLog> {
    return this.activityService.createActivity(activity);
  }

  @Get()
  getAllActivities(): Promise<ActivityLog[]> {
    return this.activityService.getAllActivities();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleActivity(@Param() params): Promise<ActivityLog> {
    return this.activityService.getSingleActivity(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateSingleActivity(
    @Param() params,
    @Body() update: updateActivityDto,
  ): Promise<ActivityLog> {
    return this.activityService.updateSingleActivity(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteSingleActivity(@Param() params): Promise<ActivityLog> {
    return this.activityService.deleteSingleActivity(params.id);
  }
}
