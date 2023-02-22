import { Controller, Get, Body, Post, Param, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterDto,
  UserLoginDto,
  UserGetResetDto,
  UserResetPasswordDto,
  UserUpdateDto,
  UserChangePasswordDto,
} from './auth.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllUsers() {
    return this.authService.allUsers();
  }

  @Post('register')
  @ApiBody({ type: UserRegisterDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  register(@Body() user: UserRegisterDto) {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiBody({ type: UserLoginDto })
  login(@Body() user: UserLoginDto) {
    return this.authService.login(user);
  }

  @Get('me')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  me(@Req() req: Response) {
    const token = req.headers['x-auth-token'];
    const user = this.authService.me(token);
    return user;
  }

  @Post('getResetPasswordToken')
  @ApiBody({ type: UserGetResetDto })
  @ApiCreatedResponse({
    description: 'The user pasword token is generated.',
  })
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getToken(@Body() user: UserGetResetDto) {
    return this.authService.getResetPasswordToken(user);
  }

  @Put('resetPassword')
  @ApiBody({ type: UserResetPasswordDto })
  reset(@Body() user: UserResetPasswordDto) {
    return this.authService.resetPassword(user);
  }

  @Put('changePassword/:userId')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'userId' })
  @ApiBody({ type: UserChangePasswordDto })
  changePassword(@Body() update: UserChangePasswordDto, @Param() params) {
    return this.authService.changePassword(update, params.userId);
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleUser(@Param() params) {
    return this.authService.getSingleUser(params.id);
  }

  @Put(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UserUpdateDto })
  updateUser(@Body() update: UserUpdateDto, @Param() params) {
    return this.authService.updateUser(update, params.id);
  }
}
