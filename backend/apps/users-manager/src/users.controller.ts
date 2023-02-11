import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Req,
  Headers,
  Put,
} from '@nestjs/common';
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
  login(@Body() user: UserLoginDto) {
    return this.usersService.login(user);
  }

  @Get('me')
  me(@Req() req: Response) {
    const token = req.headers['x-auth-token'];
    console.log(token);
    return this.usersService.me(token);
  }

  @Get('getResetPasswordToken')
  getToken(@Body() user: UserGetResetDto) {
    return this.usersService.getResetPasswordToken(user);
  }

  @Put('resetPassword/:token')
  @ApiParam({ name: 'token' })
  reset(@Body() user: UserResetPasswordDto, @Param() params) {
    return this.usersService.resetPassword(user, params.token);
  }

  @Put(':id')
  updateUser(@Body() update: UserUpdateDto, @Param() params) {
    return this.usersService.updateUser(update, params.id);
  }

  @Get(':id')
  getSingleUser(@Param() params) {
    return this.usersService.getSingleUser(params.id);
  }
}
