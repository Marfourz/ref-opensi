import { Controller, Get, Body, Post, Param, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserRegisterDto,
  UserLoginDto,
  UserGetResetDto,
  UserResetPasswordDto,
  UserUpdateDto,
} from './users.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.allUsers();
  }

  @Post('register')
  @ApiBody({ type: UserRegisterDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  register(@Body() user: UserRegisterDto) {
    return this.usersService.register(user);
  }

  @Post('login')
  @ApiBody({ type: UserLoginDto })
  login(@Body() user: UserLoginDto) {
    return this.usersService.login(user);
  }

  @Get('me')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  me(@Req() req: Response) {
    const token = req.headers['x-auth-token'];
    console.log(token);
    const user = this.usersService.me(token);
    return user;
  }

  @Post('getResetPasswordToken')
  @ApiBody({ type: UserGetResetDto })
  @ApiCreatedResponse({
    description: 'The user pasword token is generated.',
  })
  getToken(@Body() user: UserGetResetDto) {
    return this.usersService.getResetPasswordToken(user);
  }

  @Put('resetPassword/:token')
  @ApiParam({ name: 'token' })
  @ApiBody({ type: UserResetPasswordDto })
  reset(@Body() user: UserResetPasswordDto, @Param() params) {
    return this.usersService.resetPassword(user, params.token);
  }

  //63e7cc5af0279f121bc3fd5b
  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleUser(@Param() params) {
    return this.usersService.getSingleUser(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UserUpdateDto })
  updateUser(@Body() update: UserUpdateDto, @Param() params) {
    return this.usersService.updateUser(update, params.id);
  }
}
