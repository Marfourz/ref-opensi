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
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: userDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  createUser(@Body() user: userDto): Promise<User> {
    return this.userService.createUser(user);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllUser(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getSingleUser(@Param() params): Promise<User> {
    return this.userService.getSingleUser(params.id);
  }

  @Get(':id/activities')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getUserActivities(@Param() params): Promise<ActivityLog[]> {
    return this.userService.getUserActivities(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  updateSingleUser(
    @Param() params,
    @Body() update: updateUserDto,
  ): Promise<User> {
    return this.userService.updateSingleUser(params.id, update);
  }

  @Delete(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleUser(@Param() params): Promise<User> {
    return this.userService.deleteSingleUser(params.id);
  }
}
