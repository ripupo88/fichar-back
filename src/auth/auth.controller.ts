import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from 'src/notifications/notifications.service';
import { RoleGuard } from 'src/shared/role.guard';
import { AuthService } from './auth.service';
import {
  ActivateUserDto,
  CreateUserDto,
  LoggedDto,
  LoginUserDto,
} from './dto/auth-credential.dto';
import { getUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private notification: NotificationsService,
  ) {}

  @Post('singup')
  SingUp(@Body() userData: CreateUserDto): Promise<LoggedDto> {
    return this.authService.singUp(userData);
  }

  @Post('singin')
  SingIn(@Body() userData: LoginUserDto): Promise<LoggedDto> {
    console.log(userData);
    return this.authService.singIn(userData);
  }

  @Post('activate')
  @UseGuards(AuthGuard())
  @UseGuards(RoleGuard(['ADMIN']))
  activateUser(@Body() activateUserDto: ActivateUserDto): Promise<User> {
    return this.authService.activateUser(activateUserDto);
  }

  @Post('token')
  @UseGuards(AuthGuard())
  token(@getUser() user: User): Promise<LoggedDto> {
    return this.authService.tokenIn(user._id);
  }

  @Get('baja/:id')
  @UseGuards(AuthGuard())
  @UseGuards(RoleGuard(['ADMIN']))
  stopUser(@Param('id') userId: string) {
    return this.authService.stopUser(userId);
  }
}
