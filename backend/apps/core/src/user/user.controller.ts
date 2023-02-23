import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PagiationPayload } from 'types';
import {
  User,
  ActivityLog,
  UserStatusEnum,
  UserRoleEnum,
} from '@prisma/client';
import { userDto, updateUserDto } from './user.dto';
import { OrderTypeEnum } from 'guards/order.type.enum';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { AuthService } from '../users-manager/auth.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiBody({ type: userDto })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  createUser(@Req() req, @Body() user: userDto): Promise<User> {
    if (!user.organisationId) {
      user.organisationId = req.user.orgId;
    }
    return this.userService.createUser(user);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
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

  @Get(':orgId/search')
  @ApiParam({ name: 'orgId' })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  searchForUsersOfOrganisation(
    @Query() filterParams: any,
    @Param() params,
  ): Promise<PagiationPayload<User[]>> {
    return this.userService.searchForUsersOfOrganisation(
      filterParams,
      params.orgId,
    );
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
  deleteSingleUser(@Req() req, @Param() params): Promise<User> {
    return this.userService.deleteSingleUser(params.id, req.user.uid);
  }
}
