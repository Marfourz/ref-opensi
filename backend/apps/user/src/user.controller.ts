import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, ActivityLog } from '@prisma/client';
import { userDto, updateUserDto } from './user.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: userDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  createUser(@Body() user: userDto): Promise<User> {
    return this.userService.createUser(user);
  }

  @Get()
  getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleUser(@Param() params): Promise<User> {
    return this.userService.getSingleUser(params.id);
  }

  @Get(':id/activities')
  @ApiParam({ name: 'id' })
  getUserActivities(@Param() params): Promise<ActivityLog[]> {
    return this.userService.getUserActivities(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateSingleUser(
    @Param() params,
    @Body() update: updateUserDto,
  ): Promise<User> {
    return this.userService.updateSingleUser(params.id, update);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteSingleUser(@Param() params): Promise<User> {
    return this.userService.deleteSingleUser(params.id);
  }
}
