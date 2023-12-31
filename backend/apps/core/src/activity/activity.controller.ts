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
  ApiHeader,
} from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

@ApiTags('Activités - Logs')
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiBody({ type: activityDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The activity has been successfully created.',
  })
  createActivity(@Body() activity: activityDto): Promise<ActivityLog> {
    return this.activityService.createActivity(activity);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllActivities(): Promise<ActivityLog[]> {
    return this.activityService.getAllActivities();
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleActivity(@Param() params): Promise<ActivityLog> {
    return this.activityService.getSingleActivity(params.id);
  }

  @Put(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  updateSingleActivity(
    @Param() params,
    @Body() update: updateActivityDto,
  ): Promise<ActivityLog> {
    return this.activityService.updateSingleActivity(params.id, update);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR, Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleActivity(@Param() params): Promise<ActivityLog> {
    return this.activityService.deleteSingleActivity(params.id);
  }
}
